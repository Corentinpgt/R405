import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


// Scene
const scene = new THREE.Scene();


// Sphere
const geometry = new THREE.SphereGeometry(3, 30, 30);

const material = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: .5,
    metalness: .5,
    reflectivity: .5,
    clearCoat: 0.5,
    clearCoatRoughness: 0.5,
    lights: true,
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
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);


window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
});


// let  degreeY = 0;
// const loop = () => {
//     // mesh.rotateY(degreeY+0.01)
//     degreeY+=0.05;
//     light.position.set(10*Math.cos(degreeY), 10 , 10*Math.sin(degreeY))

//     renderer.render(scene, camera);
//     window.requestAnimationFrame(loop);
// }
// loop();

let angle = 0;
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
const loop = () => {
    // mesh.rotateY(angle+0.01);
    angle+=0.05
    
    
    // light.position.set(10*Math.cos(angle), 10 , 10*Math.sin(angle))
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(loop);
}

loop();

scene.add(new THREE.AxesHelper(10));
scene.add(new THREE.PointLightHelper(light));
scene.add(new THREE.GridHelper(10, 15));

gsap.fromTo(mesh.scale, {x: 1, y: 1, z: 1}, {x: 1.3, y: 1.3, z: 1.3, duration: 1, ease:"elastic"});


window.addEventListener("mousedown", (ev) => {
    let x = Math.round(ev.pageX/2);
    let y = Math.round(ev.pageY/2);
    let z = Math.floor(Math.random() * 255);
    gsap.to(mesh.material.color, {r: x, g: y, b: z});
    console.log(x,y,z);
});
 