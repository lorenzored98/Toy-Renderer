import type { Vec2 } from "./Vec2";
import { Vec3 } from "./Vec3";

export const dot2 = (v0: Vec2, v1: Vec2) => {
	return v0.x * v1.x + v0.y * v1.y;
};

export const dot3 = (v0: Vec3, v1: Vec3) => {
	return v0.x * v1.x + v0.y * v1.y + v0.z * v0.z;
};

export const cross = (v0: Vec3, v1: Vec3) => {
	return new Vec3(
		v0.y * v1.z - v0.z * v1.y,
		v0.z * v1.x - v0.x * v1.z,
		v0.x * v1.y - v0.y * v1.x
	);
};

export const radians = (n: number): number => {
	return n * (Math.PI / 180);
};

export const degrees = (n: number): number => {
	return n * (180 / Math.PI);
};

export const randomInRange = (min: number, max: number): number => {
	return Math.random() * (max - min) + min;
};

export const randomIntInRange = (min: number, max: number): number => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1) + min);
};

export const clamp = (n: number, min: number, max: number) => {
	return Math.min(Math.max(n, min), max);
};
