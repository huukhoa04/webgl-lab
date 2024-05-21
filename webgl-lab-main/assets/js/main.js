// Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// Create a Three.JS Scene
const scene = new THREE.Scene();
// Create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);

// Keep track of the mouse position, so we can make the eye move
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

// Keep the 3D object on a global variable so we can access it later
let object;

// OrbitControls allow the camera to move around the scenes
let controls;

// Set which object to render
let objToRender = 'cirno';

// Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

// Load the file
loader.load(
    `model/${objToRender}/scene.gltf`,
    function (gltf) {
        // If the file is loaded, add it to the scene
        object = gltf.scene;
        scene.add(object);

        // Set initial transformations
        Draw();
    },
    function (xhr) {
        // While it is loading, log the progress
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    
    function (error) {
      // If there is an error, log it
      console.error(error);
  }
  );
  
  // Instantiate a new renderer and set its size
  const renderer = new THREE.WebGLRenderer({ alpha: true }); // Alpha: true allows for the transparent background
  const container = document.getElementById('container3D');
  renderer.setSize(container.clientWidth, container.clientHeight);
  
  // Add the renderer to the DOM
  container.appendChild(renderer.domElement);
  
  // Set how far the camera will be from the 3D model
  camera.position.z = objToRender === "cirno" ? 50 : 500;
  
  // Add lights to the scene, so we can actually see the 3D model
  const topLight = new THREE.DirectionalLight(0xffffff, 1); // (color, intensity)
  topLight.position.set(500, 500, 500); // top-left-ish
  topLight.castShadow = true;
  scene.add(topLight);
  
  const ambientLight = new THREE.AmbientLight(0x333333, objToRender === "cirno" ? 5 : 1);
  scene.add(ambientLight);
  
  // This adds controls to the camera, so we can rotate / zoom it with the mouse
  if (objToRender === "cirno") {
      controls = new OrbitControls(camera, renderer.domElement);
  }
  
  // Render the scene
  function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
  
      if (object) {
          // Add rotation to make the object move
          object.rotation.x += 0;
          object.rotation.y += 0;
      }
  }
  
  // This will draw the object in the scene
  function Draw() {
      // Get slider values
      const Tx = document.getElementById("T__xVal").value;
      const Ty = document.getElementById("T__yVal").value;
      const Tz = document.getElementById("T__zVal").value;
      const Sx = document.getElementById("S__xVal").value;
      const Sy = document.getElementById("S__yVal").value;
      const Sz = document.getElementById("S__zVal").value;
      const Rx = document.getElementById("R__xVal").value;
      const Ry = document.getElementById("R__yVal").value;
      const Rz = document.getElementById("R__zVal").value;
  
      // Set object transformations
      if (object) {
          object.position.set(Tx, Ty, Tz);
          object.scale.set(Sx, Sy, Sz);
          object.rotation.x = THREE.Math.degToRad(Rx);
          object.rotation.y = THREE.Math.degToRad(Ry);
          object.rotation.z = THREE.Math.degToRad(Rz);
      }
  
      // Update slider values display
      document.getElementById("__Tx").innerText = Tx;
      document.getElementById("__Ty").innerText = Ty;
      document.getElementById("__Tz").innerText = Tz;
      document.getElementById("__Sx").innerText = Sx;
      document.getElementById("__Sy").innerText = Sy;
      document.getElementById("__Sz").innerText = Sz;
      document.getElementById("__Rx").innerText = `${Rx} deg`;
      document.getElementById("__Ry").innerText = `${Ry} deg`;
      document.getElementById("__Rz").innerText = `${Rz} deg`;
  
      // Output current transformations
      const output = `Translate: (${Tx}, ${Ty}, ${Tz})\nScale: (${Sx}, ${Sy}, ${Sz})\nRotate: (${Rx}°, ${Ry}°, ${Rz}°)`;
      document.getElementById("out__val").value = output;
  }
  
  // Add event listeners to sliders
  document.getElementById("T__xVal").addEventListener("input", Draw);
  document.getElementById("T__yVal").addEventListener("input", Draw);
  document.getElementById("T__zVal").addEventListener("input", Draw);
  document.getElementById("S__xVal").addEventListener("input", Draw);
  document.getElementById("S__yVal").addEventListener("input", Draw);
  document.getElementById("S__zVal").addEventListener("input", Draw);
  document.getElementById("R__xVal").addEventListener("input", Draw);
  document.getElementById("R__yVal").addEventListener("input", Draw);
  document.getElementById("R__zVal").addEventListener("input", Draw);
  
  // Start the animation loop
  animate();
  
