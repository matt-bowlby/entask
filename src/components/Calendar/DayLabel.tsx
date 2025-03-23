interface Day {
    num: number;
    name: string;
    selected: boolean;
}

export default function DayLabel({ num, name, selected }: Day) {
    return (
        <div className="flex flex-col gap-2 w-full mx-[10px]">
            <div
                className={
                    selected
                        ? "h-[53px] flex justify-between items-center p-2 px-4 bg-dark text-white rounded-2xl"
                        : "h-[53px] flex justify-between items-center p-2 px-4 bg-off-white rounded-2xl"
                }
            >
                <h2 className="font-black text-2xl">{num}</h2>
                <p className="font-semibold text-xl">{name}</p>
            </div>
            <div className="w-5/6 self-center rounded-full h-2 overflow-hidden flex flex-row">
                <div className="w-full bg-red-200"></div>
                <div className="w-full bg-blue-200"></div>
                <div className="w-full bg-green-200"></div>
            </div>
        </div>
    );
}
