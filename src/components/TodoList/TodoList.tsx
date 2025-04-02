import TodoTaskComponent from "@/components/TodoList/Task";
import Calendar from "@/classes/calendar/Calendar";
import { Task } from "@/classes/thing/Thing";
// import TodoEvent from "@/components/TodoList/TodoEvent";

interface TodoListProps {
    calendar: Calendar;
}

export default function TodoList({ calendar }: TodoListProps) {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayStart: Date = new Date();
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd: Date = new Date();
    dayEnd.setHours(23, 59, 59, 999);

    const activeThings = calendar.getAllThingsBetween(dayStart.getTime(), dayEnd.getTime());

    return (
        <section className="bg-dark">
            <div className="relative bg-off-white w-[400px] h-full flex flex-col rounded-xl overflow-auto">
                <div className="sticky top-0 z-10 todo-header flex flex-row justify-between items-center h-14 p-4 bg-white drop-shadow-md">
                    <h1 className="font-bold text-xl select-none">To-Do</h1>
                    <div className="flex flex-row gap-2 items-center justify-center">
                        <h1 className="font-bold text-xl select-none">{dayStart.getDate()}</h1>
                        <h2 className="text-regular text-base select-none">{dayNames[dayStart.getDay()]}</h2>
                    </div>
                </div>
                <div className="flex-col overflow-auto gap-2 p-2">
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
