// Import Three.js and its add-ons using the import map
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 2 / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth / 2, window.innerHeight); // Set size to half of the screen
document.getElementById('car-animation').appendChild(renderer.domElement);

// Add Lighting
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5).normalize();
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0x404040); // Soft ambient light
scene.add(ambientLight);

// Add a spotlight to focus on the car
const spotLight = new THREE.SpotLight(0xffffff, 1.5, 100, Math.PI / 4, 0.5, 2);
spotLight.position.set(5, 10, 0);
spotLight.target.position.set(0, 0, 0); // Point the spotlight at the car
scene.add(spotLight);
scene.add(spotLight.target);

// Load the Car Model (GLB format)
let car;
const loader = new GLTFLoader();
loader.load('car.glb', (gltf) => {
  car = gltf.scene;
  car.scale.set(1.25, 1.25, 1.25); // Adjust scale if needed
  car.position.set(roadWidth / 4, 0, 0); // Move the car to the right 1/4 of the road
  car.rotation.y = 1.5 * Math.PI; // Flip the car's orientation (180 degrees around Y-axis)
  scene.add(car);

  // Update the spotlight target to follow the car
  spotLight.target = car;
}, undefined, (error) => {
  console.error('Error loading car model:', error);
});

// Road Parameters
const roadSegmentLength = 10000; // Length of each road segment
const roadWidth = 10; // Width of the road
const roadSegments = []; // Array to store road segments

// Load Road Texture (road.jpeg)
const roadTexture = new THREE.TextureLoader().load('ROAD.jpeg');
roadTexture.wrapS = THREE.RepeatWrapping;
roadTexture.wrapT = THREE.RepeatWrapping;
roadTexture.repeat.set(1, roadSegmentLength / roadWidth); // Adjust texture repetition

// Function to Create a Road Segment
function createRoadSegment(zPosition) {
  const roadMaterial = new THREE.MeshPhongMaterial({
    map: roadTexture,
    side: THREE.DoubleSide,
    shininess: 0, // Disable shininess for a flat look
  });
  const roadGeometry = new THREE.PlaneGeometry(roadWidth, roadSegmentLength);
  const road = new THREE.Mesh(roadGeometry, roadMaterial);
  road.rotation.x = Math.PI / 2; // Rotate to lay flat
  road.position.y = 0; // Position below the car
  road.position.z = zPosition; // Set the Z-position of the road segment
  scene.add(road);
  return road;
}

// Initialize First Road Segment
roadSegments.push(createRoadSegment(0));

// Camera Position (Focus on the Car)
camera.position.set(0, 2, 5); // Adjust camera position to focus on the car
camera.lookAt(0, 0, 0);

// Orbit Controls (to look around)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth camera movement
controls.dampingFactor = 0.25;

// Speedometer Variables
const speedometerNeedle = document.querySelector('.needle');
const speedValue = document.getElementById('speed-value');

// Speed Control Variables
let currentSpeed = 0; // Current speed in km/h
const maxSpeed = 180; // Maximum speed in km/h
const speedIncrement = 1; // Speed increment every 3 seconds
let isIncreasing = true; // Flag to control speed increase/decrease

// Function to calculate the current speed based on the stroke-dashoffset
function calculateSpeed() {
  // Get the element
  let meterBar = document.getElementById("meter-bg-bar");
  // Get the current stroke-dashoffset
  let strokeDashoffset = parseFloat(
    window.getComputedStyle(meterBar).getPropertyValue("stroke-dashoffset")
  );
  // Calculate the current speed based on the stroke-dashoffset
  // The maximum stroke-dashoffset is 615, which corresponds to a speed of 0 km/h
  // The minimum stroke-dashoffset is 0, which corresponds to a speed of 180 km/h
  let speed = ((615 - strokeDashoffset) / 615) * 180;
  // Round the speed to the nearest integer
  speed = Math.round(speed);
  return speed;
}
// Function to update the speed display
function updateSpeedDisplay() {
  // Calculate the current speed
  let speed = calculateSpeed();
  // Get the speed display element
  let speedDisplay = document.getElementById("speed");
  // Update the text content of the speed display element
  speedDisplay.textContent = speed;
  // speedDisplay.textContent = speed + ' km/h';
}
// Call the updateSpeedDisplay function every 100 milliseconds
setInterval(updateSpeedDisplay, 100);

//let thing = document.getElementById("meter-bg-bar").getAttribute("stroke-dasharray");
let thing = 615;
function setSpeed(speed) {
  // Ensure speed is within range (0–180)
  speed = Math.max(0, Math.min(180, speed));

  // Convert speed to stroke-dashoffset
  let offset = thing - ((thing * speed) / 180);
  document.getElementById("meter-bg-bar").setAttribute("stroke-dashoffset", offset);
}

// Function to Update Speedometer
// function updateSpeedometer(speed) {
//   // Calculate the rotation angle for the needle (0° to 180° corresponds to 0 km/h to 200 km/h)
//   const angle = (speed / maxSpeed) * 180 - 90; // Map speed to angle (-90° to 90°)
//   speedometerNeedle.style.transform = `rotate(${angle}deg)`;

//   // Update the displayed speed value
//   speedValue.textContent = `${Math.round(speed)} km/h`;
// }

// Function to Update Car Speed
function updateCarSpeed(speed) {
  // Convert speed from km/h to units per second for the animation
  const speedInUnits = (speed * 1000) / 3600; // Convert km/h to m/s
  return speedInUnits;
}

// Update Speed Every 3 Seconds
setInterval(() => {
  if (isIncreasing) {
    currentSpeed += speedIncrement;
    if (currentSpeed >= maxSpeed) {
      isIncreasing = false; // Start decreasing speed
    }
  } else {
    currentSpeed -= speedIncrement;
    if (currentSpeed <= 0) {
      isIncreasing = true; // Start increasing speed again
    }
  }
}, 500); // Update speed every 3 seconds

// Animation Loop
let lastTime = 0;

function animate(currentTime) {
  requestAnimationFrame(animate);

  // Calculate time difference since the last frame
  const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
  lastTime = currentTime;

  // Move the car forward (along the Z-axis)
  if (car) {
    const speed = updateCarSpeed(currentSpeed); // Get the car's speed in units per second
    car.position.z -= speed * deltaTime; // Move the car along the Z-axis

    // Update the speedometer
    console.log(currentSpeed);
    setSpeed(currentSpeed);

    // Check if the car has moved past the current road segment
    const lastRoadSegment = roadSegments[roadSegments.length - 1];
    if (car.position.z < lastRoadSegment.position.z - roadSegmentLength / 2) {
      // Add a new road segment at the end
      const newRoad = createRoadSegment(lastRoadSegment.position.z + roadSegmentLength);
      roadSegments.push(newRoad);
    }

    // Remove road segments that are far behind the car
    const firstRoadSegment = roadSegments[0];
    if (car.position.z > firstRoadSegment.position.z + roadSegmentLength / 2) {
      scene.remove(firstRoadSegment);
      roadSegments.shift();
    }

    // Make the camera follow the car
    camera.position.z = car.position.z + 5; // Adjust camera offset
    controls.target.set(car.position.x, car.position.y, car.position.z); // Update controls target
  }

  controls.update(); // Update orbit controls
  renderer.render(scene, camera);
}
animate();

// Handle Window Resize
window.addEventListener('resize', () => {
  camera.aspect = (window.innerWidth / 2) / window.innerHeight; // Adjust aspect ratio
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth / 2, window.innerHeight); // Adjust renderer size
});