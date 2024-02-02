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
    'px.jpg',
    'nx.jpg',
    'py.jpg',
    'ny.jpg',
    'pz.jpg',
    'nz.jpg'
]);

const objects = [];
 
// use just one sphere for everything

const sphereGeometry = new THREE.SphereGeometry(1, 6, 6);


// Solar sys

let solarSystem = new THREE.Object3D();
scene.add(solarSystem);
objects.push(solarSystem);




// Earth orbit

const earthOrbit = new THREE.Object3D();
earthOrbit.position.x = 10;
solarSystem.add(earthOrbit);
objects.push(earthOrbit);


// sun
 

const sunMaterial = new THREE.MeshPhongMaterial({
    emissive: 0xffff00,
    emissiveMap: new THREE.TextureLoader().load('./textures/sun/sun.jpg'),
    emissiveIntensity: 1
}); 
const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
sunMesh.scale.set(5, 5, 5);  // make the sun large
sunMesh.name = "sun";
solarSystem.add(sunMesh);
objects.push(sunMesh);
console.log(sunMesh);


// earth

const earthColor = "./textures/earth/earthmap1k.jpg";
const earthBump = "./textures/earth/earthbump1k.jpg";
const earthSpec = "./textures/earth/earthspec1k.jpg";
const textureLoader = new THREE.TextureLoader();
const earthMaterial = new THREE.MeshPhongMaterial({
   map: textureLoader.load(earthColor),
   bumpMap: textureLoader.load(earthBump),
   specularMap: textureLoader.load(earthSpec),
   bumpScale: 0.25,
   shininess: 1
});

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



const geometry = new THREE.TorusGeometry( 2, 0.1, 3, 100 ); 
const material = new THREE.MeshBasicMaterial( { color: 0xffffff } ); 
const torus = new THREE.Mesh( geometry, material ); scene.add( torus );
console.log(torus);
earthOrbit.add(torus);

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



const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
const loop = () => {
    controls.update();
    stats.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(loop);
}

loop();

scene.add(new THREE.PointLightHelper(light));
scene.add(new THREE.GridHelper(25, 25));





const Controller = {
    Soleil : true,
    Terre : true,
    Lune : true,
    Grille : true,
    Vitesse : 0
}


gui.add( Controller,  "Soleil").onChange(value => {if (value) {sunMesh.visible = true} else {sunMesh.visible = false}});
gui.add( Controller,  "Terre").onChange(value => {if (value) {earthMesh.visible = true} else {earthMesh.visible = false}});
gui.add( Controller,  "Lune").onChange(value => {if (value) {moonMesh.visible = true} else {moonMesh.visible = false}});
gui.add( Controller,  "Grille").onChange(value => {if (value) {scene.children[3].visible = true} else {scene.children[3].visible = false}});
gui.add( Controller,  "Vitesse", 0.01, 0.1,);


let angle = 0;
const rotation = () => {

    angle += Controller.Vitesse;

    objects.forEach((obj) => {
        if (obj.name == "sun") {
            obj.rotation.y = -angle;
        }
        else {
            obj.rotation.y = angle;
        }
    });

    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(rotation);
}
rotation();