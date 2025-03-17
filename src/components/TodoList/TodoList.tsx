import Task from "@/components/TodoList/Task";
// import TodoEvent from "@/components/TodoList/TodoEvent";
export default function TodoList() {
    return (
        <section className="bg-[#F0F0F0] grow flex flex-col rounded-3xl m-4 overflow-hidden gap-1">
            <div className="todo-header flex flex-row justify-between items-center h-16 p-8 rounded-2xl bg-white drop-shadow-md">
                <h1 className="font-bold text-2xl">To-Do</h1>
                <h2 className="text-lg">
                    <span className="font-bold text-2xl">13 </span>
                    Thu
                </h2>
            </div>
            <Task></Task>
            <Task></Task>
            <Task></Task>
        </section>
    );
}
