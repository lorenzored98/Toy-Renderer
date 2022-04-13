import type { OrtographicCamera } from "@lib/cameras/OrtographicCamera";
import type { PerspectiveCamera } from "@lib/cameras/PerspectiveCamera";
import type { Scene } from "@lib/Scene";
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
			const model = new Mat4();
			model.translate(child.position);
			model.rotate(child.rotation);
			model.scale(child.scale);

			child.program.setUniformValue("model", model.elements);
			child.program.setUniformValue("view", camera.viewMatrix.elements);

			if (updatedProjection) {
				child.program.setUniformValue(
					"projection",
					camera.projectionMatrix.elements
				);
			}

			for (const key of Object.keys(child.program.uniforms)) {
				if (child.program.uniformsInfo[key].autoUpdate) {
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
