import TodoList from "@/components/TodoList/TodoListComponent";
import CalendarComponent from "@/components/Calendar/CalendarComponent";
import TitleBarComponent from "./components/layout/TitleBarComponent";
import useCalendarStore from "./store/calendarStore";
import Calendar from "./classes/calendar/Calendar";
import { useEffect } from "react";

function App() {
    const calendarStore = useCalendarStore();
    useEffect(() => {
        const loadCalendar = async () => {
            const calendar = await window.electronAPI.loadCalendar("Calendar") as Calendar;
            console.log("calendar from app: ", calendar.getName());
            calendarStore.setCalendar(calendar as Calendar);
        };
        loadCalendar();
        // calendarStore.setCalendar(new Calendar("Calendar"));
    }, []);

    // If calendar not loaded, return empty component
    if (!calendarStore.calendar) return <></>;

    return (
        <>
            <TitleBarComponent />
            <main className="flex h-[calc(100vh-var(--title-bar-height))] bg-dark p-2 gap-2 overflow-hidden">
                <TodoList />
                <CalendarComponent
                    numDaysInView={5}
                />
            </main>
        </>
    );
}

export default App;
