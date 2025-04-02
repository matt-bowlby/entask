import "./App.css";
import TodoList from "@components/TodoList/TodoList";
import CalendarView from "@/components/Calendar/Calendar";
import TitleBar from "./components/layout/TitleBar";
import Calendar from "./classes/calendar/Calendar";

function App() {
    let calendar: Calendar = new Calendar("Calendar test");
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
