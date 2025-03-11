import TodoTask from "@components/TodoList/TodoTask/TodoTask";
import TodoEvent from "@components/TodoList/TodoEvent/TodoEvent";
export default function TodoList() {
    return (
        <section className="bg-slate-100 grow flex flex-col gap-4">
            <TodoTask></TodoTask>
            <TodoTask></TodoTask>
            <TodoTask></TodoTask>
            <TodoEvent></TodoEvent>
        </section>
    );
}
