import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import Stats from 'three/addons/libs/stats.module.js';

const gui = new GUI();
const params = {
    showHelpers: true,
}
gui.add(params, 'showHelpers').name('Show Helpers');



const canvas = document.querySelector('.webgl')
const scene = new THREE.Scene()
const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);
scene.background = new THREE.Color(0x9eaeff)

const container = document.querySelector('#container');
const stats = new Stats();
container.appendChild(stats.dom);

// Lighting
const lightAmbient = new THREE.AmbientLight(0x9eaeff, 0.5)
scene.add(lightAmbient);

const lightDirectional = new THREE.DirectionalLight(0xffffff, 0.8)
lightDirectional.target.position.set(0, 0, 0);
scene.add(lightDirectional);
const dlightHelper = new THREE.DirectionalLightHelper(lightDirectional, 1);
scene.add(dlightHelper);

// Move the light source towards us
lightDirectional.position.set(20, 50, 10);
lightDirectional.castShadow = true;
const camHelper = new THREE.CameraHelper(lightDirectional.shadow.camera);
lightDirectional.shadow.camera.near = 5;
lightDirectional.shadow.camera.far = 200;
lightDirectional.shadow.camera.left = 100;
lightDirectional.shadow.camera.right = -100;
lightDirectional.shadow.camera.top = 100;
lightDirectional.shadow.camera.bottom = -100;
lightDirectional.shadow.biais = -0.001;
lightDirectional.shadow.mapSize.width = 4000;
lightDirectional.shadow.mapSize.height = 4000;

//Plan horizontal
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100, 10, 10),
    new THREE.MeshPhongMaterial({ color: 0xcbcbcb })
);
plane.rotation.x = -Math.PI / 2;
plane.receiveShadow = true;
plane.castShadow = false;
scene.add(plane);
const gridHelper = new THREE.GridHelper(100, 40,);
scene.add(gridHelper);




const degreesToRadians = (degrees) => {
	return degrees * (Math.PI / 180)
}

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

// Helpers
const center = (group) => {
	new THREE.Box3().setFromObject(group).getCenter( group.position ).multiplyScalar(-1)
	scene.add(group)
}

const random = (min, max, float = false) => {
  const val = Math.random() * (max - min) + min

  if (float) {
    return val
  }

  return Math.floor(val)
}

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ canvas })

const render = () => {
    renderer.setSize(sizes.width, sizes.height)
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true;
	renderer.render(scene, camera)
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000)
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
})


// Fog
scene.fog = new THREE.Fog(0xe0e0e0, 5, 100)


// Material
const material = new THREE.MeshLambertMaterial({ color: 0xffffff })




scene.add(camHelper);

// Figure
class Figure {
	constructor(params) {
		this.params = {
			x: 0,
			y: 1.3,
			z: 0,
			ry: 0,
            armRotation: 0,
            headRotation: 0,
            leftEyeScale: 1,
			...params
		}
		
		// Create group and add to scene
		this.group = new THREE.Group()
		scene.add(this.group)
		
		// Position according to params
		this.group.position.x = this.params.x
		this.group.position.y = this.params.y
		this.group.position.z = this.params.z
		// this.group.rotation.y = this.params.ry
		// this.group.scale.set(5, 5, 5)
		
		// Material
		this.headHue = random(0, 360)
		this.bodyHue = random(0, 360)
		this.headLightness = random(40, 65)
		this.headMaterial = new THREE.MeshLambertMaterial({ color: `hsl(${this.headHue}, 30%, ${this.headLightness}%)` })
		this.bodyMaterial = new THREE.MeshLambertMaterial({ color: `hsl(${this.bodyHue}, 85%, 50%)` })
		
		this.arms = []
	}
	
	createBody() {
		this.body = new THREE.Group()
		const geometry = new THREE.BoxGeometry(1, 1.5, 1)
		const bodyMain = new THREE.Mesh(geometry, this.bodyMaterial)
		
		this.body.add(bodyMain)
		this.group.add(this.body)
		
		this.createLegs()

        bodyMain.castShadow = true;
	}
	
	createHead() {
		// Create a new group for the head
		this.head = new THREE.Group()
		
		// Create the main cube of the head and add to the group
		const geometry = new THREE.SphereGeometry(0.8, 32, 32)
		const headMain = new THREE.Mesh(geometry, this.headMaterial)
		this.head.add(headMain)
		
		// Add the head group to the figure
		this.group.add(this.head)
		
		// Position the head group
		this.head.position.y = 1.65

        headMain.castShadow = true;

		
		// Add the eyes
		this.createEyes()

        // Antennes
        const antennaGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.8, 8);
        const antenna1 = new THREE.Mesh(antennaGeometry, this.headMaterial);
        antenna1.position.set(-0.55, 0.8 , 0);
        antenna1.rotation.z = degreesToRadians(45);
        this.head.add(antenna1);

