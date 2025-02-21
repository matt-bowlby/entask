import { IdHandler } from "@classes/calendar/IdHandler";
import Thing from "@classes/thing/Thing";
import { ThingList } from "@classes/thing/ThingList";

class Calendar {
    /**
     * The name of the Calendar.
     */
    public name: string = "";

    /**
     * The list of Things that have not been completed yet.
     */
    private active: ThingList;

    /**
     * The list of Things that have been completed.
     */
    private completed: ThingList;

    /**
     * The unique identifier of the Calendar.
     */
    readonly id: number = 0;

    /**
     * Creates an instance of Calendar.
     * @param name - The name of the Calendar.
     */
    constructor(name: string) {
        this.id = IdHandler.requestId();
        this.name = name;

        this.active = new ThingList();
        this.completed = new ThingList();
    }

    /**
     * Adds a Thing to the Calendar.
     * @param thing - The Thing to add.
     */
    public addThing(thing: Thing): void {
        this.active.addThing(thing);
    }

    /**
     * Removes a Thing from the Calendar.
     * @param thing - The Thing to remove.
     */
    public removeThing(thing: Thing): void {
        this.active.removeThing(thing);
        this.completed.removeThing(thing);
    }

    /**
     * Sets a thing to "Complete."
     * @param thing - The Thing to complete.
     */
    public completeThing(thing: Thing): void {
        this.active.removeThing(thing);
        this.completed.addThing(thing);
        thing.completed = true;
    }

    /**
     * Sets a Thing to be "Active."
     * @param thing - The Thing to uncomplete.
     */
    public uncompleteThing(thing: Thing): void {
        this.completed.removeThing(thing);
        this.active.addThing(thing);
        thing.completed = false;
    }

    /**
     * Returns a duplicate of the list of active Things.
     * @returns A duplicate of the active Things.
     */
    public getActiveThings(): ThingList {
        return this.active.duplicate();
    }

    /**
     * Returns a duplicate of the list of completed Things.
     * @returns A duplicate of the completed Things.
     */
    public getCompletedThings(): ThingList {
        return this.completed.duplicate();
    }

}

export default Calendar;