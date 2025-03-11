import "./App.css";
import TodoList from "@components/TodoList/TodoList";
import CalendarView from "@components/CalendarView/CalendarView";

function App() {
    return (
        <main className="flex h-[100vh] overflow-hidden">
            <TodoList></TodoList>
            <CalendarView></CalendarView>
        </main>
    );
}

export default App;
