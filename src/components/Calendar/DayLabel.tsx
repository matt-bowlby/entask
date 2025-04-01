interface Day {
    date: Date;
}

export default function DayLabel({ date }: Day) {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
        <div className="flex flex-col gap-2 w-full">
            <div
                className={
                    date.getDate() === (new Date()).getDate()
                        ? "h-[53px] flex justify-between items-center p-2 px-4 bg-dark text-white rounded-2xl"
                        : "h-[53px] flex justify-between items-center p-2 px-4 bg-off-white rounded-2xl"
                }
            >
                <h2 className="font-black text-2xl">{date.getDate()}</h2>
                <p className="font-semibold text-xl">{dayNames[date.getDay()]}</p>
            </div>
            <div className="w-5/6 self-center rounded-full h-2 overflow-hidden flex flex-row">
                <div className="w-full bg-red-200"></div>
                <div className="w-full bg-blue-200"></div>
                <div className="w-full bg-green-200"></div>
            </div>
        </div>
    );
}
