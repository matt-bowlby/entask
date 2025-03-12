import { IdHandler } from "../calendar/IdHandler.js";

class Tag {
	public name: string;
	public description: string = "";

	readonly id: number;

	constructor(name: string) {
		this.name = name;
		this.id = IdHandler.requestId(this);
	}
}

export default Tag;