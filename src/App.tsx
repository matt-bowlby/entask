import "./App.css";
import TodoList from "@components/TodoList/TodoList";
import CalendarView from "@/components/Calendar/Calendar";

function App() {
    return (
        <main className="flex h-[100vh] bg-[#323339] overflow-hidden">
            <TodoList></TodoList>
            <CalendarView></CalendarView>
        </main>
    );
}

export default App;
