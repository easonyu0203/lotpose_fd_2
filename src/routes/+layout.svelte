<script lang="ts">
	// The ordering of these imports is critical to your app working properly
	import '@skeletonlabs/skeleton/themes/theme-rocket.css';
	// If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	// Most of your app wide CSS should be put in this file
	import '../app.postcss';
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { fetchAppState } from '$lib/utils/api_utils';

	onMount(() => {
		// fecth app state very 0.5 second
		setInterval(async () => {
			const at = await fetchAppState();
			// console.log(at);
		}, 500);
	});
</script>

<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<strong class="text-xl uppercase">Lotpose</strong>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<a
					class="btn btn-sm variant-ghost-surface"
					href="https://github.com/easonyu0203/lotpose_fd"
					target="_blank"
					rel="noreferrer"
				>
					GitHub Frontend
				</a>
				<a
					class="btn btn-sm variant-ghost-surface"
					href="https://github.com/easonyu0203/lotpose_bd"
					target="_blank"
					rel="noreferrer"
				>
					GitHub Backend
				</a>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<!-- Page Route Content -->
	<slot />
</AppShell>
