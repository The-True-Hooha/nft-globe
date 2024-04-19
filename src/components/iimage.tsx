import { FontLoader, OrbitControls } from "three/examples/jsm/Addons.js";
import createStarFieldArea from "@/lib/3d/star-field";
import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/addons/renderers/CSS2DRenderer.js";
import PadCard from "@/components/pad-card";
import { createRoot } from "react-dom/client";
import fetchPadDataResult from "@/lib/fetch.data";
import ZoomComponent from "@/components/zoom";

export default function Home() {
  const [isZoomed, setIsZoomed] = useState(false);
  const [zControls, setZControls]: any = useState(null);
  const controlsRef = useRef<OrbitControls | any>(null);
  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, w / h, 0.5, 1000);
    camera.position.set(0.5, 0.5, 1).setLength(14);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(innerWidth, innerHeight);
    document.body.appendChild(renderer.domElement);

    const stars = createStarFieldArea({ numStars: 2000 });
    scene.add(stars);

    const labelRender = new CSS2DRenderer();
    labelRender.setSize(w, h);
    labelRender.domElement.style.position = "absolute";
    labelRender.domElement.style.top = "0px";
    document.body.appendChild(labelRender.domElement);

    window.addEventListener("resize", onWindowResize);
    const controls = new OrbitControls(camera, labelRender.domElement);
    controlsRef.current = controls;
    controls.addEventListener("change", handleZoomChange);

    controls.enablePan = false;
    controls.minDistance = 6;
    controls.maxDistance = 15;
    controls.enableZoom = true;
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed *= 0.25;

    let globalUniforms = {
      time: { value: 0 },
    };

    const counter = 200000;
    const rad = 5;
    const sph = new THREE.Spherical();

    let r = 0;
    const dlong = Math.PI * (3 - Math.sqrt(5));
    const dz = 2 / counter;
    let long = 0;
    let z = 1 - dz / 2;
    const pts = [];
    const clr: any = [];
    const c = new THREE.Color();
    const uvs = [];
    for (let i = 0; i < counter; i++) {
      r = Math.sqrt(1 - z * z);
      let p = new THREE.Vector3(
        Math.cos(long) * r,
        z,
        -Math.sin(long) * r
      ).multiplyScalar(rad);
      pts.push(p);
      z = z - dz;
      long = long + dlong;

      c.setHSL(0.45, 0.5, Math.random() * 0.25 + 0.25);
      c.toArray(clr, i * 3);

      sph.setFromVector3(p);
      uvs.push((sph.theta + Math.PI) / (Math.PI * 2), 1.0 - sph.phi / Math.PI);
    }

    const detail = 12;
    const ambientLight = new THREE.AmbientLight(0xffffff, 4); // Add ambient light
    scene.add(ambientLight);
    const sunLight = new THREE.DirectionalLight(0xffffff);
    sunLight.position.set(-2, 0.5, 1.5);
    sunLight.intensity = 1;
    scene.add(sunLight);

    let g = new THREE.BufferGeometry().setFromPoints(pts);
    g.setAttribute("color", new THREE.Float32BufferAttribute(clr, 3));
    g.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
    let m = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      //@ts-ignore comment
      onBeforeCompile: (shader: any) => {
        shader.uniforms.globeTexture = {
          value: new THREE.TextureLoader().load("/assets/02_earthspec1k.jpg"),
        };
        shader.vertexShader = `
    	uniform sampler2D globeTexture;
      varying float vVisibility;
      varying vec3 vNormal;
      varying vec3 vMvPosition;
      ${shader.vertexShader}
    `.replace(
          `gl_PointSize = size;`,
          `
      	vVisibility = texture(globeTexture, uv).g; // get value from texture
        gl_PointSize = size * (vVisibility < 0.5 ? 1. : 0.75); // size depends on the value
        vNormal = normalMatrix * normalize(position);
        vMvPosition = -mvPosition.xyz;
        gl_PointSize *= 0.4 + (dot(normalize(vMvPosition), vNormal) * 0.6); // size depends position in camera space
      `
        );
        shader.fragmentShader = `
    	varying float vVisibility;
      varying vec3 vNormal;
      varying vec3 vMvPosition;
      ${shader.fragmentShader}
    `.replace(
          `vec4 diffuseColor = vec4( diffuse, opacity );`,
          `
      	bool circ = length(gl_PointCoord - 0.5) > 0.5; // make points round
        bool vis = dot(vMvPosition, vNormal) < 0.; // visible only on the front side of the sphere
      	if (circ || vis) discard;
        
        vec3 col = diffuse + (vVisibility > 0.5 ? 0.5 : 0.); // make oceans brighter
        
        vec4 diffuseColor = vec4( col, opacity );
      `
        );
      },
    });
    const material = new THREE.MeshBasicMaterial({
      color: "#77C6A7",
    });

    const geometry = new THREE.IcosahedronGeometry(1, detail);
    let globe = new THREE.Points(g, m);
    // scene.add(globe);

    let icshdrn = new THREE.Mesh(
      new THREE.IcosahedronGeometry(rad, 1),
      // new THREE.MeshBasicMaterial({ color: 0x647f7f, wireframe: true })
      new THREE.MeshPhongMaterial({
        color: "#77C6A7",
        shininess: 5,
      })
    );

    const sg = new THREE.SphereGeometry(5, 50, 50);
    const earthMesh = new THREE.Mesh(sg, material);
    const earthGroup = new THREE.Group();
    earthGroup.add(earthMesh);
    scene.add(earthGroup);

    globe.add(icshdrn);
    const markerCount = 100;
    const markerInfo: any = [];
    const gMarker = new THREE.PlaneGeometry();
    let mMarker = new THREE.MeshBasicMaterial({
      color: 0x0000ff, // changed the marker color
      side: THREE.DoubleSide, // add a new prop
      transparent: true,
      opacity: 0.8,
      //@ts-ignore comment
      onBeforeCompile: (shader: any) => {
        shader.uniforms.time = globalUniforms.time;
        shader.vertexShader = `
    	attribute float phase;
      varying float vPhase;
      ${shader.vertexShader}
    `.replace(
          `#include <begin_vertex>`,
          `#include <begin_vertex>
      	vPhase = phase; // de-synch of ripples
      `
        );
        shader.fragmentShader = `
    	uniform float time;
      varying float vPhase;
    	${shader.fragmentShader}
    `.replace(
          `vec4 diffuseColor = vec4( diffuse, opacity );`,
          `
      vec2 lUv = (vUv - 0.5) * 2.;
      float val = 0.;
      float lenUv = length(lUv);
      val = max(val, 1. - step(0.25, lenUv)); // central circle
      val = max(val, step(0.4, lenUv) - step(0.5, lenUv)); // outer circle
      
      float tShift = fract(time * 0.5 + vPhase);
      val = max(val, step(0.4 + (tShift * 0.6), lenUv) - step(0.5 + (tShift * 0.5), lenUv)); // ripple
      
      if (val < 0.5) discard;
      
      vec4 diffuseColor = vec4( diffuse, opacity );`
        );
      },
    });
    mMarker.defines = { USE_UV: " " };
    let markers = new THREE.InstancedMesh(gMarker, mMarker, markerCount);

    let dummy = new THREE.Object3D();
    let phase: any[] = [];

    for (let i = 0; i < markerCount; i++) {
      const id = i + 1;
      dummy.position.randomDirection().setLength(rad + 0.1);
      dummy.lookAt(dummy.position.clone().setLength(rad + 1));
      dummy.updateMatrix();
      markers.setMatrixAt(i, dummy.matrix);
      phase.push(Math.random());

      fetchPadDataResult().then((data) => {
        const padData = data[i % data.length];
        markerInfo[i] = {
          id: id,
          mag: THREE.MathUtils.randInt(1, 10),
          crd: dummy.position.clone(),
          padData: padData,
        };

        const labelDiv = document.createElement("div");
        labelDiv.textContent = markerInfo[i].padData.name;
        labelDiv.classList.add("label");
        labelDiv.style.color = "white";
        labelDiv.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        labelDiv.style.padding = "4px 8px";
        labelDiv.style.borderRadius = "4px";
        labelDiv.style.fontSize = "14px";
        labelDiv.style.pointerEvents = "none";
      });
    }
    gMarker.setAttribute(
      "phase",
      new THREE.InstancedBufferAttribute(new Float32Array(phase), 1)
    );
    scene.add(markers);
    const clock = new THREE.Clock();
    renderer.setAnimationLoop(() => {
      let t = clock.getElapsedTime();
      globalUniforms.time.value = t;
      controls.update();
      renderer.render(scene, camera);
    });

    function onWindowResize() {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener("resize", onWindowResize, false);
    const pointer = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    let intersections: any[];

    window.addEventListener("pointerdown", (event) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      intersections = raycaster.intersectObject(markers).filter((m) => {
        //@ts-ignore comment
        return m.uv.subScalar(0.5).length() * 2 < 0.25;
      });

      if (intersections.length > 0) {
        let marker = intersections[0];
        let clickedMarkerId = marker.instanceId;
        let clickedMarkerData = markerInfo.find(
          (info: any) => info.id === clickedMarkerId
        );
        if (clickedMarkerData) {
          let i = 0;
          if (clickedMarkerData?.padData) {
            displayCardComponent(clickedMarkerData);
          } else {
            fetchPadDataResult().then((data) => {
              const padData = data[i % data.length];
              displayCardComponent(padData);
            });
          }
        }
      }
    });

    function displayCardComponent(markerData: any) {
      const cardDiv = document.createElement("div");
      const viewPortHeight = window.innerHeight;
      cardDiv.id = "cardComponent";
      cardDiv.classList.add("hidden");
      cardDiv.style.position = "fixed";
      cardDiv.style.top = viewPortHeight < 768 ? "10%" : "40%";
      cardDiv.style.left = "50%";
      cardDiv.style.transform = "translate(-50%, -50%)";

      document.body.appendChild(cardDiv);
      const maxMobileHeight = 200;
      const maxLargeHeight = 300;
      const viewportWidth = window.innerWidth;

      const cardHeight =
        viewportWidth < 768
          ? Math.min(window.innerHeight * 0.8, maxMobileHeight)
          : Math.min(window.innerHeight * 0.6, maxLargeHeight);
      cardDiv.style.height = `${cardHeight}px`;

      const content = document.createElement("div");
      content.classList.add("card-content");
      cardDiv.appendChild(content);

      const onClose = () => {
        document.body.removeChild(cardDiv);
      };
      const root = createRoot(content);
      root.render(<PadCard imageData={markerData.padData} onClose={onClose} />);

      cardDiv.classList.remove("hidden");
    }

    return () => {
      controls.removeEventListener("change", handleZoomChange);
      window.removeEventListener("resize", onWindowResize, false);
      document.body.removeChild(renderer.domElement);
    };
  }, []);

  const handleZoomChange = () => {
    if (controlsRef.current) {
      const distance = controlsRef.current.getDistance();
      const zoomThreshold = 7;
      if (distance <= zoomThreshold && !isZoomed) {
        setIsZoomed(true);
        controlsRef.current.autoRotate = false;
      } else if (distance > zoomThreshold) {
        setIsZoomed(false);
        controlsRef.current.autoRotate = true;
      }
    }
  };

  return (
    <>
      {isZoomed && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: isZoomed ? 1 : -999,
          }}
        >
          <ZoomComponent />
        </div>
      )}
    </>
  );
}
