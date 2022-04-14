import { Mat4 } from "./Mat4";

type Elements = [
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

export class Mat3 {
	elements: Elements;
	constructor(e?: Elements) {
		this.elements = e || [1, 0, 0, 0, 1, 0, 0, 0, 1];
	}

	identity() {
		this.elements = [1, 0, 0, 0, 1, 0, 0, 0, 1];
	}

	set(e: Elements) {
		this.elements = e;
	}

	static fromMat4(m: Mat4) {
		const e = m.elements;
		return new Mat3([
			e[0],
			e[1],
			e[2],
			e[4],
			e[5],
			e[6],
			e[8],
			e[9],
			e[10],
		]);
	}
}
