import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
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


const cubeGeometry = new THREE.BoxGeometry( 5, 5, 2 ); 
const cubeMaterial = new THREE.MeshBasicMaterial( {color: 0xffffee} ); 
const cube = new THREE.Mesh( cubeGeometry, cubeMaterial ); 
cube.translateY(5);
cube.castShadow = true; //default is false
cube.receiveShadow = false;
scene.add( cube );


const planeGeometry = new THREE.PlaneGeometry(15,15);
const planeMaterial = new THREE.MeshStandardMaterial( {color: 0xffffaa, side: THREE.DoubleSide} );
const plane = new THREE.Mesh( planeGeometry, planeMaterial );
plane.rotation.set(-Math.PI *0.5,0,0);
plane.receiveShadow = true;
scene.add( plane )




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

scene.add(new THREE.PointLightHelper(light));
scene.add(new THREE.GridHelper(25, 25));
scene.add( new THREE.CameraHelper( light.shadow.camera ) );

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
const loop = () => {
    controls.update();
    stats.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(loop);
}

loop();
