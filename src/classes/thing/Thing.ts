import { IdHandler } from "@/classes/calendar/IdHandler";
import Calendar from "@classes/calendar/Calendar";

/**
 * Represents a Thing with a name, completion status, description, start time, duration, and a unique identifier.
 */
class Thing {
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
	 * The start time of the Thing in Unix time (seconds since January 1, 1970).
	 */
	public start_time: number = 0;

	/**
	 * The duration of the Thing in seconds.
	 */
	public duration: number = 0;

	/**
	 * The calendar associated with the Thing.
	 */
	public calendar: Calendar;

	/**
	 * The unique identifier of the Thing.
	 */
	readonly id: number = 0;

	/**
	 * Creates an instance of Thing.
	 * @param name - The name of the Thing.
	 */
	constructor(name: string, calendar: Calendar) {
		this.id = IdHandler.requestId();
		this.name = name;
		this.calendar = calendar;
	}

	/**
	 * Returns the end time of the Thing in Unix time.
	 * @returns The end time in Unix time.
	 */
	getEndTime(): number {
		return this.start_time + this.duration;
	}

	/**
	 * Schedules the Thing with a start time and calendar.
	 * @param start_time - The start time in Unix time.
	 * @param calendar - The calendar associated with the Thing.
	 */
	schedule(start_time: number, calendar: Calendar): void {
		this.start_time = start_time;
		this.calendar = calendar;
	}

	/**
	 * Converts a Date object to Unix time (seconds since January 1, 1970).
	 * @param date - The Date object to convert.
	 * @returns The Unix time corresponding to the given Date object.
	 */
	static dateToUnix(date: Date): number {
		return Math.floor(date.getTime() / 1000);
	}

	/**
	 * Converts Unix time to a Date object.
	 * @param unixTime - The Unix time to convert.
	 * @returns The Date object corresponding to the given Unix time.
	 */
	static unixToDate(unixTime: number): Date {
		return new Date(unixTime * 1000);
	}
}

class Event extends Thing { }

class Task extends Thing {
	/**
	 * The due date of the Task in Unix time (seconds since January 1, 1970).
	 */
	public due_date: number = 0;

	/**
	 * The actual duration of the Task in seconds.
	 */
	private actual_duration: number = 0;

	/**
	 * Sets the actual duration of the Task and marks it as completed.
	 * @param duration - The actual duration in seconds.
	 */
	setActualDuration(duration: number): void {
		this.actual_duration = duration;
		this.completed = true;
	}

	/**
	 * Returns the actual duration of the Task. If it hasn't been set, it returns 0.
	 * @returns The actual duration in seconds.
	 */
	getActualDuration(): number {
		return this.actual_duration;
	}

}


export default Thing;
export { Event, Task };