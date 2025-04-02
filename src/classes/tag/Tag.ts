import IdHandler from "../calendar/IdHandler";

class Tag {
	/**
	 * The name of the tag.
	 */
	protected name: string;
	/**
	 * A description of the tag.
	 */
	protected description: string = "";
	/**
	 * The color of the tag in hexadecimal, without the '#' character.
	 */
	protected color: string = "000000";

	/**
	 * The unique identifier of the tag.
	 */
	readonly id: number;

	constructor(name: string, description: string = "", color: string = "000000", customId: number = -1) {
		this.name = name;
		this.setDescription(description);
		this.setColor(color);
		this.id = customId !== -1 ? customId : IdHandler.requestId(this);
		if (customId !== -1) IdHandler.registerId(this.id, this);
	}

	/**
	 * Sets the name of the tag.
	 * @param name
	 */
	public setName(name: string): void {
		this.name = name;
	}

	/**
	 * Gets the name of the tag.
	 * @returns The name of the tag.
	 */
	public getName(): string {
		return this.name;
	}

	/**
	 * Sets the description of the tag.
	 * @param description
	 */
	public setDescription(description: string): void {
		this.description = description;
	}

	/**
	 * Gets the description of the tag.
	 * @returns The description of the tag.
	 */
	public getDescription(): string {
		return this.description;
	}

	/**
	 * Sets the color of the tag.
	 * @param color
	 */
	public setColor(color: string): void {
		if (color.substring(0, 1) === "#") color = color.substring(1);
		this.color = color;
	}

	/**
	 * Gets the color of the tag in hexadecimal, without the '#' character.
	 * @returns The color of the tag in hexadecimal, without the '#' character.
	 */
	public getColor(): string {
		return this.color;
	}
}

export default Tag;