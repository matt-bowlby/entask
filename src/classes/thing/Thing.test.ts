import { Event, Task } from "@classes/thing/Thing";

describe("Testing Event Class", () => {
    test("Event Creation", () => {
        const testEvent = new Event("Test Event", 0);
        expect(testEvent.getName()).toBe("Test Event");
        expect(testEvent.isCompleted()).toBe(false);
    });
    test("Event Scheduling", () => {
        const testEvent = new Event("Test Event", 20);
        testEvent.setStartTime(10);
        expect(testEvent.getStartTime()).toBe(10);
        expect(testEvent.getDuration()).toBe(20);
        expect(testEvent.getEndTime()).toBe(30);
    });

    test("Event Completion", () => {
        const testEvent = new Event("Test Event", 20);
        expect(testEvent.isCompleted()).toBe(false);
        testEvent.setCompleted(true);
        expect(testEvent.isCompleted()).toBe(true);
    });

    test("Event Duplication", () => {
        const testEvent = new Event("Test Event", 20);
        testEvent.setDescription("Test Description");
        testEvent.setStartTime(10);
        testEvent.setCompleted(true);
        const testEvent2 = testEvent.duplicate();
        expect(testEvent2.getName()).toBe("Test Event");
        expect(testEvent2.getDescription()).toBe(testEvent.getDescription());
        expect(testEvent2.isCompleted()).toBe(true);
        expect(testEvent2.getStartTime()).toBe(10);
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
        expect(testTask.getName()).toBe("Test Task");
        expect(testTask.isCompleted()).toBe(false);
        expect(testTask.getStartTime()).toBe(0);
        expect(testTask.getDuration()).toBe(10);
        expect(testTask.getDueDate()).toBe(dueDate);
    });
    test("Task Scheduling", () => {
        const testTask = new Task("Test Task", 10, 30);
        testTask.setStartTime(20);
        expect(testTask.getStartTime()).toBe(20);
        expect(testTask.getDuration()).toBe(10);
        expect(testTask.getEndTime()).toBe(30);
    });
    test("Task Completion", () => {
        const testTask = new Task("Test Task", 10, 30);
        expect(testTask.isCompleted()).toBe(false);
        testTask.setCompleted(true);
        expect(testTask.isCompleted()).toBe(true);
        testTask.setActualDuration(5);
        expect(testTask.getActualDuration()).toBe(5);
    });

    test("Task Duplication", () => {
        const testTask = new Task("Test Task", 10, 30);
        const testTask2 = testTask.duplicate();
        expect(testTask2.getName()).toBe("Test Task");
        expect(testTask2.isCompleted()).toBe(false);
        expect(testTask2.getStartTime()).toBe(0);
        expect(testTask2.getDuration()).toBe(10);
        expect(testTask2.getDueDate()).toBe(30);
        expect(testTask2.id).not.toBe(testTask.id);
    });
});