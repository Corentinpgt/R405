import * as THREE from 'three';


// Scene
const scene = new THREE.Scene();


// Sphere
const geometry = new THREE.SphereGeometry(3, 16, 16);

const material = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: .6,
    metalness: 1,
    reflectivity: 1,
    flatShading: true
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);


// Light
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 10, 10);
scene.add(light);
const aLight = new THREE.AmbientLight(0xffffff);
scene.add(aLight);


// Camera
const camera = new THREE.PerspectiveCamera(45, 800 / 600);
camera.position.z = 20;
scene.add(camera);


// Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(800, 600);
renderer.render(scene, camera);