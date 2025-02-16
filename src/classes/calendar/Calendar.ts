import { IDHandler } from "@classes/calendar/IDHandler";
import { Event, Task } from "@classes/thing/Thing";
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
		this.id = IDHandler.requestId();
		this.name = name;

		this.active = new ThingList();
		this.completed = new ThingList();
	}

	addTask(task: Task): void {
		this.active.addThing(task);
	}

	addEvent(event: Event): void {
		this.active.addThing(event);
	}

	removeTask(task: Task): void {
		this.active.removeThing(task);
	}

	getActiveThings(): ThingList {
		return this.active.duplicate();
	}

	getCompletedThings(): ThingList {
		return this.completed.duplicate();
	}

}

export default Calendar;