<script lang="ts">
	import { appState } from '$lib/stores/appStateStore';

	let jsonData: any = 'hehe';
	let is_fetching = false;

	async function fetchData() {
		if (is_fetching) return;

		const response = await fetch(`${import.meta.env.VITE_BD_URL}/stream-3d`);
		const reader = response.body!.getReader();
		const decoder = new TextDecoder('utf-8');
		is_fetching = true;

		const processData = async ({ done, value }: { done: boolean; value: ArrayBuffer }) => {
			if (done) {
				console.log('Stream complete');
				return;
			}
			try {
				let json = JSON.parse(decoder.decode(value));
				json = JSON.parse(json);
				jsonData = json;
			} catch (error) {}

			await reader.read().then(processData);
		};

		await reader.read().then(processData);
		is_fetching = false;
	}

	$: {
		if ($appState.webcam_stared && $appState.stared_device_indices.length > 1) {
			fetchData();
		}
	}

	import { onMount, onDestroy } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

	const connections: [number, number][] = [
		[0, 1],
		[1, 2],
		[2, 3],
		[3, 7],
		[0, 4],
		[4, 5],
		[5, 6],
		[6, 8],
		[9, 10],
		[11, 12],
		[12, 24],
		[23, 24],
		[11, 23],
		[11, 13],
		[13, 15],
		[15, 21],
		[15, 17],
		[15, 19],
		[17, 19],
		[12, 14],
		[14, 16],
		[16, 22],
		[16, 20],
		[16, 18],
		[18, 20],
		[24, 26],
		[26, 28],
		[28, 32],
		[32, 30],
		[28, 30],
		[23, 25],
		[25, 27],
		[27, 29],
		[29, 31],
		[27, 31]
	];
	let canvas: HTMLCanvasElement;
	let spheres: THREE.Mesh[] = [];
	$: landmark = jsonData?.value;

	onMount(() => {
		canvas.style.width = '100%';
		canvas.style.height = '100%';

		// Fix canvas size for high resolution rendering
		const canvasRect = canvas.getBoundingClientRect();
		const width = canvasRect.width;
		const height = canvasRect.height;

		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
		const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });

		renderer.setSize(width, height);
		renderer.setClearColor(0xc4c1b1, 1);

		const gridHelper = new THREE.GridHelper(50, 50);
		scene.add(gridHelper);

		// Create 33 spheres
		const sphereGeometry = new THREE.SphereGeometry(0.1, 8, 8);

		for (let i = 0; i < 33; i++) {
			const sphereMaterial = new THREE.MeshPhongMaterial({
				color: 0xff0000,
				transparent: true,
				opacity: 0.5
			});

			const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
			sphere.position.set(0, 0, 0);
			scene.add(sphere);
			spheres.push(sphere);
		}

		// After creating the spheres, we add the line geometries for each connection.
		connections.forEach(([i, j]) => {
			const material = new THREE.LineBasicMaterial({ color: 0x00ff00, transparent: true }); // Green color
			const geometry = new THREE.BufferGeometry().setFromPoints([
				spheres[i].position,
				spheres[j].position
			]);
			const line = new THREE.Line(geometry, material);
			line.userData = { endpoints: [i, j] }; // We'll use this later to update the lines.
			scene.add(line);
		});

		// Add a light source to enable shading
		const light = new THREE.DirectionalLight(0xffffff);
		light.position.set(1, 1, 1);
		scene.add(light);

		camera.position.set(5, 10, 5);
		camera.lookAt(0, 0, 0);

		const controls = new OrbitControls(camera, renderer.domElement);
		controls.update();

		function animate() {
			const damping = 0.2;

			for (let i = 0; i < 33; i++) {
				if (landmark) {
					// Create a new THREE.Vector3 for the target position
					const targetPosition = new THREE.Vector3(landmark[i][0], landmark[i][1], landmark[i][2]);
					// Interpolate from the current position towards the target position
					spheres[i].position.lerp(targetPosition, damping);

					spheres[i].material.opacity = landmark[i][3] > 0.6 ? landmark[i][3] : 0;
				} else {
					spheres[i].material.opacity = 0;
				}
			}

			// Inside your animate function, after updating the spheres, update the lines.
			scene.children.forEach((child) => {
				if (child instanceof THREE.Line && child.userData && child.userData.endpoints) {
					const [i, j] = child.userData.endpoints;
					child.geometry.setFromPoints([spheres[i].position, spheres[j].position]);
					let minOpacity = Math.min(spheres[i].material.opacity, spheres[j].material.opacity);
					minOpacity = minOpacity > 0.6 ? minOpacity : 0;
					child.material.opacity = minOpacity;
					child.material.needsUpdate = true;
				}
			});

			requestAnimationFrame(animate);
			renderer.render(scene, camera);
			controls.update();
		}

		animate();
	});
</script>

<canvas bind:this={canvas} />

<div>{jsonData}</div>

<style>
	canvas {
		width: 100%;
		height: 100%;
	}
</style>
