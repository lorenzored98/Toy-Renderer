import { Mat4 } from "@lib/math/Mat4";
import { Vec3 } from "@lib/math/Vec3";

export class Transform {
	position: Vec3 = new Vec3(0, 0, 0);
	rotation: Vec3 = new Vec3(0, 0, 0);
	scale: Vec3 = new Vec3(1, 1, 1);

	modelMatrix: Mat4 = new Mat4();

	updateModelMatrix() {
		this.modelMatrix.identity();
		this.modelMatrix.translate(this.position);
		this.modelMatrix.rotateX(this.rotation.x);
		this.modelMatrix.rotateY(this.rotation.y);
		this.modelMatrix.rotateZ(this.rotation.z);
		this.modelMatrix.scale(this.scale);
	}
}
