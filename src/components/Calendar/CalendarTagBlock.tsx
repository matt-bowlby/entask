import TagBlock from "@/classes/tag/TagBlock";
// import { meridiem } from "@/utils/timeString";
import { useEditDialogStore, DialogType } from "@/store/EditDialogStore";
import { motion } from "framer-motion";

interface CalendarTagBlockProps {
    tagBlock: TagBlock;
}

const CalendarTagBlock = ({ tagBlock }: CalendarTagBlockProps) => {
    const startTime = new Date(tagBlock.getStartTime());
    const dayStart = new Date(startTime);
    dayStart.setHours(0, 0, 0, 0);

    const root = document.documentElement;
    const columnHeight = parseFloat(
        getComputedStyle(root).getPropertyValue("--column-height")
    );

    const top: number =
        ((tagBlock.getStartTime() - dayStart.getTime()) /
            (24 * 1000 * 60 * 60)) *
        columnHeight;
    const height: number =
        (tagBlock.getDuration() / (24 * 1000 * 60 * 60)) * columnHeight;

    const editDialogStore = useEditDialogStore();

    if (tagBlock.getTags().length === 0) return <></>;

    const tagName = tagBlock.getTags()[0].getName();
    const colors = tagBlock.getTags().map((tag) => `#${tag.getColor()}`);

    return (
        <motion.div
            className={`absolute flex flex-col outline-2 rounded-xl gap-1 left-0 right-0 p-2 overflow-clip`}
            style={{
                top: `${top}px`,
                height: `${height}px`,
                outlineColor: colors[0],
                outlineStyle: "dashed",
                outlineOffset: "-2px",
            }}
            onClick={() => {
                editDialogStore.open(DialogType.TagBlock);
                editDialogStore.setData(tagBlock);
            }}
            initial={{
                scale: 1,
                filter: "drop-shadow(0px 3px 3px rgba(0, 0, 0, 0))",
            }}
            animate={{
                scale: 1,
                filter: "drop-shadow(0px 3px 3px rgba(0, 0, 0, 0))",
            }}
            whileTap={{
                scale: 0.98,
            }}
            whileHover={{
                filter: "drop-shadow(0px 3px 3px rgba(0, 0, 0, 0.4))",
            }}
            transition={{ duration: 0.15 }}
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
        </motion.div>
    );
};

export default CalendarTagBlock;
