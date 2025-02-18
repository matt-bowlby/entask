import { IdHandler } from "@classes/calendar/IdHandler";
import Calendar from "@classes/calendar/Calendar";

/**
 * Represents a Thing with a name, completion status, description, start time, duration, and a unique identifier.
 */
abstract class Thing {
	/**
	 * The name of the Thing.
	 */
	public name: string = "";

	/**
	 * Indicates whether the Thing is completed.
	 */
	public completed: boolean = false;

	/**
	 * A description of the Thing.
	 */
	public description: string = "";

	/**
	 * The start time of the Thing in Unix time (milliseconds since January 1, 1970).
	 */
	public startTime: number = 0;

	/**
	 * The duration of the Thing in milliseconds.
	 */
	public duration: number = 0;

	/**
	 * The calendar associated with the Thing.
	 */
	private calendar: Calendar | undefined;

	/**
	 * The unique identifier of the Thing.
	 */
	readonly id: number = 0;

	/**
	 * Creates an instance of Thing.
	 * @param name - The name of the Thing.
	 */
	constructor(name: string,  duration: number = 0) {
		this.id = IdHandler.requestId();
		this.name = name;
		this.duration = duration;
	}

	/**
	 * Returns the end time of the Thing in Unix time (milliseconds).
	 * @returns The end time in Unix time (milliseconds).
	 */
	public getEndTime(): number {
		return this.startTime + this.duration;
	}

	/**
	 * Returns the calendar associated with the Thing. If unset, returns undefined.
	 * @returns The calendar associated with the Thing.
	 */
	public getCalendar(): Calendar | undefined {
		return this.calendar;
	}

	/**
	 * Sets the calendar associated with the Thing.
	 * @param calendar - The calendar to associate with the Thing.
	 */
	public setCalendar(calendar: Calendar | undefined): void {
		this.calendar = calendar;
	}

	/**
	 * Duplicates the Thing; the new instance will have the same properties as the original,
	 * save for the ID.
	 * @returns A new instance of the Thing with the same properties.
	 */
	public abstract duplicate(): Thing;

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
}

class Event extends Thing {
	public duplicate(): Event {
		const newEvent = new Event(this.name, this.duration);
		newEvent.completed = this.completed;
		newEvent.description = this.description;
		newEvent.startTime = this.startTime;
		if (this.getCalendar() !== undefined) {
			newEvent.setCalendar(this.getCalendar() as Calendar);
		}

		return newEvent;
	}
}

class Task extends Thing {
	/**
	 * The due date of the Task in Unix time (milliseconds since January 1, 1970).
	 */
	public dueDate: number = 0;

	/**
	 * The actual duration of the Task in milliseconds.
	 */
	private actualDuration: number = 0;

	constructor(name: string, duration: number, dueDate: number = 0) {
		super(name, duration);
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

	public duplicate(): Task {
		const newTask = new Task(this.name, this.duration, this.dueDate);
		newTask.completed = this.completed;
		newTask.description = this.description;
		newTask.startTime = this.startTime;
		newTask.actualDuration = this.actualDuration;
		if (this.getCalendar() !== undefined) {
			newTask.setCalendar(this.getCalendar() as Calendar);
		}
		return newTask;
	}

}


export default Thing;
export { Event, Task };