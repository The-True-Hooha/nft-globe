import { OrbitControls } from "three/examples/jsm/Addons.js";
import getMaterials from "@/lib/3d/materials-options";
import createStarFieldArea from "@/lib/3d/star-field";
import * as THREE from "three";
import { useEffect } from "react";

export default function GlobeMain() {
  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    camera.position.z = 5;
    const renderer = new THREE.WebGL1Renderer({ antialias: true });
    renderer.setSize(w, h);
    document.body.appendChild(renderer.domElement);

    const earthGroup = new THREE.Group();
    earthGroup.rotation.z = (-23.4 * Math.PI) / 180;
    scene.add(earthGroup);
    new OrbitControls(camera, renderer.domElement);

    const detail = 12;
    const loader = new THREE.TextureLoader();
    const geometry = new THREE.IcosahedronGeometry(1, detail);
    const material = new THREE.MeshPhongMaterial({
      map: loader.load("/assets/00_earthmap1k.jpg"),
      specularMap: loader.load("/assets/02_earthspec1k.jpg"),
      bumpMap: loader.load("/assets/01_earthbump1k.jpg"),
      bumpScale: 0.04,
    });

    const earthMesh = new THREE.Mesh(geometry, material);

    earthGroup.add(earthMesh);

    const lightsMat = new THREE.MeshBasicMaterial({
      map: loader.load("/assets/03_earthlights1k.jpg"),
      blending: THREE.AdditiveBlending,
    });

    const lightMesh = new THREE.Mesh(geometry, lightsMat);
    earthGroup.add(lightMesh);

    const cloudMat = new THREE.MeshStandardMaterial({
      map: loader.load("/assets/04_earthcloudmap.jpg"),
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      alphaMap: loader.load("/assets/05_earthcloudmaptrans.jpg"),
      // alphaTest: 0.3
    });

    const cloudMesh = new THREE.Mesh(geometry, cloudMat);
    cloudMesh.scale.setScalar(1.003);
    earthGroup.add(cloudMesh);

    const fresnelMat = getMaterials();
    const glowMesh = new THREE.Mesh(geometry, fresnelMat);
    glowMesh.scale.setScalar(1.01);
    earthGroup.add(glowMesh);

    const stars = createStarFieldArea({ numStars: 2000 });
    scene.add(stars);

    const sunLight = new THREE.DirectionalLight(0xffffff);
    sunLight.position.set(-2, 0.5, 1.5);
    sunLight.intensity = 0.2;
    scene.add(sunLight);

    function animate() {
      requestAnimationFrame(animate);
      earthMesh.rotation.y += 0.002;
      lightMesh.rotation.y += 0.002;
      cloudMesh.rotation.y += 0.0023;
      glowMesh.rotation.y += 0.002;
      stars.rotation.y -= 0.0002;
      renderer.render(scene, camera);
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
