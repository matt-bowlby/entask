import TodoList from "@/components/TodoList/TodoListComponent";
import CalendarComponent from "@/components/Calendar/CalendarComponent";
import TitleBar from "./components/layout/TitleBarComponent";
import { Task, Event } from "./classes/thing/Thing";
import Tag from "./classes/tag/Tag";
import useCalendarStore from "./store/calendarStore";

function App() {
    const calendarStore = useCalendarStore();

    const handleAddThing = () => {
        const tag = new Tag("Test Task", "Test Task Description", "7FB4DA");
        const testDate = new Date();
        testDate.setHours(3, 0, 0, 0);

        const newThing = new Task(
            "Test Task 1",
            1000 * 60 * 60 * 2,
            Date.now() + 1000 * 60 * 60 * 3,
            testDate.getTime(),
            "Test task description lololooololoo",
            [tag],
            false
        );

        calendarStore.addThing(newThing);
    };

    const handleRemoveThing = () => {
        const things = calendarStore.getAllThingsBetween(
            0,
            Date.now() + 1000 * 60 * 60 * 24
        );
        if (things.length > 0) {
            calendarStore.removeThing(things[0]);
        }
    };

    return (
        <>
            <TitleBar />
            <div className="flex gap-2 p-2 bg-dark">
                <button
                    onClick={handleAddThing}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Add Test Thing
                </button>
                <button
                    onClick={handleRemoveThing}
                    className="px-4 py-2 bg-red-500 text-white rounded"
                >
                    Remove First Thing
                </button>
            </div>
            <main className="flex h-[calc(100vh-var(--title-bar-height))] bg-dark p-2 gap-2 overflow-hidden">
                <TodoList calendar={calendarStore.calendar} />
                <CalendarComponent
                    calendar={calendarStore.calendar}
                    numDaysInView={5}
                />
            </main>
        </>
    );
}

export default App;
