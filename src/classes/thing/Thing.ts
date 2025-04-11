import IdHandler from "../calendar/IdHandler";
import Tag from "../tag/Tag";

/**
 * Represents a Thing with a name, completion status, description, start time, duration, and a unique identifier.
 */
abstract class Thing {

//#region Properties

    /**
     * The name of the Thing.
     */
    protected name: string = "";

    /**
     * The duration of the Thing in milliseconds.
     */
    protected duration: number = 0;

    /**
     * The start time of the Thing in Unix time (milliseconds since January 1, 1970).
     */
    protected startTime: number = 0;

    /**
     * A description of the Thing.
     */
    protected description: string = "";

    /**
     * The tags associated with the Thing.
     */
    protected tags: Array<Tag> = [];

    /**
     * Indicates whether the Thing is completed.
     */
    protected completed: boolean = false;

    /**
     * The unique identifier of the Thing.
     */
    readonly id: number;

//#endregion

//#region Constructor

    /**
     * Creates an instance of Thing.
     * @param name - The name of the Thing.
     */
    constructor(
        name: string,
        duration: number = 0,
        startTime: number = 0,
        description: string = "",
        tags: Array<Tag> = [],
        completed: boolean = false,
        customId: number = -1
    ) {
        this.setName(name);
        this.setDuration(duration);
        this.setStartTime(startTime);
        this.setDescription(description);
        this.setTags(tags);
        this.setCompleted(completed);
        this.id = customId !== -1 ? customId : IdHandler.requestId(this);
        // Register the ID if necessary
        if (customId !== -1) IdHandler.registerId(this.id, this);
    }

//#endregion

//#region Abstract Methods

    /**
     * Duplicates the Thing; the new instance will have the same properties as the original,
     * save for the ID.
     * @returns A new instance of the Thing with the same properties.
     */
    public abstract duplicate(): Thing;

//#endregion

//#region Public Methods

    /**
     * Returns the end time of the Thing in Unix time (milliseconds).
     * @returns The end time in Unix time (milliseconds).
     */
    public getEndTime(): number {
        return this.startTime + this.getDuration();
    }

        /**
     * Adds a tag to the Thing.
     * @param tag - The tag to be added.
     */
    public addTag(tag: Tag): void {
        this.tags.push(tag);
    }

    /**
     * Removes a tag from the Thing.
     * @param tag - The tag to be removed.
     */
    public removeTag(tag: Tag): void {
        this.tags = this.tags.filter((t) => t !== tag);
    }

//#endregion

//#region Static Methods

    /**
     * Converts a Date object to Unix time (milliseconds since January 1, 1970).
     * @param date - The Date object to convert.
     * @returns The Unix time corresponding to the given Date object.
     */
    public static dateToUnix(date: Date): number {
        return date.getTime();
    }

    /**
     * Converts Unix time to a Date object.
     * @param unixTime - The Unix time to convert, in milliseconds.
     * @returns The Date object corresponding to the given Unix time.
     */
    public static unixToDate(unixTime: number): Date {
        return new Date(unixTime);
    }

//#endregion

//#region Getters and Setters

    /**
     * Returns the name of the Thing.
     * @returns The name of the Thing.
     */
    public getName(): string {
        return this.name;
    }

    /**
     * Sets the name of the Thing.
     * @param name - The name to set.
     */
    public setName(name: string): void {
        this.name = name;
    }

    /**
     * Returns the completion status of the Thing.
     * @returns True if completed, false otherwise.
     */
    public isCompleted(): boolean {
        return this.completed;
    }

    /**
     * Sets the completion status of the Thing.
     * @param completed - The completion status to set.
     */
    public setCompleted(completed: boolean): void {
        this.completed = completed;
    }

    /**
     * Returns the description of the Thing.
     * @returns The description of the Thing.
     */
    public getDescription(): string {
        return this.description;
    }

    /**
     * Sets the description of the Thing.
     * @param description - The description to set.
     */
    public setDescription(description: string): void {
        this.description = description;
    }

    /**
     * Returns the start time of the Thing in Unix time (milliseconds).
     * @returns The start time in Unix time (milliseconds).
     */
    public getStartTime(): number {
        return this.startTime;
    }

