import type { WebcamInfo } from '$lib/types/WebcamInfo';

export interface IAppState {
	//from backend
	webcam_stared: boolean;
	stared_device_indices: number[];
	is_camera_calibrated: boolean;
	is_camera_calibrating: boolean;
	// from frontend
	is_starging_webcams: boolean;
	webcam_infos: WebcamInfo[];
	get_started_webcam_infos: () => WebcamInfo[];
}
