import type { Camera } from "@lib/cameras/Camera";

type OrbitControlsProps = {
	root: HTMLElement;
	camera: Camera;
};

const STATE = {
	none: 0,
	rotate: 1,
	pan: 2,
	zoom: 4,
};

export class OrbitControls {
	state: number = STATE.none;

	constructor({ root, camera }: OrbitControlsProps) {
		const onPointerDown = (e: PointerEvent) => {
			root.setPointerCapture(e.pointerId);

			const value = e.buttons;
			this.state = value;

			if (value !== 1 && value !== 2 && value !== 4) {
				this.state = 0;
			}
		};

		const onPointerMove = () => {
			// if(this.state)
		};

		const onPointerUp = (e: PointerEvent) => {
			this.state = 0;
			root.releasePointerCapture(e.pointerId);
		};

		root.addEventListener("pointerdown", onPointerDown, { passive: true });
		root.addEventListener("pointermove", onPointerMove, { passive: true });
		root.addEventListener("pointerup", onPointerUp, { passive: true });
		root.addEventListener("pointercancel", onPointerUp, { passive: true });
		root.addEventListener("contextmenu", (e) => e.preventDefault());
	}
}

/**
 * Left mouse btn rotates around point with constraints if there are eg. max horiz rotation, max vert rotation
 * Right mouse btn pans the camera keeping track of initial offset between pos and target ?
 * scroll will modify zoom between 0 and 1 ?
 *
 */
