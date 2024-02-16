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

const sphereGeometry = new THREE.SphereGeometry(4, 4, 4);
const cylinderGeometry = new THREE.CylinderGeometry( 2, 2, 20, 32 ); 


// Rotation sys

const rotationSystem = new THREE.Object3D();
rotationSystem.position.set(0,20,0);
scene.add(rotationSystem);


// Cylinder orbit




// Main cylinder
 
const mainCylinderMaterial = new THREE.MeshBasicMaterial({color: 0xffff00});
const mainCylinderMesh = new THREE.Mesh(cylinderGeometry, mainCylinderMaterial);
// sunMesh.scale.set(5, 5, 5);
mainCylinderMesh.rotation.set(Math.PI * 0.5, 0, 0)
rotationSystem.add(mainCylinderMesh);


// cylinder

const cylinderMaterial = new THREE.MeshBasicMaterial({ color: 0x2233FF });
const ballMaterial = new THREE.MeshBasicMaterial({color: 0x888888});

for (let i = 3; i < 4; i+=0.2) {
    const cylinderOrbit = new THREE.Object3D();
    const cylinderMesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    const cylinderHeight = cylinderMesh.geometry.parameters.height * (i / 5);
    cylinderMesh.scale.set(0.5, i/5, 0.5);
    cylinderMesh.position.set(0, -cylinderHeight/2-1, i *20); // Positionnez les cylindres le long de l'axe z
    cylinderOrbit.add(cylinderMesh);

    const ballMesh = new THREE.Mesh(sphereGeometry, ballMaterial);
    ballMesh.scale.set(.5, .5, .5);
    ballMesh.position.set(0, -cylinderHeight, i*20)

    cylinderOrbit.add(ballMesh);
    cylinderOrbit.position.set(0,0,-68)


    rotationSystem.add(cylinderOrbit)
    objects.push(cylinderOrbit);
}
console.log(objects);


// Ball
let vitessesIndividuelles = [];
for (let i = 1; i < 6; i++) {
    vitessesIndividuelles.push(i/100); // 
}


let go = false;

scene.add(new THREE.GridHelper(25, 25));
scene.add(new THREE.AxesHelper( 5 ))

let rotation = 0;
let direction = 1;
const loop = () => {
    
    if (go) {    

        objects.forEach((obj, index) => {
            rotation += vitessesIndividuelles[index] * direction;

            if (Math.abs(rotation) >= Math.PI / 2) {
                direction *= -1;
            }

            obj.rotation.z=rotation;
            console.log("Vitesses individuelles :", vitessesIndividuelles[index]);
        });
    }

    controls.update();
    stats.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(loop);
}

loop();

function bool() {
    go = true;
}

document.body.addEventListener("keydown", bool);