import IdHandler from "./IdHandler";
import Tag from "../tag/Tag";
import TagBlock from "../tag/TagBlock";
import { ThingList } from "../thing/ThingList";
import Thing, { Task, Event } from "../thing/Thing";

class Calendar {

//#region Properties

    /**
     * The name of the Calendar.
     */
    protected name: string = "";

    /**
     * The list of Things that have not been completed yet.
     */
    protected active: ThingList;

    /**
     * The list of Things that have been completed.
     */
    protected completed: ThingList;

    /**
     * A List that contains exclusively tagBlocks.
     */
    protected tagBlocks: ThingList;

    /**
     * The list of tags associated with the Calendar.
     */
    protected tags: Array<Tag> = [];

    /**
     * The unique identifier of the Calendar.
     */
    readonly id: number;

//#endregion

//#region Constructor

    /**
     * Creates an instance of Calendar.
     * @param name - The name of the Calendar.
     */
    constructor(
        name: string,
        active_thing_list: ThingList = new ThingList,
        completed_thing_list: ThingList = new ThingList,
        tagBlocks: ThingList = new ThingList,
        tags: Array<Tag> = [],
        customId: number = -1
    ) {
        this.name = name;
        this.active = active_thing_list;
        this.completed = completed_thing_list;
        this.tagBlocks = tagBlocks;
        this.tags = tags;
        this.id = customId !== -1 ? customId : IdHandler.requestId(this);
        if (customId !== -1) IdHandler.registerId(this.id, this);
    }

//#endregion

//#region Public Methods

    /**
     * Adds a Thing to the Calendar.
     * @param thing - The Thing to add.
     */
    public addThing(...things: Array<Thing>): void {
        for (const thing of things) {
            if (thing instanceof TagBlock) this.tagBlocks.addThing(thing);
            else this.active.addThing(thing);
        }
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
        thing.setCompleted(true);
    }

    /**
     * Sets a Thing to be "Active."
     * @param thing - The Thing to uncomplete.
     */
    public uncompleteThing(thing: Thing): void {
        this.completed.removeThing(thing);
        this.active.addThing(thing);
        thing.setCompleted(false);
    }

    /**
     * Sorts a list of things by their priorities relative to a certain time.
     * @param relativeTo - The point in time to sort things relative to.
     * @param thingList - The list of things to sort.
     * @returns A sorted list of things.
     */
    public static sortByPriority(relativeTo: number, thingList: ThingList): ThingList {
        const newThingList: ThingList = new ThingList();
        const taskList: Array<Task> = thingList.getTasks();
        const eventList: Array<Event> = thingList.getEvents();

        // Sort tasks by priority.
        taskList.sort(
            (taskA: Task, taskB: Task): number => {
                const timeLeftA: number = taskA.getDueDate() - relativeTo;
                const timeLeftB: number = taskB.getDueDate() - relativeTo;

                // Sort by time left first
                if (timeLeftA < timeLeftB) return -1;
                if (timeLeftA > timeLeftB) return 1;
                // If time left is the same, sort by duration
                if (taskA.getDuration() > taskB.getDuration()) return -1;
                if (taskA.getDuration() < taskB.getDuration()) return 1;
                return 0;
            }
        );

        // Sort Events by start time.
        eventList.sort(
            (eventA: Event, eventB: Event): number => {
                const timeLeftA: number = eventA.getStartTime() - relativeTo;
                const timeLeftB: number = eventB.getStartTime() - relativeTo;

                // Handle overdue tasks first
                if (timeLeftA <= 0 || timeLeftB <= 0) {
                    // If time left is more negative on A, A is more overdue
                    if (timeLeftA < timeLeftB) return -1;
                    if (timeLeftA > timeLeftB) return 1;
                    return 0;
                }

                // Sort by start time
                if (timeLeftA < timeLeftB) return -1;
                if (timeLeftA > timeLeftB) return 1;
                return 0;
            }
        );

        // Combine sorted tasks and events
        let periodStart: number = relativeTo;
        while (taskList.length > 0 || eventList.length > 0) {
            const freeTime: number = eventList.length > 0 ? eventList[0].getStartTime() - periodStart : Infinity;
            if (taskList.length > 0 && freeTime - taskList[0].getDuration() >= 0) {
                // If the next task can be completed before the next event
                newThingList.addThing(taskList[0]);
                taskList.shift();
            } else if (eventList.length > 0) {
                periodStart = eventList[0].getEndTime();
                newThingList.addThing(eventList[0]);
                eventList.shift();
            }
        }

        return newThingList;
    }

    /**
     * Sorts a list of Things by their tags.
     * @param things - The list of Things to sort.
     * @param tags - The tags to sort by.
     * @returns A new ThingList containing only the Things that have all the specified tags.
     */
    public static sortForTags(things: ThingList, ...tags: Array<Tag>): ThingList {
        const newThingList: ThingList = new ThingList();
        newThingList.things = things.things.filter(thing => tags.every(tag => thing.getTags().includes(tag)))
        return newThingList;
    }

    /**
     * Returns a list of Things that need to be completed within a certain time period.
     * @param from - The start of the time period (in milliseconds).
     * @param to - The end of the time period (in milliseconds).tagBlock.
     * @returns A list of Things that should be done within the specified time period.
     */
    public getAllThingsBetween(
        from: number,
        to: number
    ): ThingList {
        const timeLength: number = to - from;
        const sortedActive = Calendar.sortByPriority(from, this.active);
        const things: ThingList = new ThingList();

        let totalTime: number = 0;
        let i: number = 0;
        while (totalTime <= timeLength && i < sortedActive.things.length) {
            if (totalTime + sortedActive.things[i].getDuration() > timeLength) break;
            things.things.push(sortedActive.things[i]);
            totalTime += sortedActive.things[i].getDuration();
            i++;
        }

        return things;
    }

    /**
     * Like getAllThingsBetween, but only returns Things that obey the current tagBlock(s).
     * @param from - The start of the time period (in milliseconds).
     * @param to - The end of the time period (in milliseconds).
     * @param now - The current time (in milliseconds).
     * @returns A list of Things that should be done within the specified time period, obeying the current tagBlock(s).
     */
    public getTagThingsBetween(from: number, to: number, now: number = Date.now()): ThingList {
        // Getting currently active tags
        const activeTagBlocks: ThingList = new ThingList(
            this.tagBlocks.things.filter(
                (tagBlock) =>
                    tagBlock.getEndTime() > now && tagBlock.getStartTime() < now
            )
        );
        const activeTags: Array<Tag> = activeTagBlocks.things.map(
            tagBlock =>
                tagBlock.getTags()
        ).flat();

        // Apply tag blocks
        return Calendar.sortForTags(this.getAllThingsBetween(from, to), ...activeTags);
    }

//#endregion

//#region Setters and Getters

    /**
     * Returns the name of the Calendar.
     * @returns The name of the Calendar.
     */
    public getName(): string {
        return this.name;
    }

    /**
     * Sets the name of the Calendar.
     * @param name - The new name of the Calendar.
     */

    public setName(name: string): void {
        this.name = name;
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

//#endregion

//#region Json

}

export default Calendar;