        const antenna2 = new THREE.Mesh(antennaGeometry, this.headMaterial);
        antenna2.position.set(0.55, 0.8 , 0);
        antenna2.rotation.z = degreesToRadians(-45);
        this.head.add(antenna2);
	}
	
	createArms() {
		const height = 0.85
		
		for(let i = 0; i < 2; i++) {
			const armGroup = new THREE.Group()
			const geometry = new THREE.BoxGeometry(0.25, height, 0.25)
			const arm = new THREE.Mesh(geometry, this.headMaterial)
			const m = i % 2 === 0 ? 1 : -1
			
			// Add arm to group
			armGroup.add(arm)
			
			// Add group to figure
			this.body.add(armGroup)
			
			// Translate the arm by half the height
			arm.position.y = height * -0.5
			
			// Position the arm relative to the figure
			armGroup.position.x = m * 0.8
			armGroup.position.y = 0.6
			
			// Rotate the arm
			armGroup.rotation.z = degreesToRadians(30 * m)

            arm.castShadow = true;

			
			// Push to the array
			this.arms.push(armGroup)
		}
	}
	
	createEyes() {
		const eyes = new THREE.Group()
		const geometry = new THREE.SphereGeometry(0.15, 12, 8)
		const material = new THREE.MeshLambertMaterial({ color: 0x44445c })
		
		for(let i = 0; i < 2; i++) {
			const eye = new THREE.Mesh(geometry, material)
			const m = i % 2 === 0 ? 1 : -1
			
			eyes.add(eye)
			eye.position.x = 0.36 * m
            if (m == -1) this.leftEye = eye;
		}
		
		this.head.add(eyes)
		
		eyes.position.y = -0.1
		eyes.position.z = 0.7
	}
	
	createLegs() {
		const legs = new THREE.Group()
		const geometry = new THREE.BoxGeometry(0.25, 0.4, 0.25)
		
		for(let i = 0; i < 2; i++) {
			const leg = new THREE.Mesh(geometry, this.headMaterial)
			const m = i % 2 === 0 ? 1 : -1

            leg.castShadow = true;

			
			legs.add(leg)
			leg.position.x = m * 0.22
		}
		
		this.group.add(legs)
		legs.position.y = -1.15;


		
		this.body.add(legs)
	}
	
	update() {
		this.group.rotation.y = this.params.ry
		this.group.position.y = this.params.y
		this.arms.forEach((arm, index) => {
			const m = index % 2 === 0 ? 1 : -1
			arm.rotation.z = this.params.armRotation * m
		})
        this.head.rotation.z = this.params.headRotation;
        this.leftEye.scale.set(this.params.leftEyeScale, this.params.leftEyeScale, this.params.leftEyeScale);
	}
	
	init() {
		this.createBody()
		this.createHead()
		this.createArms()
	}
}

const figure = new Figure()
figure.init()

// gsap.set(figure.params, {
// 	y: -1.5
// })

// gsap.to(figure.params, {
// 	ry: degreesToRadians(360),
// 	repeat: -1,
// 	duration: 20
// })

// gsap.to(figure.params, {
// 	y: 5,
// 	armRotation: degreesToRadians(90),
// 	repeat: -1,
// 	yoyo: true,
// 	duration: 0.5
// })


let jumpTimeline = gsap.timeline();
document.addEventListener('keydown', (e) => {
    idleTimeline.pause();
    if (e.key === ' ' && !jumpTimeline.isActive()) {
        jumpTimeline.to(figure.params, {
            y: 5,
            armRotation: degreesToRadians(90),
            repeat: 1,
            yoyo: true,
            duration: 0.5
        });
        
    }
    if (e.key === 'q') {
        figure.params.ry += degreesToRadians(5);
    }

    if (e.key === 'd') {
        figure.params.ry -= degreesToRadians(5);
    }
    
});


let idleTimeline = gsap.timeline();
idleTimeline.to(figure.params, {
    headRotation: 0.25,
    repeat: 1,
    yoyo: true,
    duration: 0.75,
    delay : 2.5,
    ease: 'back.out(1.7)'
})

idleTimeline.to(figure.params, {
    leftEyeScale: 1.25,
    repeat: 1,
    yoyo: true,
    duration: 1,

}, ">2.2")

gsap.ticker.add(() => {
    axesHelper.visible = params.showHelpers;
    dlightHelper.visible = params.showHelpers;
    gridHelper.visible = params.showHelpers;
    camHelper.visible = params.showHelpers;

    if (!idleTimeline.isActive() && !jumpTimeline.isActive()) {
        idleTimeline.restart();
    }
	figure.update();
    stats.update();
    controls.update();
	render()
})