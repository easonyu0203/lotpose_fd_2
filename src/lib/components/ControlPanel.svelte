<script lang="ts">
	import { appState } from '$lib/stores/appStateStore';
	import type { WebcamInfo } from '$lib/types/WebcamInfo';
	import { fetchCalibrateCamera, fetchStartWebcams, fetchStopWebcams } from '$lib/utils/api_utils';
	import { getWebcamInfoAsync } from '$lib/utils/media_utils';
	import {
		ListBox,
		ListBoxItem,
		ProgressRadial,
		RadioGroup,
		RadioItem
	} from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';

	let selectedIndices: number[] = [];
	let webcams: WebcamInfo[] = [];

	onMount(async () => {
		webcams = await getWebcamInfoAsync();
	});
</script>

<div class=" container space-y-4">
	<!-- Header -->
	<div>
		<h4 class="h4 text-center">Control Panel</h4>
		<hr class="!border-t-4 mb-4" />
	</div>

	<!-- Select Webcams -->

	<div class="variant-ghost-surface space-y-2 pb-2">
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
	</div>

	<!-- Start Button -->

	<!-- camera calibration -->
	<div class="variant-ghost-surface">
		<p class=" text-base text-center variant-filled-surface py-2">Camera Calibration</p>
		<div class=" flex justify-center py-4">
			<ProgressRadial value={$appState.calibrate_progress * 100}
				>{$appState.calibrate_progress * 100}%</ProgressRadial
			>
		</div>
		<div class=" flex justify-center p-2 space-y-4">
			<button
				type="button"
				class="btn variant-filled-primary rounded-sm"
				disabled={$appState.is_camera_calibrating || $appState.stared_device_indices.length < 2}
				on:click={async () => await fetchCalibrateCamera()}>Calibrate Cameras</button
			>
		</div>
	</div>

	<div class="variant-ghost-surface">
		<p class=" text-base text-center variant-filled-surface py-2">View Dimension</p>
		<div class=" flex justify-center p-2">
			<RadioGroup>
				<RadioItem bind:group={$appState.view_dimension} name="justify" value={'2d'}>2D</RadioItem>
				<RadioItem bind:group={$appState.view_dimension} name="justify" value={'3d'}>3D</RadioItem>
			</RadioGroup>
		</div>
	</div>
</div>
