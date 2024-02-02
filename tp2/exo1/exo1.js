import * as THREE from 'three';


// Scene
const scene = new THREE.Scene();


const objects = [];
 
// use just one sphere for everything

const sphereGeometry = new THREE.SphereGeometry(1, 6, 6);


// Solar sys

const solarSystem = new THREE.Object3D();
scene.add(solarSystem);
objects.push(solarSystem);


// Earth orbit

const earthOrbit = new THREE.Object3D();
earthOrbit.position.x = 10;
solarSystem.add(earthOrbit);
objects.push(earthOrbit);


// sun
 
const sunMaterial = new THREE.MeshPhongMaterial({emissive: 0xFFFF00});
const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
sunMesh.scale.set(5, 5, 5);  // make the sun large
solarSystem.add(sunMesh);
objects.push(sunMesh);


// earth

const earthMaterial = new THREE.MeshPhongMaterial({color: 0x2233FF, emissive: 0x112244});
const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
earthOrbit.add(earthMesh);
objects.push(earthMesh);


// Moon orbit

const moonOrbit = new THREE.Object3D();
moonOrbit.position.x = 2;
earthOrbit.add(moonOrbit);

// Moon


const moonMaterial = new THREE.MeshPhongMaterial({color: 0x888888, emissive: 0x222222});
const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
moonMesh.scale.set(.5, .5, .5);
moonOrbit.add(moonMesh);
objects.push(moonMesh);


const light = new THREE.PointLight(0xFFFFFF, 3);
scene.add(light);


const camera = new THREE.PerspectiveCamera(50, 800 / 600);
camera.position.set(0, 50, 0);
camera.up.set(0, 0, 1);
camera.lookAt(0, 0, 0);



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


let time = 0
const loop = () => {
    
    time += 0.01;

    objects.forEach((obj) => {
        obj.rotation.y = time;
    });

    renderer.render(scene, camera);
    window.requestAnimationFrame(loop);
}

loop();



