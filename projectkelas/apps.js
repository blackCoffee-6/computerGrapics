import * as THREE from './three.js/build/three.module.js'
import {OrbitControls} from './three.js/examples/jsm/controls/OrbitControls.js'
import { FBXLoader } from './three.js/examples/jsm/loaders/FBXLoader.js';


let scene = undefined
let camera = undefined
let renderer = undefined
let pointLight = undefined
let ambientLight = undefined
let mouse = undefined
let raycast = undefined
let target = undefined
let target2 = undefined
let target3 = undefined
let selectedObject = undefined
let control = undefined
let skybox = undefined
let mixer
let stats

const clock = new THREE.Clock();
let createskybox = (w,h,d) => {
    let geometry = new THREE.BoxGeometry(w,h,d)

    let material = [
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('./Assets/skybox/px.png'),
        side: THREE.BackSide}),
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('./Assets/skybox/nx.png'),
        side: THREE.BackSide}),
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('./Assets/skybox/py.png'),
        side: THREE.BackSide}),
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('./Assets/skybox/ny.png'),
        side: THREE.BackSide}),
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('./Assets/skybox/pz.png'),
        side: THREE.BackSide}),
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('./Assets/skybox/nz.png'),
        side: THREE.BackSide}),

    ]
    let mesh = new THREE.Mesh(geometry, material)
    return mesh
}

let createGround = () => {

    //Texture
    let loader = new THREE.TextureLoader()
    let base = loader.load("./Assets/dirt/base.jpg")
    let normal = loader.load("./Assets/dirt/normal.jpg")

    //Ground
    let geometry = new THREE.CylinderGeometry(15, 15, 0.5,24)
    let material= new THREE.MeshStandardMaterial({
        color: 0x111111,
        
    })
    let mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(0, -10, 0)
    mesh.rotation.x = Math.PI
    mesh.castShadow = true
    mesh.receiveShadow = true
    mesh.name = 'ground'

    return mesh
}

let createSmallCircle = (position) => {
    let geometry = new THREE.CircleGeometry(0.5)
    let material = new THREE.MeshBasicMaterial({
        color: 0xff0000
    })
    let mesh = new THREE.Mesh(geometry,material)
    mesh.position.copy(position)
    mesh.name = 'small_circle'
    mesh.rotation.y = 1.5

    return mesh
}

let createTarget = () => {
    let loader = new THREE.TextureLoader()
    let texture = loader.load("./Assets/target.jpg")
    let geometry = new THREE.CylinderGeometry(10,10,2,64)
    let material = new THREE.MeshLambertMaterial({
        map:texture,
        color: 0xb5b5b5,
        emissive: 0x000000
    })
    let mesh = new THREE.Mesh(geometry,material)
    mesh.name = 'target'
    mesh.rotation.y = 3.5
    return mesh
}

let createPointLight = () => {
    let light = new THREE.PointLight(0xffffff, 0.5)
    light.intensity = 0.5
    light.position.y = 3
    return light
}

let createAmbientLight = () => {
    let light = new THREE.AmbientLight(0xffffff)
    light.intensity = 0.5
    return light
}
let createFbx = (x,y,z) => {
    //Tree
    var loader = new FBXLoader()
    loader.load("./Assets/3D/targhet/FBX/Silly_Dancing.fbx", object =>{
        //object.rotation.x = -(Math.PI/2);
        object.scale.set(0.04,0.04,0.04)
        object.position.x = x
        object.position.y = y
        object.position.z = z
        object.rotation.y = 2
        
        mixer = new THREE.AnimationMixer(object);
		const action = mixer.clipAction(object.animations[0]);
		action.play();
		object.traverse( function ( child ) {
		if (child.isMesh) {
			child.castShadow = true;
			child.receiveShadow = true;
			}
		});
		scene.add(object);
    })
}

//target kedua
let createGround2 = () => {

    //Texture
    let loader = new THREE.TextureLoader()
    let base = loader.load("./Assets/dirt/base.jpg")
    let normal = loader.load("./Assets/dirt/normal.jpg")

    //Ground
    let geometry = new THREE.CylinderGeometry(10, 10, 0.5,24)
    let material= new THREE.MeshStandardMaterial({
        color: 0x111111,
        
    })
    let mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(0, 10, 35)
    mesh.rotation.x = Math.PI
    mesh.castShadow = true
    mesh.receiveShadow = true
    mesh.name = 'ground2'

    return mesh
}


