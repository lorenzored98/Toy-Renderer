import type { Camera } from "@lib/cameras/Camera";
import { PerspectiveCamera } from "@lib/cameras/PerspectiveCamera";
import { clamp, cross, radians } from "@lib/math/utils";
import { Vec2 } from "@lib/math/Vec2";
import { Vec3 } from "@lib/math/Vec3";

type FPSControlsProps = {
	root: HTMLElement;
	camera: Camera;
	speed?: number;
	sensitivity?: number;
};

type Key = {
	w: boolean;
	a: boolean;
	s: boolean;
	d: boolean;
};

export class FPSControls {
	camera: Camera;
	direction = new Vec3(0.0, 0.0, -1.0);
	speed: number;
	sensitivity: number;

	pitch: number = 0;
	yaw: number = -90;

	key: Key = {
		w: false,
		a: false,
		s: false,
		d: false,
	};

	mouse: {
		current: Vec2;
		last: Vec2;
	};

	constructor({
		root,
		camera,
		speed = 5,
		sensitivity = 0.1,
	}: FPSControlsProps) {
		this.speed = speed;
		this.sensitivity = sensitivity;
		this.camera = camera;

		this.mouse = {
			current: new Vec2(0, 0),
			last: new Vec2(0, 0),
		};

		const onKeyDown = (e: KeyboardEvent) => {
			if (e.code === "KeyW") {
				this.key.w = true;
			} else if (e.code === "KeyS") {
				this.key.s = true;
			} else if (e.code === "KeyA") {
				this.key.a = true;
			} else if (e.code === "KeyD") {
				this.key.d = true;
			}
		};

		const onKeyUp = (e: KeyboardEvent) => {
			if (e.code === "KeyW") {
				this.key.w = false;
			} else if (e.code === "KeyS") {
				this.key.s = false;
			} else if (e.code === "KeyA") {
				this.key.a = false;
			} else if (e.code === "KeyD") {
				this.key.d = false;
			}
		};

		const onPointerDown = (e: PointerEvent) => {
			root.setPointerCapture(e.pointerId);
			if (e.buttons === 1) {
				const x = e.clientX;
				const y = e.clientY;

				this.mouse.current.set(x, y);
				this.mouse.last.set(x, y);
			}
		};

		const onPointerMove = (e: PointerEvent) => {
			if (e.buttons === 1) {
				this.mouse.current.x = e.clientX;
				this.mouse.current.y = e.clientY;
			}
		};

		const onPointerUp = (e: PointerEvent) => {
			root.releasePointerCapture(e.pointerId);
		};

		const onScroll = (e: WheelEvent) => {
			if (this.camera instanceof PerspectiveCamera) {
				this.camera.fov += e.deltaY / (100 * sensitivity);
				this.camera.fov = clamp(this.camera.fov, 1, 90);
				this.camera.updateProjectionMatrix();
			}
		};

		root.addEventListener("pointerdown", onPointerDown, { passive: true });
		root.addEventListener("pointermove", onPointerMove, { passive: true });
		root.addEventListener("pointerup", onPointerUp, { passive: true });
		root.addEventListener("pointercancel", onPointerUp, { passive: true });
		root.addEventListener("wheel", onScroll, { passive: true });
		root.addEventListener("contextmenu", (e) => e.preventDefault());

		window.addEventListener("keydown", onKeyDown, { passive: true });
		window.addEventListener("keyup", onKeyUp, { passive: true });
	}

	updateDirection() {
		const radYaw = radians(this.yaw);
		const radPitch = radians(this.pitch);

		this.direction.set(
			Math.cos(radYaw) * Math.cos(radPitch),
			Math.sin(radPitch),
			Math.sin(radYaw) * Math.cos(radPitch)
		);
		this.direction.normalize();
	}

	update(dt: number) {
		let xOffset = this.mouse.current.x - this.mouse.last.x;
		let yOffset = this.mouse.last.y - this.mouse.current.y;

		this.mouse.last.x = this.mouse.current.x;
		this.mouse.last.y = this.mouse.current.y;

		this.yaw += xOffset * this.sensitivity;
		this.pitch += yOffset * this.sensitivity;
		this.pitch = clamp(this.pitch, -89, 89);
		this.updateDirection();

		const cameraSpeed = this.speed * dt;

		if (this.key.w) {
			const v = this.direction.clone();
			v.multScalar(cameraSpeed);
			this.camera.position.add(v);
		}

		if (this.key.s) {
			const v = this.direction.clone();
			v.multScalar(cameraSpeed);
			this.camera.position.sub(v);
		}

		if (this.key.a) {
			const v = cross(this.direction, this.camera.up);
			v.normalize();
			v.multScalar(cameraSpeed);

			this.camera.position.sub(v);
		}

		if (this.key.d) {
			const v = cross(this.direction, this.camera.up);
			v.normalize();
			v.multScalar(cameraSpeed);

			this.camera.position.add(v);
		}

		const newTarget = this.camera.position.clone();
		newTarget.add(this.direction);
		this.camera.target = newTarget;
	}
}
