import { OrbitControls } from "three/examples/jsm/Addons.js";
import createStarFieldArea from "@/lib/3d/star-field";
import * as THREE from "three";
import {     useEffect } from "react";
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
