import "./App.css";
import TodoList from "@/components/TodoList/TodoListComponent";
import CalendarView from "@/components/Calendar/CalendarComponent";
import TitleBar from "./components/layout/TitleBarComponent";
import Calendar from "./classes/calendar/Calendar";
import {Task, Event} from "./classes/thing/Thing";
import Tag from "./classes/tag/Tag";

function App() {
    let calendar: Calendar = new Calendar("Calendar test");
    let tag1 = new Tag("Tag 1", "This is a test tag", "7FB4DA");
    let tag2 = new Tag("Tag 2", "This is another test tag", "5ED27D");
    let test: Date = new Date();
    calendar.addThing(new Event("Task 1 Task 1 Task 1 Task 1", 1000 * 60 * 46, test.getTime(), "This is a test task", [tag1, tag2]));
    calendar.addThing(new Task("Task 2", 1000 * 60 * 2, test.getTime(), undefined, "", [tag1], false));
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
