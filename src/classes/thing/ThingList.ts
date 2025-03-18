import Thing, { Task, Event } from "../thing/Thing";

class ThingList {
    /**
     * The list of Things.
     */
    public things: Array<Thing> = [];

    constructor(things: Array<Thing> = []) {
        this.things = things;
    }

    /**
     * Adds a Thing to the list.
     * @param thing - The Thing to add.
     */
    public addThing(...things: Array<Thing>): void {
        this.things.push(...things);
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
    public duplicate(): ThingList {
        const copy = new ThingList();
        copy.things = [...this.things];
        return copy;
    }

    /**
     * Returns the length of the list.
     * @returns The length of the list.
     */
    public length(): number {
        return this.things.length;
    }

    /**
     * Returns the list of Tasks.
     * @returns The list of Tasks.
     */
    public getTasks(): Array<Task> {
        return this.things.filter(thing => thing instanceof Task);
    }

    /**
     * Returns the list of Events.
     * @returns The list of Events.
     */
    public getEvents(): Array<Event> {
        return this.things.filter(thing => thing instanceof Event);
    }

}

export { ThingList };