let createTarget2 = () => {
    let loader = new THREE.TextureLoader()
    let texture = loader.load("./Assets/target.jpg")
    let geometry = new THREE.CylinderGeometry(7,7,1,64)
    let material = new THREE.MeshLambertMaterial({
        map:texture,
        color: 0xb5b5b5,
        emissive: 0x000000
    })
    let mesh = new THREE.Mesh(geometry,material)
    mesh.name = 'target2'
    mesh.rotation.y = 3.5
    return mesh
}

let createGround3 = () => {

    //Texture
    let loader = new THREE.TextureLoader()
    let base = loader.load("./Assets/dirt/base.jpg")
    let normal = loader.load("./Assets/dirt/normal.jpg")

    //Ground
    let geometry = new THREE.CylinderGeometry(10, 10, 0.5,24)
    let material= new THREE.MeshStandardMaterial({
        color: 0x111111,
        
    })
    let mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(0, 10, -35)
    mesh.rotation.x = Math.PI
    mesh.castShadow = true
    mesh.receiveShadow = true
    mesh.name = 'ground3'

    return mesh
}

let createTarget3 = () => {
    let loader = new THREE.TextureLoader()
    let texture = loader.load("./Assets/target.jpg")
    let geometry = new THREE.CylinderGeometry(7,7,1,64)
    let material = new THREE.MeshLambertMaterial({
        map:texture,
        color: 0xb5b5b5,
        emissive: 0x000000
    })
    let mesh = new THREE.Mesh(geometry,material)
    mesh.name = 'target3'
    mesh.rotation.y = 3.5
    return mesh
}


let init = () => {
    scene = new THREE.Scene()
    let fov = 65
    let w = window.innerWidth
    let h = window.innerHeight
    let aspect =  w/h

    camera = new THREE.PerspectiveCamera(fov, aspect)  

    camera.position.set(55, 5, -18)
    camera.lookAt(0, 0, 0)

    renderer = new THREE.WebGLRenderer({
        antialias: true
    })
    renderer.setSize(w, h)
    renderer.setClearColor(0x303030)
    renderer.shadowMap.enabled = true

    document.body.appendChild(renderer.domElement)

    control = new OrbitControls(camera, renderer.domElement)
    control.enablePan = true
    control.enableZoom = true
    // // /if(event.k)
    //   control.autoRotate = true
    //   control.autoRotateSpeed = 5
    control.update();
    let ground = createGround()
    let ground2 = createGround2()
    let ground3 = createGround3()
    pointLight = createPointLight()
    ambientLight = createAmbientLight()

    target = createTarget()
    target.position.z = 0
    target.position.x = 0
    target.position.y = 0.5
    target.rotation.z = 1.55

    target2 = createTarget2()
    target2.position.set(0,18,35)
    target2.rotation.z = 1.55

    target3 = createTarget3()
    target3.position.set(0,18,-35)
    target3.rotation.z = 1.55

    createFbx(0,10.5,0)
    //addEventListener()
    skybox = createskybox(100, 100, 100)
    let objects = [
        pointLight,
        ambientLight,
        skybox,
        ground,
        ground2,
        ground3
    ]

    raycast = new THREE.Raycaster()
    raycast.layers.set(1)
    target.layers.enable(1)
    target2.layers.enable(1)
    target3.layers.enable(1)

    let sceneObjects = [
        pointLight,
        ambientLight,
        target,
        target2,
        target3
    ]

    sceneObjects.forEach(so => {
        scene.add(so)
    });

    objects.forEach(object => {
        scene.add(object)
    });
}

let animation = () => {

    requestAnimationFrame(animation)
    
    control.update();
    const delta = clock.getDelta();
				if ( mixer ) mixer.update( delta );

				renderer.render( scene, camera );

				//stats.update();
    renderer.render(scene, camera)
}

let mouseListener = (e) => {
    mouse = {}
    let w = window.innerWidth
    let h = window.innerHeight
    mouse.x = e.clientX/w*2-1
    mouse.y = e.clientY/h*-2+1

    raycast.setFromCamera(mouse, camera)
    let items = raycast.intersectObjects(scene.children)

    items.forEach(i => {
        console.log(i.object.name)
        selectedObject = i.object
        scene.add(createSmallCircle(i.point))
    });

    console.log(`{Mouse X : ${mouse.x}, Mouse Y : ${mouse.y}}`)
}

let addMouseListener = () => {
    document.addEventListener("mousedown", mouseListener)
}

window.onload = () => {
    init()
    animation()
    addMouseListener()
}

window.onresize = () => {
    let newW = innerWidth
    let newH = innerHeight

    renderer.setSize(newW, newH)

    camera.aspect = newW/newH
    camera.updateProjectionMatrix()
}


