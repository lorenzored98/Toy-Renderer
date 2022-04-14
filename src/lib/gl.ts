import type { Geometry } from "./Geometry";

export const _createShader = (
	gl: WebGL2RenderingContext,
	type: "vert" | "frag",
	source: string
) => {
	let t = -1;
	if (type === "vert") {
		t = gl.VERTEX_SHADER;
	} else if (type === "frag") {
		t = gl.FRAGMENT_SHADER;
	}

	const shader = gl.createShader(t);

	if (!shader) {
		throw new Error("Could not create shader");
	}

	gl.shaderSource(shader, source);
	gl.compileShader(shader);

	const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

	if (success) {
		return shader;
	}

	const error = gl.getShaderInfoLog(shader);
	gl.deleteShader(shader);
	throw new Error(error || "Could not compile shader");
};

export const _createProgram = (
	gl: WebGL2RenderingContext,
	{
		vert,
		frag,
		attributes,
	}: {
		vert: WebGLShader;
		frag: WebGLShader;
		attributes: Geometry["attributes"];
	}
) => {
	const program = gl.createProgram();
	if (!program) {
		throw new Error("Could not create program");
	}

	gl.attachShader(program, vert);
	gl.attachShader(program, frag);

	for (const [key, { location }] of Object.entries(attributes)) {
		gl.bindAttribLocation(program, location, key);
	}

	gl.linkProgram(program);

	const success = gl.getProgramParameter(program, gl.LINK_STATUS);

	if (success) {
		gl.deleteShader(vert);
		gl.deleteShader(frag);
		return program;
	}

	const error = gl.getProgramInfoLog(program);
	gl.deleteProgram(program);
	throw new Error(error || "Could not link program");
};
