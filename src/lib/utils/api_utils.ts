import type { IAppState } from '$lib/types/IAppState';
import type { WebcamInfo } from '$lib/types/WebcamInfo';
import { appState } from '../stores/appStateStore';

export async function fetchAppState(): Promise<IAppState> {
	try {
		const response = await fetch(`${import.meta.env.VITE_BD_URL}/`);
		const return_json = await response.json();
		return return_json;
	} catch (error) {
		console.error('Error fetching app state:', error);
		return {
			webcam_stared: false,
			is_starging_webcams: false,
			stared_device_indices: [],
			webcam_infos: [],
			is_camera_calibrated: false,
			is_camera_calibrating: false,
			get_started_webcam_infos: () => []
		};
	}
}

export async function fetchWebcamDeviceInfo(): Promise<WebcamInfo[]> {
	try {
		const response = await fetch(`${import.meta.env.VITE_BD_URL}/list-webcams`);
		let webcams = await response.json();
		webcams = webcams.map((webcam: any) => {
			webcam.src = `${import.meta.env.VITE_BD_URL}/get-stream/${webcam.index}`;
			return webcam;
		});

		// update app state
		const app_state_json = await fetchAppState();
		appState.update((x) => {
			return { ...x, ...app_state_json };
		});

		return webcams;
	} catch (error) {
		console.error('Error fetching webcam device info:', error);
		return [];
	}
}

export async function fetchStartWebcams(device_indices: number[]): Promise<void> {
	try {
		appState.update((at) => {
			at.is_starging_webcams = true;
			return at;
		});

		const response = await fetch(`${import.meta.env.VITE_BD_URL}/start-webcams`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(device_indices)
		});

		// set app state
		const app_state_json = await fetchAppState();
		app_state_json.is_starging_webcams = false;
		appState.update((x) => {
			return { ...x, ...app_state_json };
		});

		return await response.json();
	} catch (error) {
		console.error('Error starting webcams:', error);
	}
}

export async function fetchStopWebcams(): Promise<void> {
	try {
		const response = await fetch(`${import.meta.env.VITE_BD_URL}/stop-webcams`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		// update app state
		const app_state_json = await fetchAppState();
		appState.update((x) => {
			return { ...x, ...app_state_json };
		});

		return await response.json();
	} catch (error) {
		console.error('Error stopping webcams:', error);
	}
}

export async function fetchCalibrateCamera(): Promise<void> {
	try {
		const response = await fetch(`${import.meta.env.VITE_BD_URL}/calibrate-camera`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		// update app state
		const app_state_json = await fetchAppState();
		appState.update((x) => {
			return { ...x, ...app_state_json };
		});

		return await response.json();
	} catch (error) {
		console.error('Error stopping webcams:', error);
	}
}
