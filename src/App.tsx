import "./App.css";
import TodoList from "@components/TodoList/TodoList";
import CalendarView from "@/components/Calendar/Calendar";
import TitleBar from "./components/layout/TitleBar";
import Calendar from "./classes/calendar/Calendar";
import {Task, Event} from "./classes/thing/Thing";
import Tag from "./classes/tag/Tag";

function App() {
    let calendar: Calendar = new Calendar("Calendar test");
    let tag1 = new Tag("Tag 1", "This is a test tag", "FF0000");
    let tag2 = new Tag("Tag 2", "This is another test tag", "FFFF00");
    let test: Date = new Date();
    calendar.addThing(new Event("Task 1", 1000 * 60 * 60 * 2, test.getTime(), "This is a test task", [tag1, tag2]));
    calendar.addThing(new Task("Task 2", 1000 * 60 * 60, test.getTime() + 1000 * 60 * 60 * 1, undefined, "This is another test task", [tag1], false));
    return (
        <>
            <TitleBar />
            <main className="flex h-[calc(100vh-var(--title-bar-height))] bg-dark p-2 gap-2 overflow-hidden">
                <TodoList calendar={calendar}/>
                <CalendarView calendar={calendar} numDaysInView={5} dayOffset={0} />
            </main>
        </>
    );
}

export default App;
