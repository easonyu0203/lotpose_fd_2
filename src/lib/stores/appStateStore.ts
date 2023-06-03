import { writable } from 'svelte/store';
import type { IAppState } from '$lib/types/IAppState';
import type { WebcamInfo } from '$lib/types/WebcamInfo';

let value: any;

export const appState = writable<IAppState>({
	webcam_stared: false,
	is_starging_webcams: false,
	stared_device_indices: [],
	webcam_infos: [],
	is_camera_calibrated: false,
	is_camera_calibrating: false,
	calibrate_progress: 0,
	view_dimension: '2d',
	get_started_webcam_infos: () => {
		// return stared webcams
		let webcams: WebcamInfo[] = [];
		webcams = value.webcam_infos.filter((webcam: WebcamInfo) => {
			return value.stared_device_indices.includes(webcam.index);
		});
		return webcams;
	}
});

appState.subscribe((at) => {
	value = at;
});
