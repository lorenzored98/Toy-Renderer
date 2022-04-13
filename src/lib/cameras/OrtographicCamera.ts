import { Mat4 } from "@lib/math/Mat4";
import { Camera } from "@lib/cameras/Camera";

type OrtographicCameraProps = {
	left: number;
	right: number;
	bottom: number;
	top: number;
	near: number;
	far: number;
};

export class OrtographicCamera extends Camera {
	left: number;
	right: number;
	bottom: number;
	top: number;
	near: number;
	far: number;

	viewMatrix: Mat4 = new Mat4();
	projectionMatrix: Mat4 = new Mat4();

	constructor(props: OrtographicCameraProps) {
		super();

		this.left = props.left;
		this.right = props.right;
		this.bottom = props.bottom;
		this.top = props.top;
		this.near = props.near;
		this.far = props.far;

		this.updateProjectionMatrix();
	}

	updateProjectionMatrix() {
		this.projectionMatrix.set(
			ortographicProjectionMatrix(
				this.left,
				this.right,
				this.bottom,
				this.top,
				this.near,
				this.far
			)
		);

		this.updatedProjection = true;
	}
}

// https://webgl2fundamentals.org/webgl/lessons/webgl-3d-orthographic.html
const ortographicProjectionMatrix = (
	left: number,
	right: number,
	bottom: number,
	top: number,
	near: number,
	far: number
): Mat4["elements"] => {
	return [
		2 / (right - left),
		0,
		0,
		0,
		0,
		2 / (top - bottom),
		0,
		0,
		0,
		0,
		2 / (near - far),
		0,
		(left + right) / (left - right),
		(bottom + top) / (bottom - top),
		(near + far) / (near - far),
		1,
	];
};
