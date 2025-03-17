import "./App.css";
import TodoList from "@components/TodoList/TodoList";
import CalendarView from "@/components/Calendar/Calendar";
import TitleBar from "./components/layout/TitleBar";

function App() {
    return (
        <>
            <TitleBar />
            <main className="flex max-h-[100vh] bg-dark overflow-hidden">
                <TodoList />
                <CalendarView />
            </main>
        </>
    );
}

export default App;
