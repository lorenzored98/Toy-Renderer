import type { Program } from "./Program";

export type GeometryProps = {
	usage?: "STATIC_DRAW" | "DYNAMIC_DRAW" | "STREAM_DRAW";
};

type AttributeReservedKey = "position" | "uv" | "normal" | "color" | "index";

type AttributeValue = {
	size: number;
	data: Float32Array | Int32Array;
	normalized: boolean;
	location: number;
};

type Attributes = {
	[k in AttributeReservedKey]?: AttributeValue;
} & { [key: string]: AttributeValue };

type PropsAttributeValue = Partial<AttributeValue> &
	Pick<AttributeValue, "size" | "data">;

type PropsAttributes = {
	[k in AttributeReservedKey]?: PropsAttributeValue;
} & { [key: string]: PropsAttributeValue };

export class Geometry {
	gl: WebGL2RenderingContext;
	vao: WebGLVertexArrayObject | null;
	vbo: WebGLBuffer | null;
	ebo: WebGLBuffer | null;
	attributes: Attributes = {};
	usage: number;

	constructor(
		gl: WebGL2RenderingContext,
		attributes: PropsAttributes,
		{ usage = "STATIC_DRAW" }: GeometryProps
	) {
		this.gl = gl;
		this.vao = gl.createVertexArray();
		this.vbo = gl.createBuffer();
		this.ebo = gl.createBuffer();

		this.usage = gl[usage];

		for (const [key, value] of Object.entries(attributes)) {
			if (key === "index" && !(value.data instanceof Int32Array)) {
				throw new Error("Index attribute data must be Int32Array");
			}
			this.addAttribute(key, value);
		}
	}

	addAttribute(
		key: string,
		{ size, data, normalized = false, location = -1 }: PropsAttributeValue
	) {
		const attr: AttributeValue = {
			size,
			data,
			normalized,
			location,
		};

		this.attributes[key] = attr;
	}

	setupBuffer(program: Program) {
		const b = Float32Array.BYTES_PER_ELEMENT;

		const entries = Object.entries(this.attributes);

		// Pack floats into single array
		let fSize = 0;
		let stride = 0;
		let offset = 0;

		const fAttrs = [];
		for (const [_, attr] of entries) {
			if (attr.data instanceof Float32Array) {
				fAttrs.push(attr);
				fSize += attr.data.length;
				stride += attr.size;
			}
		}

		/** TODO:
		 * packing ints
		 * packing based on normalized ?
		 * packing based on draw usage
		 */

		// Split this into another function that packs a buffer
		// with floats / ints and store floatvbo and intvbo;

		const fData = new Float32Array(fSize);

		for (let i = 0; i < fAttrs.length; i++) {
			const attr = fAttrs[i];
			const data = attr.data;

			for (let j = 0; j < data.length; j += attr.size) {
				const index = (j * stride) / attr.size + offset;

				for (let k = 0; k < attr.size; k++) {
					fData[index + k] = data[j + k];
				}
			}

			offset += attr.size;
		}

		this.gl.bindVertexArray(this.vao);

		for (const [key, attr] of entries) {
			if (key !== "index") {
				this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);
				this.gl.bufferData(this.gl.ARRAY_BUFFER, fData, this.usage);

				attr.location = program.getAttribLocation(key);
			} else {
				this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.ebo);
				this.gl.bufferData(
					this.gl.ELEMENT_ARRAY_BUFFER,
					attr.data,
					this.usage
				);
			}
		}

		// Reset offset so that it's properly set in loop below
		offset = 0;

		for (const [key, attr] of entries) {
			if (key !== "index") {
				const type =
					attr.data instanceof Float32Array
						? this.gl.FLOAT
						: this.gl.INT;

				this.gl.enableVertexAttribArray(attr.location);
				this.gl.vertexAttribPointer(
					attr.location,
					attr.size,
					type,
					attr.normalized,
					stride * b,
					offset * b
				);

				offset += attr.size;
			}
		}

		// TODO: ?check this maybe it wont work
		this.gl.bindVertexArray(null);
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
	}
}
