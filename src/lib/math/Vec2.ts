export type Vec2ArrObj = Vec2 | [number, number] | { x: number; y: number };

export class Vec2 {
	x: number;
	y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	set(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	setX(x: number) {
		this.x = x;
	}

	setY(y: number) {
		this.y = y;
	}

	clone() {
		return new Vec2(this.x, this.y);
	}

	add(v: Vec2ArrObj) {
		if (Array.isArray(v)) {
			this.x += v[0];
			this.y += v[1];
		} else {
			this.x += v.x;
			this.y += v.y;
		}
	}

	addScalar(x: number) {
		this.x += x;
		this.y += x;
	}

	sub(v: Vec2ArrObj) {
		if (Array.isArray(v)) {
			this.x -= v[0];
			this.y -= v[1];
		} else {
			this.x -= v.x;
			this.y -= v.y;
		}
	}

	subScalar(x: number) {
		this.x -= x;
		this.y -= x;
	}

	mult(v: Vec2ArrObj) {
		if (Array.isArray(v)) {
			this.x *= v[0];
			this.y *= v[1];
		} else {
			this.x *= v.x;
			this.y *= v.y;
		}
	}

	multScalar(x: number) {
		this.x *= x;
		this.y *= x;
	}

	divide(v: Vec2ArrObj) {
		if (Array.isArray(v)) {
			this.x /= v[0];
			this.y /= v[1];
		} else {
			this.x /= v.x;
			this.y /= v.y;
		}
	}

	divideScalar(x: number) {
		this.x /= x;
		this.y /= x;
	}

	negate() {
		this.x *= -1;
		this.y *= -1;
	}

	len() {
		return Math.sqrt(this.lenSq());
	}

	lenSq() {
		return this.x * this.x + this.y * this.y;
	}

	normalize() {
		const len = this.len();
		this.x /= len;
		this.y /= len;
	}
}
