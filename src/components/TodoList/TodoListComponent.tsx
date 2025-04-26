import TodoTaskComponent from "@/components/TodoList/TodoTaskComponent";
import { Task, Event } from "@/classes/thing/Thing";
import useCalendarStore from "@/store/calendarStore";
import { useNowStore } from "@/components/Updater/Updater";
import { abbreviatedDayNames } from "@/utils/timeString";
import TodoEvent from "./TodoEventComponent";

export default function TodoList() {
    return (
        <div className="relative resize-x bg-off-white min-w-[260px] max-w-[1/2wh] w-[400px] h-full flex flex-col rounded-xl overflow-hidden">
            <TodoHeader />
            <div className="flex flex-col gap-2 p-2 [scrollbar-width:none]">
                <TodoActiveContent />
                <AllDone />
                <TodoCompletedContent />
            </div>
        </div>
    );
}

const TodoHeader = () => {
    const nowStore = useNowStore();
    const date = nowStore.getDayStart().getDate();
    const weekday = abbreviatedDayNames[nowStore.getDayStart().getDay()];

    const calendar = useCalendarStore().calendar;

    let title: JSX.Element[] = [<div key={0}>Today</div>];

    if (calendar) {
        const tagBlocks = calendar.getActiveTagBlocks(nowStore.now);
        if (tagBlocks.length > 0) title = [];
        for (let i = 0; i < tagBlocks.length; i++) {
            const color = "#" + tagBlocks[i].getTags()[0].getColor();
            const name = tagBlocks[i].getTags()[0].getName();
            title.push(
                <div key={i} className="flex gap-2 flex-row w-fit max-w-40 overflow-hidden">
                    {i > 0 ? <div>&</div> : null}
                    <span
                        className="overflow-hidden text-ellipsis w-fit whitespace-nowrap"
                        style={{ color }}
                    >
                        {" "}
                        {name}
                    </span>
                </div>
            );
        }
    }

    return (
        <div className="sticky top-0 z-10 todo-header flex flex-row justify-between items-center h-14 p-4 bg-white gap-2 drop-shadow-md overflow-hidden">
            <h1 className="flex flex-row font-bold text-xl w-full gap-2 select-none text-dark overflow-hidden">
                {title}
            </h1>
            <div className="flex flex-row gap-2 items-center justify-center">
                <h1 className="font-bold text-xl select-none text-dark">{date}</h1>
                <h2 className="text-regular text-base select-none text-dark">{weekday}</h2>
            </div>
        </div>
    );
};

const TodoActiveContent = () => {
    const now = useNowStore((state) => state.now);

    const dayStart = new Date(now);
    const dayEnd = new Date(now);
    dayStart.setHours(0, 0, 0, 0);
    dayEnd.setHours(23, 59, 59, 999);

    const calendar = useCalendarStore().calendar;
    const activeThings = calendar?.getTagThingsBetween(
        dayStart.getTime(),
        dayStart.getTime() + 24 * 60 * 60 * 1000
    );

    if (!activeThings) return <p>No tasks available at this time.</p>;

    return Array.from({ length: activeThings.length }, (_, i) => {
        if (activeThings[i] instanceof Task)
            return <TodoTaskComponent key={i} task={activeThings[i]} />;
        else if (activeThings[i] instanceof Event) {
            return <TodoEvent key={i} event={activeThings[i]} />;
        } else return null;
    });
};

const TodoCompletedContent = () => {
    const now = useNowStore((state) => state.now);

    const dayStart = new Date(now);
    const dayEnd = new Date(now);
    dayStart.setHours(0, 0, 0, 0);
    dayEnd.setHours(23, 59, 59, 999);

    const calendar = useCalendarStore().calendar;
    const completedThings = calendar?.getCompletedThings();

    if (!completedThings) return <p>No tasks available at this time.</p>;

    return Array.from({ length: completedThings.length }, (_, i) => {
        if (completedThings[i] instanceof Task)
            return <TodoTaskComponent key={i} task={completedThings[i]} />;
        else if (completedThings[i] instanceof Event) {
            return <TodoEvent key={i} event={completedThings[i]} />;
        } else return null;
    });
};

const AllDone = () => {
    const nowStore = useNowStore();
    const calendar = useCalendarStore().calendar;

    let title: JSX.Element[] = [
        <span key="default" className="text-dark">
            That's it for today!
        </span>,
    ];

    if (calendar) {
        const tagBlocks = calendar.getActiveTagBlocks(nowStore.now);
        if (tagBlocks.length > 0) {
            title = [<div key="prefix">That's it for</div>];
            for (let i = 0; i < tagBlocks.length; i++) {
                const color = `#${tagBlocks[i].getTags()[0].getColor()}`;
                const name = tagBlocks[i].getTags()[0].getName();

                title.push(
                    <span
                        key={i}
                        className="whitespace-nowrap max-w-full ml-1 overflow-hidden text-ellipsis"
                        style={{ color }}
                    >
                        {i > 0 && <span className="text-dark mr-1">&</span>}
                        {name}
                    </span>
                );
            }
            title.push(
                <span key="suffix" className="text-dark">
                    !
                </span>
            );
        }
    }

    return (
        <div className="flex flex-row w-full h-fit text-dark opacity-50 p-2 text-sm font-bold text-center items-center justify-center select-none">
            <div className="w-full h-0.5 bg-dark opacity-50 rounded-full mr-2"></div>
            <div className="flex flex-wrap min-w-2/3 items-center justify-center overflow-hidden">
                {title}
            </div>
            <div className="w-full h-0.5 bg-dark opacity-50 rounded-full ml-2"></div>
        </div>
    );
};
