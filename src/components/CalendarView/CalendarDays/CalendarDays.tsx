import Day from "@components/CalendarView/CalendarDays/Day";
export default function CalendarDays() {
    return (
        <div
            id="calendar-days"
            className="grid grid-cols-7 sticky top-0 shadow-md bg-slate-200 h-[10vh]"
        >
            {Array.from({ length: 7 }, (_, k) => (
                <Day num={k + 1} name="mon"></Day>
            ))}
        </div>
    );
}
