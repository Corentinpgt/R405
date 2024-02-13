import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import Stats from 'three/addons/libs/stats.module.js';

const container = document.getElementById('container');
const stats = new Stats();
container.appendChild(stats.dom);



const gui = new GUI();



// Scene
const scene = new THREE.Scene();
scene.background = new THREE.CubeTextureLoader().setPath('textures/cubeMaps/').load([
    'posx.jpg',
    'negx.jpg',
    'posy.jpg',
    'negy.jpg',
    'posz.jpg',
    'negz.jpg',
]);




const camera = new THREE.PerspectiveCamera(50, 800 / 600);
camera.position.set(0, 50, 0);
camera.up.set(0, 0, 1);
camera.lookAt(0, 0, 0);






let light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(50, 100, 10);
light.target.position.set(0, 0, 0);
light.castShadow = true;
scene.add(light);

light.shadow.bias = -0.001;
light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;
light.shadow.camera.near = 50;
light.shadow.camera.far = 150;
light.shadow.camera.left = 100;
light.shadow.camera.right = -100;
light.shadow.camera.top = 100;
light.shadow.camera.bottom = -100;




const planeGeometry = new THREE.PlaneGeometry(50,50);
const planeMaterial = new THREE.MeshStandardMaterial( {color: 0xffffaa, side: THREE.DoubleSide} );
const plane = new THREE.Mesh( planeGeometry, planeMaterial );
plane.rotation.set(-Math.PI *0.5,0,0);
plane.receiveShadow = true;
// scene.add( plane )




const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.shadowMap.enabled = true; 
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
});

// scene.add(new THREE.PointLightHelper(light));
// scene.add(new THREE.GridHelper(25, 25));
// scene.add( new THREE.CameraHelper( light.shadow.camera ) );

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;


const objects = [];
 
// use just one sphere for everything

const sphereGeometry = new THREE.SphereGeometry(1, 6, 6);
const cylinderGeometry = new THREE.CylinderGeometry( 2, 2, 20, 32 ); 


// Rotation sys

const rotationSystem = new THREE.Object3D();
rotationSystem.position.set(0,10,0);
scene.add(rotationSystem);
objects.push(rotationSystem);


// Cylinder orbit

const cylinderOrbit = new THREE.Object3D();
rotationSystem.add(cylinderOrbit);
objects.push(cylinderOrbit);


// Main cylinder
 
const mainCylinderMaterial = new THREE.MeshBasicMaterial({color: 0xffff00});
const mainCylinderMesh = new THREE.Mesh(cylinderGeometry, mainCylinderMaterial);
// sunMesh.scale.set(5, 5, 5);
mainCylinderMesh.rotation.set(Math.PI * 0.5, 0, 0)
rotationSystem.add(mainCylinderMesh);
objects.push(mainCylinderMesh);


// cylinder

const cylinderMaterial = new THREE.MeshBasicMaterial({color: 0x2233FF});
const cylinderMesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
cylinderMesh.scale.set(0.5, 0.4, 0.5)
cylinderMesh.position.set(0, -3, 0)
cylinderOrbit.add(cylinderMesh);
objects.push(cylinderMesh);


// Ball orbit

// const moonOrbit = new THREE.Object3D();
// moonOrbit.position.x = 2;
// earthOrbit.add(moonOrbit);

// Ball


// const moonMaterial = new THREE.MeshPhongMaterial({color: 0x888888, emissive: 0x222222});
// const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
// moonMesh.scale.set(.5, .5, .5);
// moonOrbit.add(moonMesh);
// objects.push(moonMesh);

let go = false

scene.add(new THREE.GridHelper(25, 25));
scene.add(new THREE.AxesHelper( 5 ))

let time = 0
const loop = (value) => {
    
    go = value;
    if (go) {
        if (time<Math.PI/2) {
            time += 0.01;
            rotationSystem.rotation.z = time;
        }
        else {
            time= -time;
        }
    }
    console.log(time);

    controls.update();
    stats.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(loop);
}

// loop();


document.body.addEventListener("keydown", loop(true));