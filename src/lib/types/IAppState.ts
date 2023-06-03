import type { WebcamInfo } from '$lib/types/WebcamInfo';

export interface IAppState {
	//from backend
	webcam_stared: boolean;
	stared_device_indices: number[];
	is_camera_calibrated: boolean;
	is_camera_calibrating: boolean;
	calibrate_progress: number;
	// from frontend
	is_starging_webcams: boolean;
	webcam_infos: WebcamInfo[];
	view_dimension: '2d' | '3d';
	get_started_webcam_infos: () => WebcamInfo[];
}
