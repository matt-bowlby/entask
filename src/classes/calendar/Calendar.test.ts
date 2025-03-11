import Calendar from './Calendar';
import { Task, Event } from '@classes/thing/Thing';

describe('Calendar', () => {
    let calendar: Calendar;
    const now: number = Date.now();

    test('Creating Calendar Instance', () => {
        calendar = new Calendar('Test Calendar');
        expect(calendar).toBeInstanceOf(Calendar);
        expect(calendar.name).toBe('Test Calendar');
    });

    beforeEach(() => {
        calendar = new Calendar('Test Calendar');
    });

    describe("Day Start and Length", () => {
        test("Default Values", () => {
            expect(calendar.getDayStart()).toBe(0);
            expect(calendar.getDayLength()).toBe(86400000); // 24 hours in milliseconds
        });

        // Minimum values
        test("Minimum Values", () => {
            calendar.setDayStart(0); // Reset to default
            calendar.setDayLength(0); // Reset to default
            expect(calendar.getDayStart()).toBe(0);
            expect(calendar.getDayLength()).toBe(0);
        });
        // Maximum values
        test("Maximum Values", () => {
            calendar.setDayStart(0);
            calendar.setDayLength(0);
            calendar.setDayStart(86400000); // 24 hours
            expect(calendar.getDayStart()).toBe(86400000);
            calendar.setDayStart(0); // Reset to default
            calendar.setDayLength(86400000); // 24 hours
            expect(calendar.getDayLength()).toBe(86400000);
            calendar.setDayLength(0); // Reset to default
        });

        // Negative values
        test("Negative Values", () => {
            calendar.setDayStart(0);
            calendar.setDayLength(0);
            calendar.setDayStart(-1000);
            expect(calendar.getDayStart()).toBe(0);
            calendar.setDayLength(-1000);
            expect(calendar.getDayLength()).toBe(0);
        });

        test("Exceeding Limits", () => {
            calendar.setDayStart(0);
            calendar.setDayLength(0);
            calendar.setDayStart(90000000); // 25 hours
            expect(calendar.getDayStart()).toBe(86400000);
            calendar.setDayStart(0); // Reset to default
            calendar.setDayLength(90000000); // 25 hours
            expect(calendar.getDayLength()).toBe(86400000);
            calendar.setDayLength(0);
        });

        test("Sum of Day Start and Length > 24 hours", () => {
            calendar.setDayStart(0);
            calendar.setDayLength(0);

            // Set day start to 8 hours
            calendar.setDayStart(8 * 60 * 60 * 1000); // 8 hours
            expect(calendar.getDayStart()).toBe(8 * 60 * 60 * 1000);

            // Attempt to set day length to 17 hours (8 + 17 > 24)
            calendar.setDayLength(17 * 60 * 60 * 1000); // 17 hours
            expect(calendar.getDayLength()).toBe(16 * 60 * 60 * 1000);

            // Reset both to 0
            calendar.setDayLength(0);
            calendar.setDayStart(0);

            // Set day length to 17 hours
            calendar.setDayLength(17 * 60 * 60 * 1000); // 17 hours
            expect(calendar.getDayLength()).toBe(17 * 60 * 60 * 1000);

            // Attempt to set day start to 8 hours (8 + 17 > 24)
            calendar.setDayStart(8 * 60 * 60 * 1000); // 8 hours
            expect(calendar.getDayStart()).toBe(7 * 60 * 60 * 1000);
        });
    });

    test("Adding and Removing Things", () => {
        expect(calendar.getActiveThings().things.length).toBe(0);

        const task = new Task("Task 1", 0);
        const event = new Event("Event 1");

        // Testing adding things
        calendar.addThing(task);
        calendar.addThing(event);
        expect(calendar.getActiveThings().things.length).toBe(2);
        expect(calendar.getActiveThings().things).toContain(task);
        expect(calendar.getActiveThings().things).toContain(event);

        // Testing removing things
        calendar.removeThing(task);
        expect(calendar.getActiveThings().things.length).toBe(1);
        expect(calendar.getActiveThings().things).not.toContain(task);
        expect(calendar.getActiveThings().things).toContain(event);
        calendar.removeThing(event);
        expect(calendar.getActiveThings().things.length).toBe(0);
        expect(calendar.getActiveThings().things).not.toContain(event);
        expect(calendar.getActiveThings().things).not.toContain(task);
    });

    test("Completing Things", () => {
        expect(calendar.getCompletedThings().things.length).toBe(0);
        expect(calendar.getActiveThings().things.length).toBe(0);

        const task = new Task("Task 1", 0);

        // Testing completing things
        calendar.addThing(task);
        expect(task.completed).toBe(false);
        expect(calendar.getActiveThings().things.length).toBe(1);
        expect(calendar.getActiveThings().things).toContain(task);
        expect(calendar.getCompletedThings().things.length).toBe(0);
        calendar.completeThing(task);
        expect(task.completed).toBe(true);
        expect(calendar.getActiveThings().things.length).toBe(0);
        expect(calendar.getCompletedThings().things.length).toBe(1);
        expect(calendar.getCompletedThings().things).toContain(task);

        // Testing uncompleting things
        calendar.uncompleteThing(task);
        expect(task.completed).toBe(false);
        expect(calendar.getCompletedThings().things.length).toBe(0);
        expect(calendar.getActiveThings().things.length).toBe(1);
        expect(calendar.getActiveThings().things).toContain(task);

        // Testing removing completed things
        calendar.completeThing(task);
        expect(calendar.getCompletedThings().things.length).toBe(1);
        expect(calendar.getCompletedThings().things).toContain(task);
        calendar.removeThing(task);
        expect(calendar.getCompletedThings().things.length).toBe(0);
        expect(calendar.getActiveThings().things.length).toBe(0);
    });

    describe("Testing Task Prioritization", () => {
        let task1: Task;
        let task2: Task;

        // Reset the calendar before each test
        beforeEach(() => {
            calendar = new Calendar('Test Calendar');
            task1 = new Task("Task 1", 0);
            task2 = new Task("Task 2", 0);
            calendar.addThing(task1);
            calendar.addThing(task2);
            expect(calendar.getActiveThings().things.length).toBe(2);
        });

        test("Same Due Date, Different Duration", () => {
            task1.dueDate = now + 3000;
            task1.setDuration(2000);
            task2.dueDate = now + 3000;
            task2.setDuration(1000);

            const prioritizedTasks = Calendar.sortByPriority(now, calendar.getActiveThings());
            expect(prioritizedTasks.things.length).toBe(2);
            expect(prioritizedTasks.things[0]).toBe(task1);
            expect(prioritizedTasks.things[1]).toBe(task2);
        });

        test ("Different Due Dates, Same Duration", () => {
            task1.dueDate = now + 3000;
            task1.setDuration(2000);
            task2.dueDate = now + 5000;
            task2.setDuration(2000);

            const prioritizedTasks = Calendar.sortByPriority(now, calendar.getActiveThings());
            expect(prioritizedTasks.things.length).toBe(2);
            expect(prioritizedTasks.things[0]).toBe(task1);
            expect(prioritizedTasks.things[1]).toBe(task2);
        });

        test("Different Due Dates, Different Duration", () => {
            task1.dueDate = now + 3000;
            task1.setDuration(2000);
            task2.dueDate = now + 5000;
            task2.setDuration(2500);

            const prioritizedTasks = Calendar.sortByPriority(now, calendar.getActiveThings());
            expect(prioritizedTasks.things.length).toBe(2);
            expect(prioritizedTasks.things[0]).toBe(task1);
            expect(prioritizedTasks.things[1]).toBe(task2);
        });

        describe("Overdue Tasks", () => {
            // Reset the calendar before each test
            beforeEach(() => {
                calendar = new Calendar('Test Calendar');
                task1 = new Task("Task 1", 0);
                task2 = new Task("Task 2", 0);
                calendar.addThing(task1);
                calendar.addThing(task2);
            });

            test("Same Due Date, Different Duration", () => {
                task1.dueDate = now - 2000;
                task1.setDuration(2000);
                task2.dueDate = now - 2000;
                task2.setDuration(1000);
                const prioritizedTasks = Calendar.sortByPriority(now, calendar.getActiveThings());
                expect(prioritizedTasks.things[0]).toBe(task1);
                expect(prioritizedTasks.things[1]).toBe(task2);
            });

            test("Different Due Dates, Same Duration", () => {
                task1.dueDate = now - 2000;
                task1.setDuration(2000);
                task2.dueDate = now - 4000;
                task2.setDuration(2000);
                const prioritizedTasks = Calendar.sortByPriority(now, calendar.getActiveThings());
                expect(prioritizedTasks.things[0]).toBe(task2);
                expect(prioritizedTasks.things[1]).toBe(task1);
            });

            test("Different Due Dates, Different Duration", () => {
                task1.dueDate = now - 2000;
                task1.setDuration(2000);
                task2.dueDate = now - 4000;
                task2.setDuration(2500);
                const prioritizedTasks = Calendar.sortByPriority(now, calendar.getActiveThings());
                expect(prioritizedTasks.things[0]).toBe(task2);
                expect(prioritizedTasks.things[1]).toBe(task1);
            });
        });
    });

    describe("Testing Event Prioritization", () => {
        let event1: Event;
        let event2: Event;
        const now: number = Date.now();

        beforeEach(() => {
            calendar = new Calendar('Test Calendar');
            event1 = new Event("Event 1", 1000);
            event2 = new Event("Event 2", 1000);
            calendar.addThing(event1);
            calendar.addThing(event2);
            expect(calendar.getActiveThings().things.length).toBe(2);
        });

        test("Same Start Time", () => {
            event1.startTime = now + 3000;
            event2.startTime = now + 3000;

            const prioritizedEvents = Calendar.sortByPriority(now, calendar.getActiveThings());
            expect(prioritizedEvents.things.length).toBe(2);
            // Events with same start time should maintain original order
            expect(prioritizedEvents.things[0]).toBe(event1);
            expect(prioritizedEvents.things[1]).toBe(event2);
        });

        test("Different Start Times", () => {
            event1.startTime = now + 5000;
            event2.startTime = now + 3000;

            const prioritizedEvents = Calendar.sortByPriority(now, calendar.getActiveThings());
            expect(prioritizedEvents.things.length).toBe(2);
            // Earlier start time should come first
            expect(prioritizedEvents.things[0]).toBe(event2);
            expect(prioritizedEvents.things[1]).toBe(event1);
        });

        describe("Overdue Events", () => {
            beforeEach(() => {
                calendar = new Calendar('Test Calendar');
                event1 = new Event("Event 1", 1000);
                event2 = new Event("Event 2", 1000);
                calendar.addThing(event1);
                calendar.addThing(event2);
            });

            test("Both Events Overdue", () => {
                event1.startTime = now - 2000;
                event2.startTime = now - 4000;

                const prioritizedEvents = Calendar.sortByPriority(now, calendar.getActiveThings());
                // More overdue event should come first
                expect(prioritizedEvents.things[0]).toBe(event2);
                expect(prioritizedEvents.things[1]).toBe(event1);
            });

            test("One Event Overdue", () => {
                event1.startTime = now + 2000;
                event2.startTime = now - 2000;

                const prioritizedEvents = Calendar.sortByPriority(now, calendar.getActiveThings());
                // Overdue event should come first
                expect(prioritizedEvents.things[0]).toBe(event2);
                expect(prioritizedEvents.things[1]).toBe(event1);
            });
        });
    });

    describe("Edge Cases", () => {
        test("Zero Duration Task", () => {
            const task = new Task("Zero Task", 0);
            calendar.addThing(task);
            const prioritized = Calendar.sortByPriority(now, calendar.getActiveThings());
            expect(prioritized.things).toContain(task);
        });

        test("Negative Duration Task", () => {
            const task = new Task("Negative Task", -1000);
            expect(task.getDuration()).toBe(0);
        });

        test("Overlapping Events", () => {
            const event1 = new Event("Event 1", 2000);
            const event2 = new Event("Event 2", 2000);
            event1.startTime = now;
            event2.startTime = now + 1000; // Starts before event1 ends
            calendar.addThing(event1);
            calendar.addThing(event2);
            const prioritized = Calendar.sortByPriority(now, calendar.getActiveThings());
            expect(prioritized.things[0]).toBe(event1);
            expect(prioritized.things[1]).toBe(event2);
        });
    });

    describe("Mixed Thing Sorting", () => {
        let task1: Task;
        let task2: Task;
        let event1: Event;
        let event2: Event;

        beforeEach(() => {
            calendar = new Calendar('Test Calendar');
            task1 = new Task("Task 1", 1000);
            task2 = new Task("Task 2", 2000);
            event1 = new Event("Event 1", 2000);
            event2 = new Event("Event 2", 1000);
        });

        test("Task Due During Event", () => {
            event1.startTime = now + 3000;
            task1.dueDate = now + 4000;
            calendar.addThing(task1);
            calendar.addThing(event1);

            const prioritized = Calendar.sortByPriority(now, calendar.getActiveThings());
            expect(prioritized.things[0]).toBe(task1);
            expect(prioritized.things[1]).toBe(event1);
        });

        test("Multiple Tasks Between Events", () => {
            event1.startTime = now;
            event2.startTime = now + 5000;
            task1.dueDate = now + 3000;
            task2.dueDate = now + 4000;

            calendar.addThing(event1);
            calendar.addThing(event2);
            calendar.addThing(task1);
            calendar.addThing(task2);

            const prioritized = Calendar.sortByPriority(now, calendar.getActiveThings());
            expect(prioritized.things[0]).toBe(event1);
            expect(prioritized.things[1]).toBe(task1);
            expect(prioritized.things[2]).toBe(task2);
            expect(prioritized.things[3]).toBe(event2);
        });

        test("Tasks That Don't Fit Between Events", () => {
            event1.startTime = now;
            event2.startTime = now + 1500; // Only 1500ms gap between events
            task1.setDuration(2000); // Too long to fit between events
            task1.dueDate = now + 3000;

            calendar.addThing(event1);
            calendar.addThing(event2);
            calendar.addThing(task1);

            const prioritized = Calendar.sortByPriority(now, calendar.getActiveThings());
            expect(prioritized.things[0]).toBe(event1);
            expect(prioritized.things[1]).toBe(event2);
            expect(prioritized.things[2]).toBe(task1);
        });

        test("Overdue Tasks and Future Events", () => {
            event1.startTime = now + 3000;
            task1.dueDate = now - 1000; // Overdue
            task2.dueDate = now - 2000; // More overdue

            calendar.addThing(event1);
            calendar.addThing(task1);
            calendar.addThing(task2);

            const prioritized = Calendar.sortByPriority(now, calendar.getActiveThings());
            expect(prioritized.things[0]).toBe(task2);
            expect(prioritized.things[1]).toBe(task1);
            expect(prioritized.things[2]).toBe(event1);
        });

        test("Overdue Events and Future Tasks", () => {
            event1.startTime = now - 1000; // Overdue
            event2.startTime = now - 2000; // More overdue
            task1.dueDate = now + 3000;

            calendar.addThing(event1);
            calendar.addThing(event2);
            calendar.addThing(task1);

            const prioritized = Calendar.sortByPriority(now, calendar.getActiveThings());
            expect(prioritized.things[0]).toBe(event2);
            expect(prioritized.things[1]).toBe(event1);
            expect(prioritized.things[2]).toBe(task1);
        });

        test("Complex Mixed Scenario", () => {
            event1.startTime = now + 1000;
            event2.startTime = now + 5000;
            task1.dueDate = now + 3000;
            task1.setDuration(1000);
            task2.dueDate = now + 4000;
            task2.setDuration(1500);

            calendar.addThing(event1);
            calendar.addThing(event2);
            calendar.addThing(task1);
            calendar.addThing(task2);

            const prioritized = Calendar.sortByPriority(now, calendar.getActiveThings());
            expect(prioritized.things[0]).toBe(task1);
            expect(prioritized.things[1]).toBe(event1);
            expect(prioritized.things[2]).toBe(task2);
            expect(prioritized.things[3]).toBe(event2);
        });
    });
});