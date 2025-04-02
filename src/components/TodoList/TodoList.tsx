import TodoTaskComponent from "@/components/TodoList/Task";
import Calendar from "@/classes/calendar/Calendar";
import { Task } from "@/classes/thing/Thing";
// import TodoEvent from "@/components/TodoList/TodoEvent";

interface TodoListProps {
    calendar: Calendar;
}

export default function TodoList({ calendar }: TodoListProps) {
    const dayStart: Date = new Date();
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd: Date = new Date();
    dayEnd.setHours(23, 59, 59, 999);

    const activeThings = calendar.getAllThingsBetween(dayStart.getMilliseconds(), dayEnd.getMilliseconds());

    return (
        <section className="bg-dark">
            <div className="relative bg-off-white w-[400px] h-full flex flex-col rounded-3xl overflow-auto gap-1">
                <div className="sticky top-0 z-10 todo-header flex flex-row justify-between items-center h-16 p-8 rounded-2xl bg-white drop-shadow-md">
                    <h1 className="font-bold text-2xl">To-Do</h1>
                    <h2 className="text-lg">
                        <span className="font-bold text-2xl">13 </span>
                        Thu
                    </h2>
                </div>
                <div className="flex-col overflow-auto pb-2">
                    {Array.from({length: activeThings.length }, (_, i) =>  {
                        if (activeThings[i] instanceof Task) {
                            return <TodoTaskComponent key={i} task={activeThings[i]} />;
                        }
                    })}
                </div>
            </div>
        </section>
    );
}
