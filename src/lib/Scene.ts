import { Mesh } from "./Mesh";

type Child = Mesh;

export class Scene {
	children: Child[] = [];
	constructor() {}

	add(child: Child) {
		this.children.push(child);
	}
}
