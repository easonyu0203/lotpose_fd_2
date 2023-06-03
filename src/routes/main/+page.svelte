<script lang="ts">
	import ControlPanel from '$lib/components/ControlPanel.svelte';
	import VideoStreamPanel from '$lib/components/VideoStreamPanel.svelte';
	import { appState } from '$lib/stores/appStateStore';
	import { AppShell } from '@skeletonlabs/skeleton';
</script>

<AppShell slotSidebarLeft="w-auto min-w-[24rem] bg-surface-800/70 p-4">
	<svelte:fragment slot="sidebarLeft"><ControlPanel /></svelte:fragment>
	{#if $appState.view_dimension == '2d'}
		<VideoStreamPanel />
	{:else if $appState.view_dimension == '3d'}
		<div>3d view</div>
	{/if}
</AppShell>
