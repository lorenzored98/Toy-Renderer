export type Vec4ArrObj =
	| Vec4
	| [number, number, number, number]
	| { x: number; y: number; z: number; w: number };

export class Vec4 {
	x: number;
	y: number;
	z: number;
	w: number;

	constructor(x: number, y: number, z: number, w: number) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
	}

	set(x: number, y: number, z: number, w: number) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
	}

	setX(x: number) {
		this.x = x;
	}

	setY(y: number) {
		this.y = y;
	}

	setZ(z: number) {
		this.z = z;
	}

	setW(w: number) {
		this.w = w;
	}

	clone() {
		return new Vec4(this.x, this.y, this.z, this.w);
	}

	add(v: Vec4ArrObj) {
		if (Array.isArray(v)) {
			this.x += v[0];
			this.y += v[1];
			this.z += v[2];
			this.w += v[3];
		} else {
			this.x += v.x;
			this.y += v.y;
			this.z += v.z;
			this.w += v.w;
		}
	}

	addScalar(x: number) {
		this.x += x;
		this.y += x;
		this.z += x;
		this.w += x;
	}

	sub(v: Vec4ArrObj) {
		if (Array.isArray(v)) {
			this.x -= v[0];
			this.y -= v[1];
			this.z -= v[2];
			this.w -= v[3];
		} else {
			this.x -= v.x;
			this.y -= v.y;
			this.z -= v.z;
			this.w -= v.w;
		}
	}

	subScalar(x: number) {
		this.x -= x;
		this.y -= x;
		this.z -= x;
		this.w -= x;
	}

	mult(v: Vec4ArrObj) {
		if (Array.isArray(v)) {
			this.x *= v[0];
			this.y *= v[1];
			this.z *= v[2];
			this.w *= v[3];
		} else {
			this.x *= v.x;
			this.y *= v.y;
			this.z *= v.z;
			this.w *= v.w;
		}
	}

	multScalar(x: number) {
		this.x *= x;
		this.y *= x;
		this.z *= x;
		this.w *= x;
	}

	divide(v: Vec4ArrObj) {
		if (Array.isArray(v)) {
			this.x /= v[0];
			this.y /= v[1];
			this.z /= v[2];
			this.w /= v[3];
		} else {
			this.x /= v.x;
			this.y /= v.y;
			this.z /= v.z;
			this.w /= v.w;
		}
	}

	divideScalar(x: number) {
		this.x /= x;
		this.y /= x;
		this.z /= x;
		this.w /= x;
	}

	negate() {
		this.x *= -1;
		this.y *= -1;
		this.z *= -1;
		this.w *= -1;
	}

	len() {
		return Math.sqrt(this.lenSq());
	}

	lenSq() {
		return (
			this.x * this.x +
			this.y * this.y +
			this.z * this.z +
			this.w * this.w
		);
	}

	normalize() {
		const len = this.len();
		this.x /= len;
		this.y /= len;
		this.z /= len;
		this.w /= len;
	}
}
