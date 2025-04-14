import TodoTaskComponent from "@/components/TodoList/TodoTaskComponent";
import { Task } from "@/classes/thing/Thing";
import useCalendarStore from "@/store/calendarStore";
import { useNowStore } from "../Updater/Updater";
// import TodoEvent from "@/components/TodoList/TodoEvent";

export default function TodoList() {
    return (
        <div className="relative resize-x bg-off-white min-w-[260px] max-w-[1/2wh] w-[400px] h-full flex flex-col rounded-xl overflow-hidden">
            <TaskHeader />
            <div className="flex flex-col gap-2 p-2 [scrollbar-width:none]">
                <TaskContent />
            </div>
        </div>
    );
}

const TaskHeader = () => {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const nowStore = useNowStore();

    const date = nowStore.getDayStart().getDate()
    const weekday = dayNames[nowStore.getDayStart().getDay()]

    return <div className="sticky top-0 z-10 todo-header flex flex-row justify-between items-center h-14 p-4 bg-white drop-shadow-md">
        <h1 className="font-bold text-xl select-none text-dark">To-Do</h1>
        <div className="flex flex-row gap-2 items-center justify-center">
            <h1 className="font-bold text-xl select-none text-dark">{date}</h1>
            <h2 className="text-regular text-base select-none text-dark">{weekday}</h2>
        </div>
    </div>
}

const TaskContent = () => {
    const now = useNowStore((state) => state.now);

    const dayStart = new Date(now);
    const dayEnd = new Date(now);
    dayStart.setHours(0, 0, 0, 0);
    dayEnd.setHours(23, 59, 59, 999);

    const calendar = useCalendarStore().calendar;
    const activeThings = calendar?.getTagThingsBetween(dayStart.getTime(), dayEnd.getTime() + 24 * 60 * 60 * 1000);

    if (!activeThings) return <p>No tasks available at this time.</p>;

    return Array.from({length: activeThings.length }, (_, i) =>  {
            if (activeThings[i] instanceof Task) {
                return <TodoTaskComponent key={i} task={activeThings[i]} />;
            }
        }
    );
}