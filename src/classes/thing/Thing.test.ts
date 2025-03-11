import { Event, Task } from "@classes/thing/Thing";

describe("Testing Event Class", () => {
    test("Event Creation", () => {
        const testEvent = new Event("Test Event", 0);
        expect(testEvent.name).toBe("Test Event");
        expect(testEvent.completed).toBe(false);
    });
    test("Event Scheduling", () => {
        const testEvent = new Event("Test Event", 20);
        testEvent.startTime = 10;
        expect(testEvent.startTime).toBe(10);
        expect(testEvent.getDuration()).toBe(20);
        expect(testEvent.getEndTime()).toBe(30);
    });

    test("Event Completion", () => {
        const testEvent = new Event("Test Event", 20);
        expect(testEvent.completed).toBe(false);
        testEvent.completed = true;
        expect(testEvent.completed).toBe(true);
    });

    test("Event Duplication", () => {
        const testEvent = new Event("Test Event", 20);
        testEvent.description = "Test Description";
        testEvent.startTime = 10;
        testEvent.completed = true;
        const testEvent2 = testEvent.duplicate();
        expect(testEvent2.name).toBe("Test Event");
        expect(testEvent2.description).toBe(testEvent.description);
        expect(testEvent2.completed).toBe(true);
        expect(testEvent2.startTime).toBe(10);
        expect(testEvent2.getDuration()).toBe(20);
        expect(testEvent2.id).not.toBe(testEvent.id);
        // IMPORTANT: We do not want duplicate event IDs
        expect(testEvent2.id).not.toBe(testEvent.id);
    });
});

describe("Testing Task Class", () => {
    test("Task Creation", () => {
        const dueDate = Date.now() + 3000
        const testTask = new Task("Test Task", 10, dueDate);
        expect(testTask.getTimeUntilDue()).toBeCloseTo(3000, 0);
        expect(testTask.name).toBe("Test Task");
        expect(testTask.completed).toBe(false);
        expect(testTask.startTime).toBe(0);
        expect(testTask.getDuration()).toBe(10);
        expect(testTask.dueDate).toBe(dueDate);
    });
    test("Task Scheduling", () => {
        const testTask = new Task("Test Task", 10, 30);
        testTask.startTime = 20;
        expect(testTask.startTime).toBe(20);
        expect(testTask.getDuration()).toBe(10);
        expect(testTask.getEndTime()).toBe(30);
    });
    test("Task Completion", () => {
        const testTask = new Task("Test Task", 10, 30);
        expect(testTask.completed).toBe(false);
        testTask.completed = true;
        expect(testTask.completed).toBe(true);
        testTask.setActualDuration(5);
        expect(testTask.getActualDuration()).toBe(5);
    });

    test("Task Duplication", () => {
        const testTask = new Task("Test Task", 10, 30);
        const testTask2 = testTask.duplicate();
        expect(testTask2.name).toBe("Test Task");
        expect(testTask2.completed).toBe(false);
        expect(testTask2.startTime).toBe(0);
        expect(testTask2.getDuration()).toBe(10);
        expect(testTask2.dueDate).toBe(30);
        expect(testTask2.id).not.toBe(testTask.id);
    });
});