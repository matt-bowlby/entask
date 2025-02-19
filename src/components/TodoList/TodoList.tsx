import TodoTask from "@components/TodoList/TodoTask/TodoTask";
import TodoEvent from "@components/TodoList/TodoEvent/TodoEvent";
export default function TodoList() {
    return (
        <section className="bg-slate-100 h-auto flex flex-col justify-center gap-4">
            <TodoTask></TodoTask>
            <TodoTask></TodoTask>
            <TodoTask></TodoTask>
            <TodoEvent></TodoEvent>
        </section>
    );
}
