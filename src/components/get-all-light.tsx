import { OrbitControls } from "three/examples/jsm/Addons.js";
import createStarFieldArea from "@/lib/3d/star-field";
import * as THREE from "three";
import { useEffect, useRef } from "react";

export default function GlobeMain() {
  const controls: any = useRef(null);

  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    camera.position.z = 5;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    document.body.appendChild(renderer.domElement);

    const earthGroup = new THREE.Group();
    earthGroup.rotation.z = (-23.4 * Math.PI) / 180;
    scene.add(earthGroup);
    controls.current = new OrbitControls(camera, renderer.domElement);

    const detail = 12;
    const geometry = new THREE.IcosahedronGeometry(1, detail);
    const material = new THREE.MeshPhongMaterial({
      color: "#77C6A7", // Set the hex color value for the Earth mesh
      shininess: 10, // Adjust the shininess for specular highlights
      flatShading: false, // Enable smooth shading for a more realistic appearance
    });

    const earthMesh = new THREE.Mesh(geometry, material);
    earthGroup.add(earthMesh);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Add ambient light
    scene.add(ambientLight);

    const stars = createStarFieldArea({ numStars: 2000 });
    scene.add(stars);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1);
    sunLight.position.set(-2, 0.5, 1.5);
    scene.add(sunLight);

    function animate() {
      requestAnimationFrame(animate);
      earthMesh.rotation.y += 0.002;
      controls.current.update(); // Update controls
      renderer.render(scene, camera);

      // Update sunlight direction
      const cameraDirection = new THREE.Vector3(0, 0, -1);
      cameraDirection.applyQuaternion(camera.quaternion);
      sunLight.position.copy(cameraDirection);
    }
    animate();

    function handleWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
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
