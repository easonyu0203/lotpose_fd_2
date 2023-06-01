import { fetchWebcamDeviceInfo } from '../utils/api_utils';
import type { WebcamInfo } from '$lib/types/WebcamInfo';
import { appState } from '$lib/stores/appStateStore';

export async function getWebcamInfoAsync(): Promise<WebcamInfo[]> {
	let webcams = await fetchWebcamDeviceInfo();
	const webcamNames: string[] = [];
	for (const device of await navigator.mediaDevices.enumerateDevices()) {
		if (device.kind === 'videoinput') {
			webcamNames.push(device.label || 'Unnamed Webcam');
		}
	}

	for (let index = 0; index < webcams.length; index++) {
		webcams[index].device_name = webcamNames[index];
	}

	// update app state
	appState.update((at) => {
		at.webcam_infos = webcams;
		return at;
	});

	return webcams;
}
