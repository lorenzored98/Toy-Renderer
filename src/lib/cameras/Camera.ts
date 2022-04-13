import { Mat4 } from "@lib/math/Mat4";
import { cross } from "@lib/math/utils";
import { Vec3 } from "@lib/math/Vec3";

export class Camera {
	lookAtMatrix: Mat4 = new Mat4();
	viewMatrix: Mat4 = new Mat4();
	updatedProjection: boolean = false;

	position: Vec3 = new Vec3(0, 0, 0);
	target: Vec3 = new Vec3(0, 0, 0);

	up: Vec3 = new Vec3(0, 1, 0);

	updateViewMatrix() {
		this.lookAtMatrix.elements = lookUpMatrix(
			this.position,
			this.target,
			this.up
		);
		this.viewMatrix = Mat4.inverse(this.lookAtMatrix);
	}

	lookAt(v: Vec3) {
		this.target = v;
	}
}

const lookUpMatrix = (pos: Vec3, target: Vec3, up: Vec3): Mat4["elements"] => {
	const direction = pos.clone();
	direction.sub(target);
	direction.normalize();

	const cameraRight = cross(up, direction);
	cameraRight.normalize();

	const cameraUp = cross(direction, cameraRight);

	return [
		cameraRight.x,
		cameraRight.y,
		cameraRight.z,
		0,
		cameraUp.x,
		cameraUp.y,
		cameraUp.z,
		0,
		direction.x,
		direction.y,
		direction.z,
		0,
		pos.x,
		pos.y,
		pos.z,
		1,
	];
};
