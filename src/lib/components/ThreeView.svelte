<script lang="ts">
	import { appState } from '$lib/stores/appStateStore';

	let jsonData: any = null;
	let is_fetching = false;

	async function fetchData() {
		if (is_fetching) return;

		const response = await fetch(`${import.meta.env.VITE_BD_URL}/stream-3d`);
		const reader = response.body!.getReader();
		const decoder = new TextDecoder('utf-8');
		is_fetching = true;

		const processData = async ({ done, value }: { done: boolean; value: ArrayBuffer }) => {
			console.log(done, value);
			if (done) {
				console.log('Stream complete');
				return;
			}

			const json = JSON.parse(decoder.decode(value));
			jsonData = json;
			// Update any necessary state or perform other actions with the received JSON data

			await reader.read().then(processData);
		};

		await reader.read().then(processData);
		is_fetching = false;
	}

	$: {
		if ($appState.webcam_stared) {
			fetchData();
		}
	}
</script>

<main>
	<!-- Render your UI using the received JSON data -->
	<div>{JSON.stringify(jsonData)}</div>
</main>
