import { radians } from "@lib/math/utils";
import { Mat4 } from "@lib/math/Mat4";
import { Camera } from "@lib/cameras/Camera";

type PerspectiveCameraProps = {
	fov: number;
	aspect: number;
	near: number;
	far: number;
};

export class PerspectiveCamera extends Camera {
	fov: number;
	aspect: number;
	near: number;
	far: number;

	viewMatrix: Mat4 = new Mat4();
	projectionMatrix: Mat4 = new Mat4();

	constructor(props: PerspectiveCameraProps) {
		super();

		this.fov = props.fov;
		this.aspect = props.aspect;
		this.near = props.near;
		this.far = props.far;

		this.updateProjectionMatrix();
	}

	updateProjectionMatrix() {
		this.projectionMatrix.set(
			perspectiveProjectionMatrix(
				this.fov,
				this.aspect,
				this.near,
				this.far
			)
		);
		this.updatedProjection = true;
	}
}

// https://webgl2fundamentals.org/webgl/lessons/webgl-3d-perspective.html
const perspectiveProjectionMatrix = (
	fov: number,
	aspect: number,
	near: number,
	far: number
): Mat4["elements"] => {
	const f = Math.tan(Math.PI * 0.5 - 0.5 * radians(fov));
	const rangeInv = 1.0 / (near - far);

	return [
		f / aspect,
		0,
		0,
		0,
		0,
		f,
		0,
		0,
		0,
		0,
		(near + far) * rangeInv,
		-1,
		0,
		0,
		near * far * rangeInv * 2,
		0,
	];
};