    /**
     * Sets the start time of the Thing.
     * @param startTime - The start time in Unix time (milliseconds).
     */
    public setStartTime(startTime: number): void {
        this.startTime = startTime;
    }

    /**
     * Returns the duration of the Thing in Unix time (milliseconds).
     * @returns The duration in Unix time (milliseconds).
     */
    public getDuration(): number {
        return this.duration;
    }

    /**
     * Sets the duration of the Thing.
     * @param duration - The duration in milliseconds.
     */
    public setDuration(duration: number): void {
        if (duration < 0) this.duration = 0; // Set to 0 if negative
        else this.duration = duration;
    }

    /**
     * Returns the tags associated with the Thing.
     * @returns An array of tags.
     */
    public getTags(): Array<Tag> {
        return this.tags;
    }

    /**
     * Sets the tags associated with the Thing.
     * @param tags - An array of tags to set.
     */
    public setTags(tags: Array<Tag>): void {
        this.tags = tags;
    }

    public abstract toJson(): object;

    public static fromJson(json: any): Thing {
        if (json.type === "Event") {
            return new Event(
                json.name,
                json.duration,
                json.startTime,
                json.description,
                json.tags.map((tag: string) => new Tag(tag)),
                json.completed,
                json.id
            );
        } else if (json.type === "Task") {
            return new Task(
                json.name,
                json.duration,
                json.dueDate,
                json.startTime,
                json.description,
                json.tags.map((tag: string) => new Tag(tag)),
                json.completed,
                json.id
            );
        } else {
            throw new Error("Unknown type: " + json.type);
        }
    }


//#endregion

}

class Event extends Thing {

    public duplicate(): Event {
        return new Event(
            this.name,
            this.duration,
            this.startTime,
            this.description,
            [...this.getTags()],
            this.completed
        );
    }

    public toJson(): object {
        return {
            type: "Event",
            name: this.name,
            duration: this.duration,
            startTime: this.startTime,
            description: this.description,
            tags: this.tags.map(tag => tag.getName()),
            completed: this.completed,
            id: this.id
        };
    }
}

class Task extends Thing {
    /**
     * The due date of the Task in Unix time (milliseconds since January 1, 1970).
     */
    protected dueDate: number = 0;

    /**
     * The actual duration of the Task in milliseconds.
     */
    protected actualDuration: number = 0;

    constructor(
        name: string,
        duration: number = 0,
        dueDate: number = 0,
        startTime: number = 0,
        description: string = "",
        tags: Array<Tag> = [],
        completed: boolean = false,
        customId: number = -1
    ) {
        super(name, duration, startTime, description, tags, completed, customId);
        this.dueDate = dueDate; // Set due date to start time + duration
    }

    public duplicate(): Task {
        return new Task(
            this.name,
            this.duration,
            this.dueDate,
            this.startTime,
            this.description,
            [...this.getTags()],
            this.completed
        );
    }

    /**
     * Returns the due date of the Task in Unix time (milliseconds).
     * @returns The due date in Unix time (milliseconds).
     */
    public getDueDate(): number {
        return this.dueDate;
    }

    /**
     * Sets the due date of the Task.
     * @param dueDate - The due date in Unix time (milliseconds).
     */

    public setDueDate(dueDate: number): void {
        this.dueDate = dueDate;
    }

    /**
     * Sets the actual duration of the Task and marks it as completed.
     * @param duration - The actual duration in milliseconds.
     */
    public setActualDuration(duration: number): void {
        this.actualDuration = duration;
        this.completed = true;
    }

    /**
     * Returns the actual duration of the Task. If it hasn't been set, it returns 0.
     * @returns The actual duration in milliseconds.
     */
    public getActualDuration(): number {
        return this.actualDuration;
    }

    /**
     * Returns the time remaining until the Task is due.
     * @returns The time remaining in milliseconds.
     */
    public getTimeUntilDue(): number {
        return this.dueDate - Date.now();
    }

    public toJson(): object {
        return {
            type: "Task",
            name: this.name,
            duration: this.duration,
            dueDate: this.dueDate,
            startTime: this.startTime,
            description: this.description,
            tags: this.tags.map(tag => tag.getName()),
            completed: this.completed,
            id: this.id
        };
    }

}


export default Thing;
export { Event, Task };