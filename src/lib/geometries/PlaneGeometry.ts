import { Geometry } from "@lib/Geometry";

// TODO: Generate based on parameters
const position = [
	0.5, 0.5, 0.0, 0.5, -0.5, 0.0, -0.5, -0.5, 0.0, -0.5, 0.5, 0.0,
];

const uv = [1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0];

const index = [0, 1, 3, 1, 2, 3];

export class PlaneGeometry extends Geometry {
	constructor(gl: WebGL2RenderingContext) {
		super(gl, {
			position: { size: 3, data: new Float32Array(position) },
			uv: { size: 2, data: new Float32Array(uv) },
			index: { size: 1, data: new Int32Array(index) },
		});
	}
}
