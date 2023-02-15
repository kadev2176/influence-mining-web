/**
 * @ Author: Hikaru
 * @ Create Time: 2022-03-11 17:36:47
 * @ Modified by: Hikaru
 * @ Modified time: 2022-07-22 00:09:42
 * @ Description: i@rua.moe
 */

import { useEffect } from 'react';
import * as THREE from 'three';
import { AdditiveBlending } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import './Background.scss';

const Background: React.FC<{
  speedup?: boolean;
  pullup?: boolean;
  leftDays?: number;
  complex?: boolean;
}> = ({ speedup, pullup, leftDays, complex }) => {
  const count = [10000, 70000];
  const randomness = [1, 0.3];
  const stars = [1000, 9000];

  const textureLoader = new THREE.TextureLoader();
  const shape = textureLoader.load('/particleShape/1.png');

  // Scene
  const scene = new THREE.Scene();

  // Galaxy Generator
  const parameters = {
    count:
      !!leftDays && leftDays <= 7
        ? ((count[1] - count[0]) / 7) * (7 - leftDays + 1)
        : complex
        ? 70000
        : 10000,
    size: 0.01,
    radius: 5,
    branches: !!leftDays && leftDays <= 7 ? 7 - leftDays + 1 : 7,
    spin: 1,
    randomness:
      !!leftDays && leftDays <= 7
        ? ((randomness[1] - randomness[0]) / 7) * (7 - leftDays + 1)
        : complex
        ? 0.3
        : 0.1,
    randomnessPower: 5,
    stars: !!leftDays && leftDays <= 7 ? stars[1] - (stars[0] / 7) * (7 - leftDays + 1) : 9000,
    starColor: '#1b3984',
    insideColor: '#ff5b00',
    outsideColor: '#1b3984',
  };

  let geometry: any;
  let material: any;
  let points: any;

  const generateGalaxy = () => {
    geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(parameters.count * 3);
    const colors = new Float32Array(parameters.count * 3);

    const colorInside = new THREE.Color(parameters.insideColor);
    const colorOutside = new THREE.Color(parameters.outsideColor);

    for (let i = 0; i < parameters.count; i++) {
      // Position
      const x = Math.random() * parameters.radius;
      const branchAngle = ((i % parameters.branches) / parameters.branches) * 2 * Math.PI;
      const spinAngle = x * parameters.spin;

      const randomX =
        Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);
      const randomY =
        Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);
      const randomZ =
        Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);

      positions[i * 3] = Math.sin(branchAngle + spinAngle) * x + randomX;
      positions[i * 3 + 1] = randomY;
      positions[i * 3 + 2] = Math.cos(branchAngle + spinAngle) * x + randomZ;

      // Color

      const mixedColor = colorInside.clone();
      mixedColor.lerp(colorOutside, x / parameters.radius);

      colors[i * 3 + 0] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    material = new THREE.PointsMaterial({
      color: 'white',
      size: parameters.size,
      depthWrite: false,
      sizeAttenuation: true,
      blending: AdditiveBlending,
      vertexColors: true,
      transparent: true,
      alphaMap: shape,
    });

    points = new THREE.Points(geometry, material);
    scene.add(points);
  };

  // Background Stars
  let bgStarsGeometry: any;
  let bgStarsMaterial: any;
  let bgStars: any;

  const generateBgStars = () => {
    bgStarsGeometry = new THREE.BufferGeometry();
    const bgStarsPositions = new Float32Array(parameters.stars * 3);

    for (let j = 0; j < parameters.stars; j++) {
      bgStarsPositions[j * 3 + 0] = (Math.random() - 0.5) * 20;
      bgStarsPositions[j * 3 + 1] = (Math.random() - 0.5) * 20;
      bgStarsPositions[j * 3 + 2] = (Math.random() - 0.5) * 20;
    }

    bgStarsGeometry.setAttribute('position', new THREE.BufferAttribute(bgStarsPositions, 3));

    bgStarsMaterial = new THREE.PointsMaterial({
      size: parameters.size,
      depthWrite: false,
      sizeAttenuation: true,
      blending: AdditiveBlending,
      color: parameters.starColor,
      transparent: true,
      alphaMap: shape,
    });

    bgStars = new THREE.Points(bgStarsGeometry, bgStarsMaterial);
    scene.add(bgStars);
  };

  // Sizes
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  // Camera
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 50);
  camera.position.x = 3;
  camera.position.y = 3;
  camera.position.z = 3;

  scene.add(camera);
  // Animate
  const clock = new THREE.Clock();
  let g_renderer: any;
  const tick = () => {
    // Call tick again on the next frame
    if (!!g_renderer) {
      const elapsedTime = clock.getElapsedTime();
      //Update the camera
      points.rotation.y = elapsedTime * 0.1;
      bgStars.rotation.y = -elapsedTime * 0.05;
      if (speedup) {
        points.rotation.y += points.rotation.y * 1.1;
        bgStars.rotation.y += bgStars.rotation.y * 1.1;
      }
      if (pullup && camera.position.x > 1) {
        camera.position.x -= 0.01;
        camera.position.y -= 0.01;
        camera.position.z -= 0.01;
      }
      // Render
      g_renderer.render(scene, camera, points, bgStars);
      window.requestAnimationFrame(tick);
    } else {
      window.requestAnimationFrame(tick);
      return;
    }
  };

  useEffect(() => {
    // Background
    const bgContainer = document.getElementById('backgroundContainer') as HTMLElement;
    document.createElement('canvas.webgl');
    // Canvas
    const canvas = document.querySelector('canvas.webgl') as any;
    // Clean old canvas
    canvas.remove();
    bgContainer.appendChild(canvas);

    generateGalaxy();
    generateBgStars();
    // Controls
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;

    // Render
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      stencil: false,
      powerPreference: complex ? 'high-performance' : 'low-power',
      depth: complex ? true : false,
      logarithmicDepthBuffer: complex ? false : true,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, complex ? 3 : 1));
    g_renderer = renderer;
    tick();
    window.addEventListener('resize', () => {
      // Update sizes
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      // Update camera
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      // Update renderer
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, complex ? 3 : 1));
    });
  }, [speedup, pullup, leftDays]);

  return (
    <div className='backgroundContainer' id="backgroundContainer">
      <div className='mask' />
      <canvas className="webgl" />
    </div>
  );
};

export default Background;
