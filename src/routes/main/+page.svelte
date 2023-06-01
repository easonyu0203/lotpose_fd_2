<script lang="ts">
	import ControlPanel from '$lib/components/ControlPanel.svelte';
	import VideoStreamPanel from '$lib/components/VideoStreamPanel.svelte';
	import { AppShell } from '@skeletonlabs/skeleton';
</script>

<AppShell slotSidebarLeft="w-auto min-w-[24rem] bg-surface-800/70 p-4">
	<!-- (header) -->
	<svelte:fragment slot="sidebarLeft"><ControlPanel /></svelte:fragment>
	<!-- (sidebarRight) -->
	<!-- (pageHeader) -->
	<!-- Router Slot -->
	<VideoStreamPanel />
	<!-- ---- / ---- -->
	<!-- (pageFooter) -->
	<!-- (footer) -->
</AppShell>
