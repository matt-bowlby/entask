import TodoList from "@/components/TodoList/TodoListComponent";
import CalendarComponent from "@/components/Calendar/CalendarComponent";
import TitleBarComponent from "./components/layout/TitleBarComponent";
import useCalendarStore from "./store/calendarStore";
import Calendar from "./classes/calendar/Calendar";
import Update from "./components/updater/Updater";
import { useEffect } from "react";
import { useCreateDialogStore } from "./store/TitleBarStore";

function App() {
    const setCalendar = useCalendarStore((state) => state.setCalendar);
    const calendar = useCalendarStore((state) => state.calendar);
    const { open, setType } = useCreateDialogStore();

    useEffect(() => {
        const loadCalendar = async () => {
            const calendarJson = await window.electronAPI.loadCalendar("Calendar");
            setCalendar(Calendar.fromJson(calendarJson));
        };
        loadCalendar();
    }, []);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.ctrlKey) {
                switch (e.key) {
                    case "n":
                        e.preventDefault();
                        setType(0); // Task
                        open();
                        break;
                    case "t":
                        e.preventDefault();
                        setType(0); // Task
                        open();
                        break;
                    case "e":
                        e.preventDefault();
                        setType(1); // Task
                        open();
                        break;
                    case "b":
                        e.preventDefault();
                        setType(2); // Task
                        open();
                        break;
                }
            }
        };

        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    // If calendar not loaded, return loading component
    if (!calendar) return <div className="bg-dark text-white w-[100vw] h-[100vh]">Loading...</div>;

    return (
        <div>
            <Update />
            <TitleBarComponent />
            <main className="flex h-[calc(100vh-var(--title-bar-height))] bg-dark p-2 gap-2 overflow-hidden">
                <TodoList />
                <CalendarComponent />
            </main>
        </div>
    );
}

export default App;
