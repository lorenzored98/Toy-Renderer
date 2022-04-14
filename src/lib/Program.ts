import { _createProgram, _createShader } from "./gl";
import { Mat4 } from "./math/Mat4";
import type { Geometry } from "./Geometry";
import type { Vec2ArrObj } from "./math/Vec2";
import type { Vec3ArrObj } from "./math/Vec3";
import type { Vec4ArrObj } from "./math/Vec4";
import type { Texture } from "./Texture";

type Uniform =
	| number
	| Vec2ArrObj
	| Vec3ArrObj
	| Vec4ArrObj
	| WebGLTexture
	| Mat4["elements"];

type ProgramProps = {
	vert: string;
	frag: string;
	uniforms?: {
		[key: string]: Uniform;
	};
};

type UniformsInfo = {
	[key: string]: {
		location: WebGLUniformLocation;
		isStruct: boolean;
		size: number;
		type: number;
		autoUpdate: boolean;
	};
};

export class Program {
	gl: WebGL2RenderingContext;
	id: WebGLProgram;
	uniforms: { [key: string]: Uniform } = {};
	uniformsInfo: UniformsInfo = {
		model: {
			location: -1,
			isStruct: false,
			size: 1,
			type: 35676,
			autoUpdate: true,
		},
		view: {
			location: -1,
			isStruct: false,
			size: 1,
			type: 35676,
			autoUpdate: true,
		},
		projection: {
			location: -1,
			isStruct: false,
			size: 1,
			type: 35676,
			autoUpdate: false,
		},
	};

	vertSource: string = "";
	fragSource: string = "";

	constructor(
		gl: WebGL2RenderingContext,
		{ vert, frag, uniforms = {} }: ProgramProps
	) {
		this.gl = gl;
		this.vertSource = vert;
		this.fragSource = frag;
		this.uniforms = uniforms;

		this.id = 0;
	}

	link(attributes: Geometry["attributes"]) {
		this.id = _createProgram(this.gl, {
			vert: _createShader(this.gl, "vert", this.vertSource),
			frag: _createShader(this.gl, "frag", this.fragSource),
			attributes,
		});

		const ac = this.gl.getProgramParameter(
			this.id,
			this.gl.ACTIVE_UNIFORMS
		);

		for (let i = 0; i < ac; i++) {
			const un = this.gl.getActiveUniform(this.id, i);
			if (!un) continue;

			const { size, type, name } = un;
			const location = this.getUniformLocation(name) || -1;
			const struct = name.split(".");

			if (struct.length > 1) {
				// console.log(un);
				console.error("HANDLE STRUCTS!");
			}

			if (this.uniforms[name]) {
				this.uniformsInfo[name] = {
					location,
					isStruct: struct.length > 1,
					size,
					type,
					autoUpdate: true,
				};

				this.setUniformValue(name, this.uniforms[name]);
			}

			if (name === "model" || name === "view" || name === "projection") {
				this.uniformsInfo[name].location = location;
			}
		}
	}

	use() {
		this.gl.useProgram(this.id);
	}

	getUniformLocation(name: string) {
		return this.gl.getUniformLocation(this.id, name);
	}

	// TODO: Fix typescript crying about values without using any...
	setUniformValue(key: string, u: any) {
		this.use();
		const { type, location } = this.uniformsInfo[key];

		if (type === 35665) {
			if (Array.isArray(u)) {
				this.gl.uniform3f(location, u[0], u[1], u[2]);
			} else {
				this.gl.uniform3f(location, u.x, u.y, u.z);
			}
		} else if (type === 35676) {
			// mat4
			this.gl.uniformMatrix4fv(location, false, u as Float32List);
		} else if (type === 35678) {
			// sampler2D
			this.gl.uniform1i(location, (u as Texture).id);
		} else {
			console.log(type);
			throw new Error("value for uniform type not supported");
		}
	}
}
