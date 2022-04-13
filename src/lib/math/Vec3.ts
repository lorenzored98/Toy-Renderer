export type Vec3ArrObj =
	| Vec3
	| [number, number, number]
	| { x: number; y: number; z: number };

export class Vec3 {
	x: number;
	y: number;
	z: number;

	constructor(x: number, y: number, z: number) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	set(x: number, y: number, z: number) {
		this.x = x;
		this.y = y;
		this.z = z;
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

	clone() {
		return new Vec3(this.x, this.y, this.z);
	}

	add(v: Vec3ArrObj) {
		if (Array.isArray(v)) {
			this.x += v[0];
			this.y += v[1];
			this.z += v[2];
		} else {
			this.x += v.x;
			this.y += v.y;
			this.z += v.z;
		}
	}

	addScalar(x: number) {
		this.x += x;
		this.y += x;
		this.z += x;
	}

	sub(v: Vec3ArrObj) {
		if (Array.isArray(v)) {
			this.x -= v[0];
			this.y -= v[1];
			this.z -= v[2];
		} else {
			this.x -= v.x;
			this.y -= v.y;
			this.z -= v.z;
		}
	}

	subScalar(x: number) {
		this.x -= x;
		this.y -= x;
		this.z -= x;
	}

	mult(v: Vec3ArrObj) {
		if (Array.isArray(v)) {
			this.x *= v[0];
			this.y *= v[1];
			this.z *= v[2];
		} else {
			this.x *= v.x;
			this.y *= v.y;
			this.z *= v.z;
		}
	}

	multScalar(x: number) {
		this.x *= x;
		this.y *= x;
		this.z *= x;
	}

	divide(v: Vec3ArrObj) {
		if (Array.isArray(v)) {
			this.x /= v[0];
			this.y /= v[1];
			this.z /= v[2];
		} else {
			this.x /= v.x;
			this.y /= v.y;
			this.z /= v.z;
		}
	}

	divideScalar(x: number) {
		this.x /= x;
		this.y /= x;
		this.z /= x;
	}

	negate() {
		this.x *= -1;
		this.y *= -1;
		this.z *= -1;
	}

	len() {
		return Math.sqrt(this.lenSq());
	}

	lenSq() {
		return this.x * this.x + this.y * this.y + this.z * this.z;
	}

	normalize() {
		const len = this.len();
		this.x /= len;
		this.y /= len;
		this.z /= len;
	}
}
