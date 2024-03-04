import { OrbitControls } from "three/examples/jsm/Addons.js";
import createStarFieldArea from "@/lib/3d/star-field";
import * as THREE from "three";
import { useEffect, useRef } from "react";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/addons/renderers/CSS2DRenderer.js";


export default function GlobeWithMakers() {
  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    camera.position.set(0.5, 0.5, 1).setLength(14);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(innerWidth, innerHeight);
    // set the color to be green or make the sky dark
    renderer.setClearColor(0xaaffaa);

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
    controls.enablePan = false;
    controls.minDistance = 6;
    controls.maxDistance = 15;
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

    const earthGroup = new THREE.Group();
    // earthGroup.rotation.z = (-23.4 * Math.PI) / 180;
    // scene.add(earthGroup);

    const detail = 12;
    const geometry = new THREE.IcosahedronGeometry(1, detail);
    const material = new THREE.MeshPhongMaterial({
      color: "#77C6A7",
      shininess: 5,
      flatShading: false,
    });
    const earthMesh = new THREE.Mesh(geometry, material);
    // earthGroup.add(earthMesh);
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
        //console.log(shader.vertexShader);
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
        //console.log(shader.fragmentShader);
      },
    });
    let globe = new THREE.Points(g, m);
    scene.add(globe);

    // <ICOSAHEDRON>
    let icshdrn = new THREE.Mesh(
      new THREE.IcosahedronGeometry(rad, 1),
      new THREE.MeshBasicMaterial({ color: 0x647f7f, wireframe: true })
    );
    globe.add(icshdrn);
    // </ICOSAHEDRON>
    // </GLOBE>

    // handle the markers on the globe
    const markerCount = 100;
    const markerInfo = [];
    const gMarker = new THREE.PlaneGeometry();
    let mMarker = new THREE.MeshBasicMaterial({
      color: 0xff3232,
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
        //console.log(shader.vertexShader);
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
        //console.log(shader.fragmentShader)
      },
    });
    mMarker.defines = { USE_UV: " " }; // needed to be set to be able to work with UVs
    let markers = new THREE.InstancedMesh(gMarker, mMarker, markerCount);

    let dummy = new THREE.Object3D();
    let phase = [];
    for (let i = 0; i < markerCount; i++) {
      dummy.position.randomDirection().setLength(rad + 0.1);
      dummy.lookAt(dummy.position.clone().setLength(rad + 1));
      dummy.updateMatrix();
      markers.setMatrixAt(i, dummy.matrix);
      phase.push(Math.random());

      markerInfo.push({
        id: i + 1,
        mag: THREE.MathUtils.randInt(1, 10),
        crd: dummy.position.clone(),
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
      // track the label visibility
      // label.userData.trackVisibility()
      controls.update();
      renderer.render(scene, camera);
      labelRender.render(scene, camera);
    });

    function onWindowResize() {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener("resize", onWindowResize, false);

    return () => {
      window.removeEventListener("resize", onWindowResize, false);
      document.body.removeChild(renderer.domElement);
    };
  }, []);
  return null;
}

function addMarkersToGlobe(
  globe: THREE.Mesh,
  markerCount: number,
  scene: THREE.Scene
) {
  const markersGroup = new THREE.Group();

  const globeRadius = (globe.geometry as THREE.SphereGeometry).parameters
    .radius;

  for (let i = 0; i < markerCount; i++) {
    const marker = createMarker(0xff0000); // Red marker color, you can customize the color
    const latitude = Math.random() * Math.PI - Math.PI / 2; // Random latitude (-π/2 to π/2)
    const longitude = Math.random() * 2 * Math.PI - Math.PI; // Random longitude (-π to π)

    // Calculate marker position on the globe surface
    marker.position.setFromSphericalCoords(globeRadius, latitude, longitude);

    // Align marker to face outward from the center of the globe
    marker.lookAt(globe.position);

    markersGroup.add(marker);
  }

  scene.add(markersGroup);
}

function createMarker(color: number): THREE.Mesh {
  const geometry = new THREE.SphereGeometry(0.05, 32, 32); // Adjust the size as needed
  const material = new THREE.MeshBasicMaterial({ color });
  return new THREE.Mesh(geometry, material);
}
