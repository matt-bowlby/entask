import "./App.css";
import TodoList from "@components/TodoList/TodoList";
import CalendarView from "@/components/Calendar/Calendar";
import TitleBar from "./components/layout/TitleBar";

function App() {
    return (
        <>
            <TitleBar />
            <main className="flex h-[calc(100vh-var(--title-bar-height))] bg-dark p-4 gap-4 overflow-hidden">
                <TodoList />
                <CalendarView numDaysInView={5} />
            </main>
        </>
    );
}

export default App;
