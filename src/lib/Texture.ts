type TextureWrap = "REPEAT" | "MIRRORED_REPEAT" | "CLAMP_TO_EDGE";
type MagFilter = "NEAREST" | "LINEAR";
type MinFilter = MagFilter;
type MipMapMinFilter =
	| "NEAREST_MIPMAP_NEAREST"
	| "LINEAR_MIPMAP_NEAREST"
	| "NEAREST_MIPMAP_LINEAR"
	| "LINEAR_MIPMAP_LINEAR"
	| null;

type MipMapsProps = {
	generate: boolean;
	minFilter: MipMapMinFilter;
};

type TextureProps = {
	src: string;
	mipmaps?: MipMapsProps;
	internalFormat?: "rgb" | "rgba";
	target?: "rgb" | "rgba";
	wrapS?: TextureWrap;
	wrapT?: TextureWrap;
	minFilter?: MinFilter;
	magFilter?: MagFilter;
	flipY?: boolean;
};

let id = 0;

export class Texture {
	id: number;
	gl: WebGL2RenderingContext;
	value: WebGLTexture;
	image: HTMLImageElement;
	internalFormat: number;
	target: number;
	wrapS: number;
	wrapT: number;
	minFilter: number;
	magFilter: number;

	constructor(
		gl: WebGL2RenderingContext,
		{
			src,
			mipmaps = { generate: false, minFilter: null },
			internalFormat = "rgba",
			target = "rgba",
			wrapS = "REPEAT",
			wrapT = "REPEAT",
			minFilter = "NEAREST",
			magFilter = "NEAREST",
			flipY = false,
		}: TextureProps
	) {
		this.id = id;
		id++;

		this.gl = gl;

		const texture = gl.createTexture();

		if (!texture) {
			throw new Error("Couldn't create texture");
		}

		this.value = texture;

		this.target = target === "rgb" ? gl.RGB : gl.RGBA;
		this.internalFormat = internalFormat === "rgb" ? gl.RGB : gl.RGBA;

		this.wrapS = this.gl[wrapS];
		this.wrapT = this.gl[wrapT];
		this.minFilter = this.gl[minFilter];
		this.magFilter = this.gl[magFilter];

		if (mipmaps.generate && mipmaps.minFilter !== null) {
			this.minFilter = this.gl[mipmaps.minFilter];
		}

		this.image = new Image();
		this.image.crossOrigin = "anonymous";
		this.image.src = src;

		this.image.onload = () => {
			this.use();

			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.wrapS);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.wrapT);
			gl.texParameteri(
				gl.TEXTURE_2D,
				gl.TEXTURE_MIN_FILTER,
				this.minFilter
			);
			gl.texParameteri(
				gl.TEXTURE_2D,
				gl.TEXTURE_MAG_FILTER,
				this.magFilter
			);

			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flipY);

			gl.texImage2D(
				gl.TEXTURE_2D,
				0,
				this.internalFormat,
				this.image.width,
				this.image.height,
				0,
				this.target,
				gl.UNSIGNED_BYTE,
				this.image
			);

			if (mipmaps.generate) {
				gl.generateMipmap(gl.TEXTURE_2D);
			}
		};
	}

	use() {
		this.gl.activeTexture(this.gl.TEXTURE0 + this.id);
		this.gl.bindTexture(this.gl.TEXTURE_2D, this.value);
	}
}
