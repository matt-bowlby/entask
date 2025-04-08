import TodoList from "@/components/TodoList/TodoListComponent";
import CalendarComponent from "@/components/Calendar/CalendarComponent";
import TitleBarComponent from "./components/layout/TitleBarComponent";
import useCalendarStore from "./store/calendarStore";
import Calendar from "./classes/calendar/Calendar";
import { useEffect } from "react";

function App() {
    const calendarStore = useCalendarStore();
    useEffect(() => {
        calendarStore.setCalendar(new Calendar("Calendar 1"));
    }, []);
    return (
        <>
            <TitleBarComponent />
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
