import IdHandler from "./IdHandler";
import Tag from "../tag/Tag";
import TagBlock from "../tag/TagBlock";
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
    protected active: Array<Thing> = [];

    /**
     * The list of Things that have been completed.
     */
    protected completed: Array<Thing> = [];

    /**
     * A List that contains exclusively tagBlocks.
     */
    protected tagBlocks: Array<TagBlock> = [];

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
        active_thing_list: Array<Thing> = [],
        completed_thing_list: Array<Thing> = [],
        tagBlocks: Array<TagBlock> = [],
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
     * Adds a Tag to the Calendar.
     * @param tag - The Tag to add.
     */
    public addTag(...tags: Array<Tag>): void {
        for (const tag of tags) {
            if (!this.tags.includes(tag)) this.tags.push(tag);
        }
    }

    /**
     * Removes a Tag from the Calendar.
     * @param tag - The Tag to remove.
     */
    public removeTag(tag: Tag): void {
        this.tags = this.tags.filter((t) => t !== tag);
    }

    /**
     * Adds a Thing to the Calendar.
     * @param thing - The Thing to add.
     */
    public addThing(...things: Array<Thing>): void {
        for (const thing of things) {
            if (thing instanceof TagBlock) this.tagBlocks.push(thing);
            else this.active.push(thing);
        }
    }

    /**
     * Removes a Thing from the Calendar.
     * @param thing - The Thing to remove.
     */
    public removeThing(thing: Thing): void {
        this.active = this.active.filter(
            (activeThing) => activeThing !== thing
        );
        this.completed = this.completed.filter(
            (completedThing) => completedThing !== thing
        );
        if (thing instanceof TagBlock) {
            this.tagBlocks = this.tagBlocks.filter(t => t !== thing);
        }
    }

    /**
     * Sets a thing to "Complete."
     * @param thing - The Thing to complete.
     */
    public completeThing(thing: Thing): void {
        this.active = this.active.filter(
            (activeThing) => activeThing !== thing
        );
        this.completed.push(thing);
        thing.setCompleted(true);
    }

    /**
     * Sets a Thing to be "Active."
     * @param thing - The Thing to uncomplete.
     */
    public uncompleteThing(thing: Thing): void {
        this.completed = this.completed.filter(
            (completedThing) => completedThing !== thing
        );
        this.active.push(thing);
        thing.setCompleted(false);
    }

    /**
     * Sorts a list of things by their priorities relative to a certain time.
     * @param relativeTo - The point in time to sort things relative to.
     * @param things - The list of things to sort.
     * @returns A sorted list of things.
     */
    public static sortByPriority(
        relativeTo: number,
        things: Array<Thing>
    ): Array<Thing> {
        const sortedThings: Array<Thing> = [];
        const taskList: Array<Task> = things.filter(
            (thing) => thing instanceof Task
        );
        const eventList: Array<Event> = things.filter(
            (thing) => thing instanceof Event
        );

        // Sort tasks by priority.
        taskList.sort((taskA: Task, taskB: Task): number => {
            const timeLeftA: number = taskA.getDueDate() - relativeTo;
            const timeLeftB: number = taskB.getDueDate() - relativeTo;

            // Sort by time left first
            if (timeLeftA < timeLeftB) return -1;
            if (timeLeftA > timeLeftB) return 1;
            // If time left is the same, sort by duration
            if (taskA.getDuration() > taskB.getDuration()) return -1;
            if (taskA.getDuration() < taskB.getDuration()) return 1;
            return 0;
        });

        // Sort Events by start time.
        eventList.sort((eventA: Event, eventB: Event): number => {
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
        });

        // Combine sorted tasks and events
        let periodStart: number = relativeTo;
        while (taskList.length > 0 || eventList.length > 0) {
            const freeTime: number =
                eventList.length > 0
                    ? eventList[0].getStartTime() - periodStart
                    : Infinity;
            if (
                taskList.length > 0 &&
                freeTime - taskList[0].getDuration() >= 0
            ) {
                // If the next task can be completed before the next event
                sortedThings.push(taskList[0]);
                taskList.shift();
            } else if (eventList.length > 0) {
                periodStart = eventList[0].getEndTime();
                sortedThings.push(eventList[0]);
                eventList.shift();
            }
        }

        return sortedThings;
    }

    /**
     * Sorts a list of Things by their tags.
     * @param things - The list of Things to sort.
     * @param tags - The tags to sort by.
     * @returns A new list of Things containing only the Things that have all the specified tags.
     */
    public static sortForTags(
        things: Array<Thing>,
        ...tags: Array<Tag>
    ): Array<Thing> {
        if (tags.length === 0) return things;
        const sortedThings: Array<Thing> = things.filter((thing) =>
            tags.every((tag) => thing.getTags().includes(tag))
        );
        return sortedThings;
    }

    /**
     * Returns a list of Things that need to be completed within a certain time period.
     * @param from - The start of the time period (in milliseconds).
     * @param to - The end of the time period (in milliseconds).tagBlock.
     * @param now - The current time (in milliseconds).
     * @returns A list of Things that should be done within the specified time period.
     */
    public getAllThingsBetween(from: number, to: number, now: number): Array<Thing> {
        const timeLength: number = to - from;
        const sortedActive = Calendar.sortByPriority(now, this.active);
        const things: Array<Thing> = [];

        let totalTime: number = 0;
        for (let i = 0; i < sortedActive.length; i++) {
            // Handling Events
            if (sortedActive[i].getStartTime() !== 0) {
                if (sortedActive[i].getEndTime() < now) continue;
                things.push(sortedActive[i]);
                totalTime += sortedActive[i].getDuration();
            // Handling Tasks
            } else {
                if (totalTime + sortedActive[i].getDuration() > timeLength) break;
                things.push(sortedActive[i]);
                totalTime += sortedActive[i].getDuration();
            }
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
    public getTagThingsBetween(
        from: number,
        to: number,
        now: number = Date.now()
    ): Array<Thing> {
        // Getting currently active tags
        const activeTagBlocks: Array<TagBlock> = this.getActiveTagBlocks(now);
        const activeTags: Array<Tag> = activeTagBlocks
            .map((tagBlock) => tagBlock.getTags())
            .flat();

        // Apply tag blocks
        return Calendar.sortForTags(
            this.getAllThingsBetween(from, to, now),
            ...activeTags
        );
    }

    /**
     * Clones the current calendar and returns a new instance.
     * @returns A new instance of the Calendar class with the same properties as the object it was called on.
     */
    public clone(): Calendar {
        return new Calendar(
            this.name,
            [...this.active],
            [...this.completed],
            [...this.tagBlocks],
            [...this.tags],
            this.id
        );
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
     * Returns a reference to the list of active Things.
     * @returns A reference of the active Things.
     */
    public getActiveThings(): Array<Thing> {
        return this.active;
    }

    /**
     * Returns a reference to the list of completed Things.
     * @returns A reference of the completed Things.
     */
    public getCompletedThings(): Array<Thing> {
        return this.completed;
    }

    /**
     * Returns a reference to the list of Tags.
     * @returns A reference of the Tags.
     */
    public getTags(): Array<Tag> {
        return this.tags;
    }

    /**
     * Returns a reference to the list of TagBlocks.
     * @returns A reference of the TagBlocks.
     */
    public getTagBlocks(): Array<TagBlock> {
        return this.tagBlocks;
    }

    /**
     * Returns the currently active tag blocks.
     * @returns A reference to the currently active tag blocks.
     * @param now - The current time (in milliseconds).
     * @returns
     */
    public getActiveTagBlocks(now: number): Array<TagBlock> {
        return this.tagBlocks.filter(
            (tagBlock) =>
                tagBlock.getEndTime() > now && tagBlock.getStartTime() < now
        );
    }


    public toJson(): object {
        return {
            name: this.name,
            active: this.active.map((thing) => thing.toJson()),
            completed: this.completed.map((thing) => thing.toJson()),
            tagBlocks: this.tagBlocks.map((tagBlock) => tagBlock.toJson()),
            tags: this.tags.map((tag) => tag.toJson()),
            id: this.id,
        };
    }

    public static fromJson(json: any): Calendar {
        return new Calendar(
            json.name,
            json.active.map((thing: any) => Thing.fromJson(thing)),
            json.completed.map((thing: any) => Thing.fromJson(thing)),
            json.tagBlocks.map((tagBlock: any) => TagBlock.fromJson(tagBlock)),
            json.tags.map((tag: any) => Tag.fromJson(tag)),
            json.id
        );
    }

    public recursion(event_instance: Event, amount: number, days: Array<boolean>) { //days are ordered Sunday = 0, Monday = 1, ..., Saturday = 6
        let rec_event;
        let time = new Date(event_instance.getStartTime());
        let created = 0;

        while (created < amount) {
            time.setDate(time.getDate() + 1);
            const dayOfWeek = time.getDay();

            if (days[dayOfWeek]) {
                rec_event = event_instance.duplicate();
                rec_event.setStartTime(time.getTime());
                this.addThing(rec_event);
                created++;
            }
        }
    }

    //#endregion

    //#region Json
}

export default Calendar;
