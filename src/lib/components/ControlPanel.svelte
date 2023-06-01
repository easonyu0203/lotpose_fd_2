<script lang="ts">
	import { appState } from '$lib/stores/appStateStore';
	import type { WebcamInfo } from '$lib/types/WebcamInfo';
	import { fetchCalibrateCamera, fetchStartWebcams, fetchStopWebcams } from '$lib/utils/api_utils';
	import { getWebcamInfoAsync } from '$lib/utils/media_utils';
	import { ListBox, ListBoxItem, ProgressRadial } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';

	let selectedIndices: number[] = [];
	let webcams: WebcamInfo[] = [];

	onMount(async () => {
		webcams = await getWebcamInfoAsync();
	});

	$: console.log(selectedIndices);
</script>

<div class=" container space-y-4">
	<!-- Header -->
	<div>
		<h4 class="h4 text-center">Control Panel</h4>
		<hr class="!border-t-4 mb-4" />
	</div>

	<!-- Select Webcams -->

	<div class="variant-ghost-surface">
		{#if webcams.length > 0}
			<p class=" text-base text-center variant-filled-surface py-2">Select Webcams:</p>
			<ListBox multiple>
				{#each webcams as webcam}
					<ListBoxItem bind:group={selectedIndices} name={webcam.device_name} value={webcam.index}
						>{webcam.device_name}</ListBoxItem
					>
				{/each}
			</ListBox>
		{:else}
			<p class="text-lg">No webcams found.</p>
		{/if}
	</div>

	<!-- Start Button -->
	<div class="flex justify-center">
		{#if $appState.webcam_stared === false}
			<button
				type="button"
				class="btn variant-filled-primary rounded-sm"
				disabled={selectedIndices.length === 0 || $appState.is_starging_webcams}
				on:click={() => fetchStartWebcams(selectedIndices)}>Start App</button
			>
		{:else}
			<button
				type="button"
				class="btn variant-filled-warning rounded-sm"
				on:click={async () => {
					$appState.stared_device_indices = [];
					$appState.webcam_stared = false;
					await fetchStopWebcams();
				}}>Stop App</button
			>
		{/if}
	</div>

	<!-- camera calibration -->
	<div class="variant-ghost-surface">
		<p class=" text-base text-center variant-filled-surface py-2">Camera Calibration</p>
		<div class=" flex justify-center py-4">
			<!-- <ProgressRadial value={undefined}>{undefined}%</ProgressRadial> -->
		</div>
		<div class=" flex justify-center p-2">
			<button
				type="button"
				class="btn variant-filled-primary rounded-sm"
				disabled={$appState.is_camera_calibrating || $appState.stared_device_indices.length < 2}
				on:click={async () => await fetchCalibrateCamera()}>Calibrate Cameras</button
			>
		</div>
	</div>
</div>
