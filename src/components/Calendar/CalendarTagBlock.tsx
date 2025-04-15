import TagBlock from "@/classes/tag/TagBlock";
// import { meridiem } from "@/utils/timeString";

interface CalendarTagBlockProps {
    tagBlock: TagBlock;
}

const CalendarTagBlock = ({ tagBlock }: CalendarTagBlockProps) => {
    const startTime = new Date(tagBlock.getStartTime());
    const dayStart = new Date(startTime);
    dayStart.setHours(0, 0, 0, 0);

    const root = document.documentElement;
    const columnHeight = parseFloat(getComputedStyle(root).getPropertyValue('--column-height'));

    const top: number = ((tagBlock.getStartTime() - dayStart.getTime()) / (24 * 1000 * 60 * 60)) * columnHeight;
    const height: number = (tagBlock.getDuration() / (24 * 1000 * 60 * 60)) * columnHeight;


    if (tagBlock.getTags().length === 0) return <></>;

    const tagName = tagBlock.getTags()[0].getName();
    const colors = tagBlock.getTags().map(tag => `#${tag.getColor()}`);

    return <div
        className={`absolute flex flex-col outline-2 rounded-xl gap-1 left-0 right-0 p-2 overflow-clip`}
        style={{
            top: `${top}px`,
            height: `${height}px`,
            outlineColor: colors[0],
            outlineStyle: "dashed",
            outlineOffset: "-2px",
        }}
    >
        <div className="flex flex-col justify-center items-start w-full overflow-hidden h-fit flex-shrink-0">
            <div
                className="font-bold text-sm w-fit max-w-full px-2 h-fit text-ellipsis whitespace-nowrap overflow-hidden text-white rounded-md"
                style={{
                    backgroundColor: colors[0],
                }}
            >
                {tagName}
            </div>
        </div>
    </div>
}

export default CalendarTagBlock;