import Task from "@/components/TodoList/Task";
// import TodoEvent from "@/components/TodoList/TodoEvent";
export default function TodoList() {
    return (
        <section className="bg-dark p-4 h-[95vh]">
            <div className="relative bg-off-white w-[400px] h-full flex flex-col rounded-3xl overflow-auto gap-1">
                <div className="sticky top-0 z-10 todo-header flex flex-row justify-between items-center h-16 p-8 rounded-2xl bg-white drop-shadow-md">
                    <h1 className="font-bold text-2xl">To-Do</h1>
                    <h2 className="text-lg">
                        <span className="font-bold text-2xl">13 </span>
                        Thu
                    </h2>
                </div>
                <div className="flex-col overflow-auto pb-2">
                    <Task></Task>
                    <Task></Task>
                    <Task></Task>
                    <Task></Task>
                    <Task></Task>
                    <Task></Task>
                    <Task></Task>
                    <Task></Task>
                    <Task></Task>
                    <Task></Task>
                </div>
            </div>
        </section>
    );
}
