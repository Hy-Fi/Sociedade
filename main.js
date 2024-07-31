import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import fundobks from './publicss/fundobk.png';




const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const bookURL = new URL('./publicss/ai.glb', import.meta.url);



const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x3D0106 } );
const cube = new THREE.Mesh( geometry, material );
//scene.add( cube );



camera.position.z = 5;
const controls = new OrbitControls( camera, renderer.domElement );
controls.update();
function animate() {
    requestAnimationFrame(animate);

    // Rotate the model
    scene.traverse((object) => {
        if (object.isMesh) {
            //object.rotation.x += 0.01; // Rotate on the X-axis
            object.rotation.y += 0.003; // Rotate on the Y-axis
        }
    });

    renderer.render(scene, camera);
}

//renderer.setClearColor(0x3D0106)
const textureLoader = new THREE.TextureLoader();
scene.background = textureLoader.load(fundobks);

if ( WebGL.isWebGLAvailable() ) {

	// Initiate function or other initializations here
	animate();

} else {

	const warning = WebGL.getWebGLErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );

}

const aloader = new GLTFLoader();

aloader.load(bookURL.href, function(gltf){
	const model = gltf.scene;
	
	scene.add(model);
	model.rotation.x += 0.01;
	animate();
}, undefined, function(error){
	console.error(error);
});



/*
const loader = new GLTFLoader();

loader.load( 'public/ai.glb', function ( gltf ) {

	scene.add( gltf.scene );

}, undefined, function ( error ) {

	console.error( error );

} );*/






