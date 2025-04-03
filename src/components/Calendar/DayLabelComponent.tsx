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
                        ? "h-[40px] flex justify-between items-center p-2 px-4 bg-dark text-white rounded-md"
                        : "h-[40px] flex justify-between items-center p-2 px-4 bg-off-white rounded-md"
                }
            >
                <h2 className="font-bold text-xl select-none">{date.getDate()}</h2>
                <p className="font-regular text-base select-none">{dayNames[date.getDay()]}</p>
            </div>
            <div className="px-2">
                <div className="w-full self-center rounded-full h-2 overflow-hidden flex flex-row">
                    <div className="w-full bg-accent-1"></div>
                    <div className="w-full bg-accent-2"></div>
                    <div className="w-full bg-accent-3"></div>
                </div>
            </div>
        </div>
    );
}
