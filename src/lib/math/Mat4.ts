import { Vec3 } from "./Vec3";

type Elements = [
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number
];

export class Mat4 {
	elements: Elements;

	constructor() {
		this.elements = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
	}

	set(e: Elements) {
		this.elements = [...e];
	}

	clone() {
		return new Mat4().set(this.elements);
	}

	identity() {
		this.elements = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
	}

	// https://webgl2fundamentals.org/webgl/lessons/webgl-3d-orthographic.html
	multiply(m: Mat4) {
		const a = this.elements;
		const b = m.elements;

		const b00 = b[0 * 4 + 0];
		const b01 = b[0 * 4 + 1];
		const b02 = b[0 * 4 + 2];
		const b03 = b[0 * 4 + 3];
		const b10 = b[1 * 4 + 0];
		const b11 = b[1 * 4 + 1];
		const b12 = b[1 * 4 + 2];
		const b13 = b[1 * 4 + 3];
		const b20 = b[2 * 4 + 0];
		const b21 = b[2 * 4 + 1];
		const b22 = b[2 * 4 + 2];
		const b23 = b[2 * 4 + 3];
		const b30 = b[3 * 4 + 0];
		const b31 = b[3 * 4 + 1];
		const b32 = b[3 * 4 + 2];
		const b33 = b[3 * 4 + 3];
		const a00 = a[0 * 4 + 0];
		const a01 = a[0 * 4 + 1];
		const a02 = a[0 * 4 + 2];
		const a03 = a[0 * 4 + 3];
		const a10 = a[1 * 4 + 0];
		const a11 = a[1 * 4 + 1];
		const a12 = a[1 * 4 + 2];
		const a13 = a[1 * 4 + 3];
		const a20 = a[2 * 4 + 0];
		const a21 = a[2 * 4 + 1];
		const a22 = a[2 * 4 + 2];
		const a23 = a[2 * 4 + 3];
		const a30 = a[3 * 4 + 0];
		const a31 = a[3 * 4 + 1];
		const a32 = a[3 * 4 + 2];
		const a33 = a[3 * 4 + 3];

		this.elements = [
			b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
			b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
			b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
			b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
			b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
			b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
			b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
			b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
			b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
			b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
			b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
			b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
			b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
			b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
			b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
			b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
		];
	}

	translate(v: Vec3) {
		this.multiply(translation(v));
	}

	scale(v: Vec3) {
		this.multiply(scaling(v));
	}

	rotate(v: Vec3) {
		this.rotateX(v.x);
		this.rotateY(v.y);
		this.rotateZ(v.z);
	}

	rotateX(rad: number) {
		this.multiply(xRotation(rad));
	}

	rotateY(rad: number) {
		this.multiply(yRotation(rad));
	}

	rotateZ(rad: number) {
		this.multiply(zRotation(rad));
	}

