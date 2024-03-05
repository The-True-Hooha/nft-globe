import { OrbitControls } from "three/examples/jsm/Addons.js";
import createStarFieldArea from "@/lib/3d/star-field";
import * as THREE from "three";
import { useEffect } from "react";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/addons/renderers/CSS2DRenderer.js";

export default function GlobeMain() {
  let globalUniforms = {
    time: { value: 0 },
  };
  let rad = 5;
  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    camera.position.set(0.5, 0.5, 1).setLength(14);
    const renderer = new THREE.WebGL1Renderer({ antialias: true });
    renderer.setSize(w, h);
    document.body.appendChild(renderer.domElement);

    const earthGroup = new THREE.Group();
    earthGroup.rotation.z = (-23.4 * Math.PI) / 180;
    scene.add(earthGroup);
    new OrbitControls(camera, renderer.domElement);

    const detail = 12;
    const geometry = new THREE.IcosahedronGeometry(1, detail);
    const material = new THREE.MeshPhongMaterial({
      color: "#77C6A7",
      shininess: 5,
      // Set castShadow and receiveShadow properties to false
      // castShadow: false,
      // receiveShadow: false,
      // flatShading: true,
    });

    const earthMesh = new THREE.Mesh(geometry, material);
    // Set castShadow and receiveShadow properties to false for the mesh
    earthMesh.castShadow = false;
    earthMesh.receiveShadow = false;
    earthGroup.add(earthMesh);

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const stars = createStarFieldArea({ numStars: 2000 });
    scene.add(stars);

    const sunLight = new THREE.DirectionalLight(0xffffff, 5);
    sunLight.position.set(0, 10, 10);
    sunLight.intensity = 3;
    scene.add(sunLight);

    // const markerCount = 100;
    // let markerInfo = []; // information on markers
    // let gMarker = new THREE.PlaneGeometry();
    // let mMarker = new THREE.MeshBasicMaterial({
    //   color: 0xff3232,
    //   onBeforeCompile: (shader: any) => {
    //     shader.uniforms.time = globalUniforms.time;
    //     shader.vertexShader = `
    // 	attribute float phase;
    //   varying float vPhase;
    //   ${shader.vertexShader}
    // `.replace(
    //       `#include <begin_vertex>`,
    //       `#include <begin_vertex>
    //   	vPhase = phase; // de-synch of ripples
    //   `
    //     );
    //     //console.log(shader.vertexShader);
    //     shader.fragmentShader = `
    // 	uniform float time;
    //   varying float vPhase;
    // 	${shader.fragmentShader}
    // `.replace(
    //       `vec4 diffuseColor = vec4( diffuse, opacity );`,
    //       `
    //   vec2 lUv = (vUv - 0.5) * 2.;
    //   float val = 0.;
    //   float lenUv = length(lUv);
    //   val = max(val, 1. - step(0.25, lenUv)); // central circle
    //   val = max(val, step(0.4, lenUv) - step(0.5, lenUv)); // outer circle
      
    //   float tShift = fract(time * 0.5 + vPhase);
    //   val = max(val, step(0.4 + (tShift * 0.6), lenUv) - step(0.5 + (tShift * 0.5), lenUv)); // ripple
      
    //   if (val < 0.5) discard;
      
    //   vec4 diffuseColor = vec4( diffuse, opacity );`
    //     );
    //     //console.log(shader.fragmentShader)
    //   },
    // });
    // mMarker.defines = { USE_UV: " " }; // needed to be set to be able to work with UVs
    // let markers = new THREE.InstancedMesh(gMarker, mMarker, markerCount);

    // let dummy = new THREE.Object3D();
    // let phase = [];
    // for (let i = 0; i < markerCount; i++) {
    //   dummy.position.randomDirection().setLength(rad + 0.1);
    //   dummy.lookAt(dummy.position.clone().setLength(rad + 1));
    //   dummy.updateMatrix();
    //   markers.setMatrixAt(i, dummy.matrix);
    //   phase.push(Math.random());

    //   markerInfo.push({
    //     id: i + 1,
    //     mag: THREE.MathUtils.randInt(1, 10),
    //     crd: dummy.position.clone(),
    //   });
    // }
    // gMarker.setAttribute(
    //   "phase",
    //   new THREE.InstancedBufferAttribute(new Float32Array(phase), 1)
    // );

    // scene.add(markers);

    // function animate() {
    //   requestAnimationFrame(animate);
    //   earthMesh.rotation.y += 0.002;
    //   renderer.render(scene, camera);
    // }
    // animate();

    function handleWindowResize() {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener("resize", handleWindowResize, false);

    return () => {
      window.removeEventListener("resize", handleWindowResize, false);
      document.body.removeChild(renderer.domElement);
    };
  }, []);

  return null;
}
