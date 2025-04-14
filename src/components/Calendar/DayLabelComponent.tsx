import useCalendarStore from "@/store/calendarStore";

interface Day {
    date: Date;
}

export default function DayLabel({ date }: Day) {
    const calendar = useCalendarStore().calendar;
    const tagBlocks = calendar?.getTagBlocks().filter((tagBlock) => {
        if (tagBlock.getStartTime() !== 0) {
            return (
                tagBlock.getStartTime() >= date.getTime() &&
                tagBlock.getStartTime() <
                    date.getTime() + 24 * 60 * 60 * 1000
            );
        }
    }) || [];

    const tagColors = tagBlocks.map((tagBlock) => {
        const colors = tagBlock.getTags().map(tag => `#${tag.getColor()}`);
        return colors[0];
    });

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
        <div className="flex flex-col gap-2 w-full h-full">
            <div
                className={
                    date.getDate() === (new Date()).getDate()
                        ? "h-10 flex justify-between items-center p-2 px-4 bg-dark text-white rounded-md"
                        : "h-10 flex justify-between items-center p-2 px-4 bg-off-white rounded-md"
                }
            >
                <h2 className="font-bold text-xl select-none">{date.getDate()}</h2>
                <p className="font-regular text-base select-none">{dayNames[date.getDay()]}</p>
            </div>
            {
                tagBlocks.length > 0 ? (
                <div className="px-2">
                    <div className="w-full self-center rounded-full h-fit overflow-hidden flex flex-row">
                        {
                            tagColors.map((color, index) => {
                                return <div
                                    key={index}
                                    className=" h-2 w-full bg-accent-1"
                                    style ={{ backgroundColor: color }}
                                ></div>;
                            })
                        }
                    </div>
                </div>
                ) : null
            }
        </div>
    );
}
