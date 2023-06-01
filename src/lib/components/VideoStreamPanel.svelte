<script lang="ts">
	import { appState } from '$lib/stores/appStateStore';
	import type { WebcamInfo } from '$lib/types/WebcamInfo';

	let started_webcam_infos: WebcamInfo[] = [];
	$: {
		started_webcam_infos = $appState.get_started_webcam_infos();
	}
</script>

<div class=" container h-full grid grid-cols-2 grid-rows-2">
	{#each started_webcam_infos as webcam}
		<div class="card">
			<header class="card-header text-center">{webcam.device_name} stream</header>
			<section class=" container flex justify-center p-2">
				<img src={webcam.src} alt={`${webcam.device_name} stream`} />
			</section>
		</div>
	{/each}
</div>
