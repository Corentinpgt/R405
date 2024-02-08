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


const loader = new GLTFLoader();

loader.load( 'Rocketship.glb', function ( glb ) {

    const model = glb.scene;
    scene.add(model);
    model.traverse(function(node) {
        if (node.isMesh) {
            node.castShadow = true;
        }
    })

});

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


// const cubeGeometry = new THREE.BoxGeometry( 5, 5, 2 ); 
// const cubeMaterial = new THREE.MeshBasicMaterial( {color: 0xffffee} ); 
// const cube = new THREE.Mesh( cubeGeometry, cubeMaterial ); 
// cube.translateY(5);
// cube.castShadow = true; //default is false
// cube.receiveShadow = false;
// scene.add( cube );


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


const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onPointerClick( event ) {

	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components

	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;


    window.requestAnimationFrame(render);

}


function render() {

    let speed = 0;

	// update the picking ray with the camera and pointer position
	raycaster.setFromCamera( pointer, camera );

	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects( scene.children );

	for ( let i = 0; i < intersects.length; i ++ ) {
        
        // intersects[ i ].object.material.color.set( 0xff0000 );
        if (intersects[i].object.castShadow==true) {
            console.log('test1');
            if (scene.children[5]!=undefined) {
                while (scene.children[5].position.y<10) {
                    
                    speed+=0.01;
                    scene.children[5].position.y = speed;
                    console.log('test2', scene.children[5].position.y);


                    renderer.render(scene, camera);

                    
                }
                console.log('test3');

                speed=0;
                scene.children[5].position.y = 0;
            }


                
        }

	}

	renderer.render( scene, camera );

}

window.addEventListener( 'pointerdown', onPointerClick );

