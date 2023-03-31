/**
 * @ Author: Hikaru
 * @ Create Time: 2022-03-11 17:36:47
 * @ Modified by: Hikaru
 * @ Modified time: 2022-07-22 00:09:42
 * @ Description: i@rua.moe
 */

import React from 'react';
import { useCallback, useEffect } from 'react';
import * as THREE from 'three';
import { AdditiveBlending } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import './Background.scss';

const generatePosition = () => {
  while (1) {
    const x = (Math.random() - 0.5) * 4;
    const y = (Math.random() - 0.5) * 2;
    const z = (Math.random() - 0.5) * 4;
    const r2 = x * x + y * y + z * z
    if (r2 > 0.8 && r2 < 4) {
      return {
        x, y, z
      }
    }
  }
}

const Background: React.FC<{
  speedup?: boolean;
  pullup?: boolean;
  leftDays?: number;
  complex?: boolean;
  scrollY?: number;
}> = ({ speedup, pullup, leftDays, complex, scrollY = 0 }) => {
  const count = [10000, 70000];
  const randomness = [1, 0.3];
  const stars = [1000, 9000];

  const textureLoader = new THREE.TextureLoader();
  const shape = textureLoader.load('/particleShape/particle.png');
  const avatarTextures = [
    textureLoader.load('/assets/avatars/3land.png'),
    textureLoader.load('/assets/avatars/azuki.png'),
    textureLoader.load('/assets/avatars/bayc.png'),
    textureLoader.load('/assets/avatars/cloneX.png'),
    textureLoader.load('/assets/avatars/coolcat.png'),
    textureLoader.load('/assets/avatars/creatureWorld.png'),
    textureLoader.load('/assets/avatars/crypToads.png'),
    textureLoader.load('/assets/avatars/dead.png'),
    textureLoader.load('/assets/avatars/doodle.png'),
    textureLoader.load('/assets/avatars/goblin.png'),
    textureLoader.load('/assets/avatars/kaiju.png'),
    textureLoader.load('/assets/avatars/kara.png'),
    textureLoader.load('/assets/avatars/mayc.png'),
    textureLoader.load('/assets/avatars/mfers.png'),
    textureLoader.load('/assets/avatars/moonbirds.png'),
    textureLoader.load('/assets/avatars/muri.png'),
    textureLoader.load('/assets/avatars/phantaBear.png'),
    textureLoader.load('/assets/avatars/pp.png'),
    textureLoader.load('/assets/avatars/punk.png'),
    textureLoader.load('/assets/avatars/wow.png'),
  ];

  // Scene
  const scene = new THREE.Scene();

  // Galaxy Generator
  // const parameters = {
  //   count:
  //     !!leftDays && leftDays <= 7
  //       ? ((count[1] - count[0]) / 7) * (7 - leftDays + 1)
  //       : complex
  //       ? 70000
  //       : 10000,
  //   size: 0.01,
  //   radius: 5,
  //   branches: !!leftDays && leftDays <= 7 ? 7 - leftDays + 1 : 7,
  //   spin: 1,
  //   randomness:
  //     !!leftDays && leftDays <= 7
  //       ? ((randomness[1] - randomness[0]) / 7) * (7 - leftDays + 1)
  //       : complex
  //       ? 0.3
  //       : 0.1,
  //   randomnessPower: 5,
  //   stars: !!leftDays && leftDays <= 7 ? stars[1] - (stars[0] / 7) * (7 - leftDays + 1) : 9000,
  //   starColor: '#1b3984',
  //   insideColor: '#ff5b00',
  //   outsideColor: '#1b3984',
  // };

  const parameters = {
    count: 42900,
    size: 0.009,
    radius: 7,
    branches: 7,
    spin: -0.651,
    randomness: 1.17,
    randomnessPower: 4,
    stars: 9000,
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

      const pos_x = Math.sin(branchAngle + spinAngle) * x + randomX;
      const pos_y = randomY;
      const pos_z = Math.cos(branchAngle + spinAngle) * x + randomZ;

      const r2 = pos_x * pos_x + pos_y * pos_y + pos_z * pos_z;

      if (pos_y > 0.5 && r2 > 0.5 && r2 < 3) {
        continue;
      }

      positions[i * 3] = pos_x;
      positions[i * 3 + 1] = pos_y;
      positions[i * 3 + 2] = pos_z;

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
  const avatars: any = [];

  const generateBgStars = (textrue: THREE.Texture) => {
    const bgStarsGeometry = new THREE.BufferGeometry();
    const bgAvatarsGeometry = new THREE.BufferGeometry();
    const colorInside = new THREE.Color(parameters.insideColor);

    // random positions
    const count = 5;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    // for (let i = 0; i < count; i++) {
    //   // Position
    //   const x = Math.random() * parameters.radius;
    //   const branchAngle = ((i % parameters.branches) / parameters.branches) * 2 * Math.PI;
    //   const spinAngle = x * parameters.spin;

    //   const randomX =
    //     Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);
    //   const randomY =
    //     Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);
    //   const randomZ =
    //     Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);

    //   positions[i * 3] = Math.sin(branchAngle + spinAngle) * x + randomX;
    //   positions[i * 3 + 1] = randomY;
    //   positions[i * 3 + 2] = Math.cos(branchAngle + spinAngle) * x + randomZ;
    // }

    // const bgStarsPositions = new Float32Array(parameters.stars * 3);
    // const bgStarsPositions = new Float32Array(30);

    for (let j = 0; j < count; j++) {
      const pos = generatePosition() as any;
      positions[j * 3 + 0] = pos.x;
      positions[j * 3 + 1] = pos.y;
      positions[j * 3 + 2] = pos.z;

      const mixedColor = colorInside.clone();
      // mixedColor.lerp(colorOutside, x / parameters.radius);

      colors[j * 3 + 0] = mixedColor.r;
      colors[j * 3 + 1] = mixedColor.g;
      colors[j * 3 + 2] = mixedColor.b;
      // positions[j * 3 + 0] = (0.9 + Math.random() * 0.2) * (Math.random() > 0.5 ? 1 : -1);
      // positions[j * 3 + 1] = (0.9 + Math.random() * 0.2) * (Math.random() > 0.5 ? 1 : -1);
      // positions[j * 3 + 2] = (0.9 + Math.random() * 0.2) * (Math.random() > 0.5 ? 1 : -1); // -0.5 0.5
    }

    bgAvatarsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    bgStarsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    bgStarsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const bgAvatarMaterial = new THREE.PointsMaterial({
      size: 0.04,
      depthWrite: true,
      sizeAttenuation: true,
      blending: AdditiveBlending,
      transparent: true,
      opacity: 0.85,
      map: textrue,
    });
    const bgStarsMaterial = new THREE.PointsMaterial({
      color: '#fff',
      size: 0.07,
      depthWrite: true,
      sizeAttenuation: true,
      blending: AdditiveBlending,
      vertexColors: true,
      transparent: true,
      opacity: 0.3,
      // map: shape,
      alphaMap: shape,
    });

    const bgAvatars = new THREE.Points(bgAvatarsGeometry, bgAvatarMaterial);
    const bgStarts = new THREE.Points(bgStarsGeometry, bgStarsMaterial);

    scene.add(bgStarts);
    scene.add(bgAvatars);
    avatars.push(bgAvatars);

    avatars.push(bgStarts);
  };

  // Sizes
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  // Camera
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 50);
  const initialCameraPosition = 1;
  camera.position.x = initialCameraPosition;
  camera.position.y = initialCameraPosition;
  camera.position.z = initialCameraPosition;

  scene.add(camera);
  // Animate
  const clock = new THREE.Clock();
  let g_renderer: any;
  const scrollRef = React.useRef<number>();
  scrollRef.current = scrollY;


  const tick = () => {
    // Call tick again on the next frame
    if (!!g_renderer) {
      const elapsedTime = clock.getElapsedTime();

      // points.rotation.y = elapsedTime * speedRef.current!;
      // avatars.forEach((avatar: any) => {
      //   avatar.rotation.y = elapsedTime * speedRef.current!;
      // })

      // update points and avatars
      const initialSpeed = 0.004;
      const speed = Math.max((1000 - (scrollRef.current ?? 0)), 0) / 1000 * initialSpeed;

      points.rotation.y += speed;
      avatars.forEach((avatar: any) => {
        avatar.rotation.y += speed;
      })

      // update camera
      const newPosition = initialCameraPosition - 0.5 * (Math.min((scrollRef.current ?? 0), 1000) / 1000)
      camera.position.x = newPosition;
      camera.position.y = newPosition;
      camera.position.z = newPosition;
      // if (pullup && camera.position.x > 0.1) {
      //   camera.position.x -= 0.001;
      //   camera.position.y -= 0.001;
      //   camera.position.z -= 0.001;
      // }

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
    avatarTextures.forEach(texture => {
      generateBgStars(texture);
    })

    // generateBgStars(muri);
    // generateBgStars(bayc);
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
