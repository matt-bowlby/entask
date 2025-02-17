import { Event } from "@classes/thing/Thing";
import Calendar from "@classes/calendar/Calendar";

describe("Testing Event Class", () => {
	test("Test Event Creation", () => {
		const testEvent = new Event("Test Event", 0);
		expect(testEvent.name).toBe("Test Event");
		expect(testEvent.completed).toBe(false);
		console.log("ID: ", testEvent.id);
	});
	test("Test Event Scheduling", () => {
		const testEvent = new Event("Test Event", 20);
		testEvent.startTime = 10;
		expect(testEvent.startTime).toBe(10);
		expect(testEvent.duration).toBe(20);
		expect(testEvent.getEndTime()).toBe(30);
	});

	test("Test Event Completion", () => {
		const testEvent = new Event("Test Event", 20);
		expect(testEvent.completed).toBe(false);
		testEvent.completed = true;
		expect(testEvent.completed).toBe(true);
	});

	test("Test Event Duplication", () => {
		const testEvent = new Event("Test Event", 20);
		testEvent.calendar = new Calendar("Test Calendar");
		testEvent.description = "Test Description";
		testEvent.startTime = 10;
		testEvent.completed = true;
		const testEvent2 = testEvent.duplicate();
		expect(testEvent2.name).toBe("Test Event");
		expect(testEvent2.description).toBe(testEvent.description);
		expect(testEvent2.completed).toBe(true);
		expect(testEvent2.startTime).toBe(10);
		expect(testEvent2.duration).toBe(20);
		expect(testEvent2.id).not.toBe(testEvent.id);
		expect(testEvent2.calendar).toBe(testEvent.calendar);
	});
});
