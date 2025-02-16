import Thing from "@classes/thing/Thing";

class ThingList {
	/**
	 * The list of Things.
	 */
	public things: Array<Thing> = [];

	/**
	 * Adds a Thing to the list.
	 * @param thing - The Thing to add.
	 */
	public addThing(thing: Thing): void {
		this.things.push(thing);
	}

	/**
	 * Removes a Thing from the list.
	 * @param thing - The Thing to remove.
	 */
	public removeThing(thing: Thing): void {
		this.things = this.things.filter(t => t.id !== thing.id);
	}

	/**
	 * Returns a copy of the list.
	 * @returns A copy of the list.
	 */
	duplicate(): ThingList {
		const copy = new ThingList();
		copy.things = [...this.things];
		return copy;
	}

	/**
	 * Returns the length of the list.
	 * @returns The length of the list.
	 */
	length(): number {
		return this.things.length;
	}

}

export { ThingList };