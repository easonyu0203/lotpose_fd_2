<script lang="ts">
	import { appState } from '$lib/stores/appStateStore';
	import { fetchAppState } from '$lib/utils/api_utils';
	import { onMount } from 'svelte';

	onMount(() => {
		// fetch app state every 0.5 seconds
		setInterval(async () => {
			const app_state_json = await fetchAppState();
			appState.update((state) => {
				return { ...state, ...app_state_json };
			});
		}, 500);
	});
</script>

<slot />