	// https://github.com/greggman/twgl.js/blob/master/src/m4.js
	static inverse(mat: Mat4) {
		const newMat = new Mat4();
		const m = mat.elements;
		const dst = newMat.elements;

		const m00 = m[0 * 4 + 0];
		const m01 = m[0 * 4 + 1];
		const m02 = m[0 * 4 + 2];
		const m03 = m[0 * 4 + 3];
		const m10 = m[1 * 4 + 0];
		const m11 = m[1 * 4 + 1];
		const m12 = m[1 * 4 + 2];
		const m13 = m[1 * 4 + 3];
		const m20 = m[2 * 4 + 0];
		const m21 = m[2 * 4 + 1];
		const m22 = m[2 * 4 + 2];
		const m23 = m[2 * 4 + 3];
		const m30 = m[3 * 4 + 0];
		const m31 = m[3 * 4 + 1];
		const m32 = m[3 * 4 + 2];
		const m33 = m[3 * 4 + 3];
		const tmp_0 = m22 * m33;
		const tmp_1 = m32 * m23;
		const tmp_2 = m12 * m33;
		const tmp_3 = m32 * m13;
		const tmp_4 = m12 * m23;
		const tmp_5 = m22 * m13;
		const tmp_6 = m02 * m33;
		const tmp_7 = m32 * m03;
		const tmp_8 = m02 * m23;
		const tmp_9 = m22 * m03;
		const tmp_10 = m02 * m13;
		const tmp_11 = m12 * m03;
		const tmp_12 = m20 * m31;
		const tmp_13 = m30 * m21;
		const tmp_14 = m10 * m31;
		const tmp_15 = m30 * m11;
		const tmp_16 = m10 * m21;
		const tmp_17 = m20 * m11;
		const tmp_18 = m00 * m31;
		const tmp_19 = m30 * m01;
		const tmp_20 = m00 * m21;
		const tmp_21 = m20 * m01;
		const tmp_22 = m00 * m11;
		const tmp_23 = m10 * m01;

		const t0 =
			tmp_0 * m11 +
			tmp_3 * m21 +
			tmp_4 * m31 -
			(tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
		const t1 =
			tmp_1 * m01 +
			tmp_6 * m21 +
			tmp_9 * m31 -
			(tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
		const t2 =
			tmp_2 * m01 +
			tmp_7 * m11 +
			tmp_10 * m31 -
			(tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
		const t3 =
			tmp_5 * m01 +
			tmp_8 * m11 +
			tmp_11 * m21 -
			(tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

		const d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

		dst[0] = d * t0;
		dst[1] = d * t1;
		dst[2] = d * t2;
		dst[3] = d * t3;
		dst[4] =
			d *
			(tmp_1 * m10 +
				tmp_2 * m20 +
				tmp_5 * m30 -
				(tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30));
		dst[5] =
			d *
			(tmp_0 * m00 +
				tmp_7 * m20 +
				tmp_8 * m30 -
				(tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30));
		dst[6] =
			d *
			(tmp_3 * m00 +
				tmp_6 * m10 +
				tmp_11 * m30 -
				(tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30));
		dst[7] =
			d *
			(tmp_4 * m00 +
				tmp_9 * m10 +
				tmp_10 * m20 -
				(tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20));
		dst[8] =
			d *
			(tmp_12 * m13 +
				tmp_15 * m23 +
				tmp_16 * m33 -
				(tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33));
		dst[9] =
			d *
			(tmp_13 * m03 +
				tmp_18 * m23 +
				tmp_21 * m33 -
				(tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33));
		dst[10] =
			d *
			(tmp_14 * m03 +
				tmp_19 * m13 +
				tmp_22 * m33 -
				(tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33));
		dst[11] =
			d *
			(tmp_17 * m03 +
				tmp_20 * m13 +
				tmp_23 * m23 -
				(tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23));
		dst[12] =
			d *
			(tmp_14 * m22 +
				tmp_17 * m32 +
				tmp_13 * m12 -
				(tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22));
		dst[13] =
			d *
			(tmp_20 * m32 +
				tmp_12 * m02 +
				tmp_19 * m22 -
				(tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02));
		dst[14] =
			d *
			(tmp_18 * m12 +
				tmp_23 * m32 +
				tmp_15 * m02 -
				(tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12));
		dst[15] =
			d *
			(tmp_22 * m22 +
				tmp_16 * m02 +
				tmp_21 * m12 -
				(tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02));

		return newMat;
	}
}

const translation = (v: Vec3) => {
	const mat = new Mat4();

	mat.elements[12] = v.x;
	mat.elements[13] = v.y;
	mat.elements[14] = v.z;

	return mat;
};

const scaling = (v: Vec3) => {
	const mat = new Mat4();

	mat.elements[0] = v.x;
	mat.elements[5] = v.y;
	mat.elements[10] = v.z;

	return mat;
};

const xRotation = (rad: number) => {
	const c = Math.cos(rad);
	const s = Math.sin(rad);

	const mat = new Mat4();

	mat.elements[5] = c;
	mat.elements[6] = s;
	mat.elements[9] = -s;
	mat.elements[10] = c;

	return mat;
};

const yRotation = (rad: number) => {
	const c = Math.cos(rad);
	const s = Math.sin(rad);

	const mat = new Mat4();

	mat.elements[0] = c;
	mat.elements[2] = -s;
	mat.elements[8] = s;
	mat.elements[10] = c;

	return mat;
};

const zRotation = (rad: number) => {
	const c = Math.cos(rad);
	const s = Math.sin(rad);

	const mat = new Mat4();

	mat.elements[0] = c;
	mat.elements[1] = s;
	mat.elements[4] = -s;
	mat.elements[5] = c;

	return mat;
};
