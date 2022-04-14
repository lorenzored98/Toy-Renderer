import type { Geometry } from "./Geometry";
import type { Program } from "./Program";
import { Transform } from "./Transform";

type MeshProps = {
	program: Program;
	geometry: Geometry;

	mode?:
		| "POINTS"
		| "LINES"
		| "LINE_LOOP"
		| "LINE_STRIP"
		| "TRIANGLES"
		| "TRIANGLE_STRIP"
		| "TRIANGLE_FAN";
};

export class Mesh extends Transform {
	gl: WebGL2RenderingContext;
	program: Program;
	geometry: Geometry;
	mode: number;

	constructor(
		gl: WebGL2RenderingContext,
		{ program, geometry, mode = "TRIANGLES" }: MeshProps
	) {
		super();

		this.gl = gl;
		this.program = program;
		this.geometry = geometry;
		this.mode = gl[mode];

		this.program.link(this.geometry.attributes);
		this.geometry.setupBuffer();
	}
}
