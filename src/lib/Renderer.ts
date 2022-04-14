import type { OrtographicCamera } from "@lib/cameras/OrtographicCamera";
import type { PerspectiveCamera } from "@lib/cameras/PerspectiveCamera";
import type { Scene } from "@lib/Scene";
import { Mat3 } from "./math/Mat3";
import { Mat4 } from "./math/Mat4";

type RendererProps = {
	canvas: HTMLCanvasElement;
};

export class Renderer {
	canvas: HTMLCanvasElement;
	gl: WebGL2RenderingContext;

	constructor({ canvas }: RendererProps) {
		this.canvas = canvas;
		const gl = this.canvas.getContext("webgl2") as WebGL2RenderingContext;

		if (!gl) {
			throw new Error("NO WEBGL2");
		}
		this.gl = gl;
	}

	render(scene: Scene, camera: PerspectiveCamera | OrtographicCamera) {
		const updatedProjection = camera.updatedProjection;

		camera.updateViewMatrix();

		// TODO: Change with a traverse fn when adding scene graph...
		for (const child of scene.children) {
			// TODO: Need to account previous transforms
			const modelMatrix = new Mat4();
			modelMatrix.translate(child.position);
			modelMatrix.rotate(child.rotation);
			modelMatrix.scale(child.scale);

			child.program.setUniformValue("modelMatrix", modelMatrix.elements);
			child.program.setUniformValue(
				"viewMatrix",
				camera.viewMatrix.elements
			);

			if (updatedProjection) {
				child.program.setUniformValue(
					"projectionMatrix",
					camera.projectionMatrix.elements
				);
			}

			if (child.program.uniformsInfo.normalMatrix.location !== -1) {
				/**
				 * TODO:
				 * From what I've seen people would transpose the modelMatrix after inverting
				 * maybe it's because many tutorial / resource use a column major matrix but
				 * since I use a row based one transposing breaks the matrix.
				 * Not sure if it's that or maybe the way I construct the Mat3 is wrong..
				 */
				const inverseModel = Mat4.inverse(modelMatrix);
				const normalMatrix = Mat3.fromMat4(inverseModel);

				child.program.setUniformValue(
					"normalMatrix",
					normalMatrix.elements
				);
			}

			if (child.program.uniformsInfo.cameraPos.location !== -1) {
				child.program.setUniformValue("cameraPos", camera.position);
			}

			for (const key of Object.keys(child.program.uniforms)) {
				const info = child.program.uniformsInfo[key];
				if (info && info.autoUpdate) {
					child.program.setUniformValue(
						key,
						child.program.uniforms[key]
					);
				}
			}

			this.gl.bindVertexArray(child.geometry.vao);

			if (child.geometry.attributes.index) {
				this.gl.drawElements(
					child.mode,
					child.geometry.attributes.index.data.length,
					this.gl.UNSIGNED_INT,
					0
				);
			} else if (child.geometry.attributes.position) {
				this.gl.drawArrays(
					child.mode,
					0,
					child.geometry.attributes.position.data.length
				);
			}

			this.gl.bindVertexArray(null);
		}

		camera.updatedProjection = false;
	}
}
