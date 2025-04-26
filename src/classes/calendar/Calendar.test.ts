import Calendar from './Calendar';
import { Task, Event } from '@classes/thing/Thing';

describe('Calendar', () => {
    let calendar: Calendar;
    const now: number = Date.now();

    test('Creating Calendar Instance', () => {
        calendar = new Calendar('Test Calendar');
        expect(calendar).toBeInstanceOf(Calendar);
        expect(calendar.getName()).toBe('Test Calendar');
    });

    beforeEach(() => {
        calendar = new Calendar('Test Calendar');
    });

    test("Adding and Removing Things", () => {
        expect(calendar.getActiveThings().length).toBe(0);

        const task = new Task("Task 1", 0);
        const event = new Event("Event 1");

        // Testing adding things
        calendar.addThing(task);
        calendar.addThing(event);
        expect(calendar.getActiveThings().length).toBe(2);
        expect(calendar.getActiveThings()).toContain(task);
        expect(calendar.getActiveThings()).toContain(event);

        // Testing removing things
        calendar.removeThing(task);
        expect(calendar.getActiveThings().length).toBe(1);
        expect(calendar.getActiveThings()).not.toContain(task);
        expect(calendar.getActiveThings()).toContain(event);
        calendar.removeThing(event);
        expect(calendar.getActiveThings().length).toBe(0);
        expect(calendar.getActiveThings()).not.toContain(event);
        expect(calendar.getActiveThings()).not.toContain(task);
    });

    test("Completing Things", () => {
        expect(calendar.getCompletedThings().length).toBe(0);
        expect(calendar.getActiveThings().length).toBe(0);

        const task = new Task("Task 1", 0);

        // Testing completing things
        calendar.addThing(task);
        expect(task.isCompleted()).toBe(false);
        expect(calendar.getActiveThings().length).toBe(1);
        expect(calendar.getActiveThings()).toContain(task);
        expect(calendar.getCompletedThings().length).toBe(0);
        calendar.completeThing(task);
        expect(task.isCompleted()).toBe(true);
        expect(calendar.getActiveThings().length).toBe(0);
        expect(calendar.getCompletedThings().length).toBe(1);
        expect(calendar.getCompletedThings()).toContain(task);

        // Testing uncompleting things
        calendar.uncompleteThing(task);
        expect(task.isCompleted()).toBe(false);
        expect(calendar.getCompletedThings().length).toBe(0);
        expect(calendar.getActiveThings().length).toBe(1);
        expect(calendar.getActiveThings()).toContain(task);

        // Testing removing completed things
        calendar.completeThing(task);
        expect(calendar.getCompletedThings().length).toBe(1);
        expect(calendar.getCompletedThings()).toContain(task);
        calendar.removeThing(task);
        expect(calendar.getCompletedThings().length).toBe(0);
        expect(calendar.getActiveThings().length).toBe(0);
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
            expect(calendar.getActiveThings().length).toBe(2);
        });

        test("Same Due Date, Different Duration", () => {
            task1.setDueDate(now + 3000);
            task1.setDuration(2000);
            task2.setDueDate(now + 3000);
            task2.setDuration(1000);

            const prioritizedTasks = Calendar.sortByPriority(now, calendar.getActiveThings());
            expect(prioritizedTasks.length).toBe(2);
            expect(prioritizedTasks[0]).toBe(task1);
            expect(prioritizedTasks[1]).toBe(task2);
        });

        test ("Different Due Dates, Same Duration", () => {
            task1.setDueDate(now + 3000);
            task1.setDuration(2000);
            task2.setDueDate(now + 5000);
            task2.setDuration(2000);

            const prioritizedTasks = Calendar.sortByPriority(now, calendar.getActiveThings());
            expect(prioritizedTasks.length).toBe(2);
            expect(prioritizedTasks[0]).toBe(task1);
            expect(prioritizedTasks[1]).toBe(task2);
        });

        test("Different Due Dates, Different Duration", () => {
            task1.setDueDate(now + 3000);
            task1.setDuration(2000);
            task2.setDueDate(now + 5000);
            task2.setDuration(2500);

            const prioritizedTasks = Calendar.sortByPriority(now, calendar.getActiveThings());
            expect(prioritizedTasks.length).toBe(2);
            expect(prioritizedTasks[0]).toBe(task1);
            expect(prioritizedTasks[1]).toBe(task2);
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
                task1.setDueDate(now - 2000);
                task1.setDuration(2000);
                task2.setDueDate(now - 2000);
                task2.setDuration(1000);
                const prioritizedTasks = Calendar.sortByPriority(now, calendar.getActiveThings());
                expect(prioritizedTasks[0]).toBe(task1);
                expect(prioritizedTasks[1]).toBe(task2);
            });

            test("Different Due Dates, Same Duration", () => {
                task1.setDueDate(now - 2000);
                task1.setDuration(2000);
                task2.setDueDate(now - 4000);
                task2.setDuration(2000);
                const prioritizedTasks = Calendar.sortByPriority(now, calendar.getActiveThings());
                expect(prioritizedTasks[0]).toBe(task2);
                expect(prioritizedTasks[1]).toBe(task1);
            });

            test("Different Due Dates, Different Duration", () => {
                task1.setDueDate(now - 2000);
                task1.setDuration(2000);
                task2.setDueDate(now - 4000);
                task2.setDuration(2500);
                const prioritizedTasks = Calendar.sortByPriority(now, calendar.getActiveThings());
                expect(prioritizedTasks[0]).toBe(task2);
                expect(prioritizedTasks[1]).toBe(task1);
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
            expect(calendar.getActiveThings().length).toBe(2);
        });

        test("Same Start Time", () => {
            event1.setStartTime(now + 3000);
            event2.setStartTime(now + 3000);

            const prioritizedEvents = Calendar.sortByPriority(now, calendar.getActiveThings());
            expect(prioritizedEvents.length).toBe(2);
            // Events with same start time should maintain original order
            expect(prioritizedEvents[0]).toBe(event1);
            expect(prioritizedEvents[1]).toBe(event2);
        });

        test("Different Start Times", () => {
            event1.setStartTime(now + 5000);
            event2.setStartTime(now + 3000);

            const prioritizedEvents = Calendar.sortByPriority(now, calendar.getActiveThings());
            expect(prioritizedEvents.length).toBe(2);
            // Earlier start time should come first
            expect(prioritizedEvents[0]).toBe(event2);
            expect(prioritizedEvents[1]).toBe(event1);
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
                event1.setStartTime(now - 2000);
                event2.setStartTime(now - 4000);

                const prioritizedEvents = Calendar.sortByPriority(now, calendar.getActiveThings());
                // More overdue event should come first
                expect(prioritizedEvents[0]).toBe(event2);
                expect(prioritizedEvents[1]).toBe(event1);
            });

            test("One Event Overdue", () => {
                event1.setStartTime(now + 2000);
                event2.setStartTime(now - 2000);

                const prioritizedEvents = Calendar.sortByPriority(now, calendar.getActiveThings());
                // Overdue event should come first
                expect(prioritizedEvents[0]).toBe(event2);
                expect(prioritizedEvents[1]).toBe(event1);
            });
        });
    });

    describe("Edge Cases", () => {
        test("Zero Duration Task", () => {
            const task = new Task("Zero Task", 0);
            calendar.addThing(task);
            const prioritized = Calendar.sortByPriority(now, calendar.getActiveThings());
            expect(prioritized).toContain(task);
        });

        test("Negative Duration Task", () => {
            const task = new Task("Negative Task", -1000);
            expect(task.getDuration()).toBe(0);
        });

        test("Overlapping Events", () => {
            const event1 = new Event("Event 1", 2000);
            const event2 = new Event("Event 2", 2000);
            event1.setStartTime(now);
            event2.setStartTime(now + 1000); // Starts before event1 ends
            calendar.addThing(event1);
            calendar.addThing(event2);
            const prioritized = Calendar.sortByPriority(now, calendar.getActiveThings());
            expect(prioritized[0]).toBe(event1);
            expect(prioritized[1]).toBe(event2);
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
            event1.setStartTime(now + 3000);
            task1.setDueDate(now + 4000);
            calendar.addThing(task1);
            calendar.addThing(event1);

            const prioritized = Calendar.sortByPriority(now, calendar.getActiveThings());
            expect(prioritized[0]).toBe(task1);
            expect(prioritized[1]).toBe(event1);
        });

        test("Multiple Tasks Between Events", () => {
            event1.setStartTime(now);
            event2.setStartTime(now + 5000);
            task1.setDueDate(now + 3000);
            task2.setDueDate(now + 4000);

            calendar.addThing(event1);
            calendar.addThing(event2);
            calendar.addThing(task1);
            calendar.addThing(task2);

            const prioritized = Calendar.sortByPriority(now, calendar.getActiveThings());
            expect(prioritized[0]).toBe(event1);
            expect(prioritized[1]).toBe(task1);
            expect(prioritized[2]).toBe(task2);
            expect(prioritized[3]).toBe(event2);
        });

        test("Tasks That Don't Fit Between Events", () => {
            event1.setStartTime(now);
            event2.setStartTime(now + 1500); // Only 1500ms gap between events
            task1.setDuration(2000); // Too long to fit between events
            task1.setDueDate(now + 3000);

            calendar.addThing(event1);
            calendar.addThing(event2);
            calendar.addThing(task1);

            const prioritized = Calendar.sortByPriority(now, calendar.getActiveThings());
            expect(prioritized[0]).toBe(event1);
            expect(prioritized[1]).toBe(event2);
            expect(prioritized[2]).toBe(task1);
        });

        test("Overdue Tasks and Future Events", () => {
            event1.setStartTime(now + 3000);
            task1.setDueDate(now - 1000); // Overdue
            task2.setDueDate(now - 2000); // More overdue

            calendar.addThing(event1);
            calendar.addThing(task1);
            calendar.addThing(task2);

            const prioritized = Calendar.sortByPriority(now, calendar.getActiveThings());
            expect(prioritized[0]).toBe(task2);
            expect(prioritized[1]).toBe(task1);
            expect(prioritized[2]).toBe(event1);
        });

        test("Overdue Events and Future Tasks", () => {
            event1.setStartTime(now - 1000); // Overdue
            event2.setStartTime(now - 2000); // More overdue
            task1.setDueDate(now + 3000);

            calendar.addThing(event1);
            calendar.addThing(event2);
            calendar.addThing(task1);

            const prioritized = Calendar.sortByPriority(now, calendar.getActiveThings());
            expect(prioritized[0]).toBe(event2);
            expect(prioritized[1]).toBe(event1);
            expect(prioritized[2]).toBe(task1);
        });

        test("Complex Mixed Scenario", () => {
            event1.setStartTime(now + 1000);
            event2.setStartTime(now + 5000);
            task1.setDueDate(now + 3000);
            task1.setDuration(1000);
            task2.setDueDate(now + 4000);
            task2.setDuration(1500);

            calendar.addThing(event1);
            calendar.addThing(event2);
            calendar.addThing(task1);
            calendar.addThing(task2);

            const prioritized = Calendar.sortByPriority(now, calendar.getActiveThings());
            expect(prioritized[0]).toBe(task1);
            expect(prioritized[1]).toBe(event1);
            expect(prioritized[2]).toBe(task2);
            expect(prioritized[3]).toBe(event2);
        });
    });
    
    // test("recursion", () => {
    //     let new_event = new Event("pizza", 10000, now);
    //     calendar.addThing(new_event);
    //     calendar.recursion(new_event, 10, [false, true, false, true, false, true, false]);
    //     DataManager.saveCalendar(calendar, "calendar");
    // })
});