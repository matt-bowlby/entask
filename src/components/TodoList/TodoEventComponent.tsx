import { Event } from "@/classes/thing/Thing";
import { msDurationToString } from "@/utils/timeString";
import { useNowStore } from "../updater/Updater";
import { motion } from "framer-motion";
import { useEditDialogStore, DialogType } from "@/store/EditDialogStore";

interface TodoEventProps {
    event: Event;
}

export default function TodoEvent({ event }: TodoEventProps) {
    const now = useNowStore((state) => state.now);
    const startTime = new Date(event.getStartTime());
    const endTime = new Date(event.getEndTime());
    const dayStart = new Date(startTime);
    dayStart.setHours(0, 0, 0, 0);

    let timingString: string = "";
    if (now < startTime.getTime()) {
        timingString = `In ${msDurationToString(startTime.getTime() - now, false)}`;
    } else {
        timingString = `Ends in ${msDurationToString(endTime.getTime() - now, false)}`;
    }

    const editDialogStore = useEditDialogStore();

    return (
        <motion.div
            className="flex flex-col bg-white h-auto max-w-full p-2 rounded-xl gap-2 relative"
            transition={{ duration: 0.15 }}
            onClick={() => {
                editDialogStore.open(DialogType.Event);
                editDialogStore.setData(event);
            }}
            initial={{
                scale: 1,
                filter: "drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.2))",
            }}
            animate={{
                scale: 1,
                filter: "drop-shadow(0px 3px 3px rgba(0, 0, 0, 0.2))",
            }}
            whileTap={{
                scale: 0.98,
            }}
            whileHover={{
                filter: "drop-shadow(0px 3px 4px rgba(0, 0, 0, 0.4))",
            }}
        >
            <div className="flex flex-row h-2 w-full rounded-full overflow-hidden flex-shrink-0">
                {event.getTags().length === 0 ? (
                    <div className="w-full h-2 bg-dark flex-shrink-0" />
                ) : (
                    event
                        .getTags()
                        .map((tag, i) => (
                            <div
                                key={i}
                                className="w-full h-2"
                                style={{ backgroundColor: `#${tag.getColor()}` }}
                            />
                        ))
                )}
            </div>
            <div className="flex flex-col w-full overflow-auto [scrollbar-width:none]">
                <div className="flex flex-col justify-center items-center w-full overflow-hidden h-fit flex-shrink-0">
                    <h1 className="font-bold text-dark text-sm w-full text-ellipsis whitespace-nowrap overflow-hidden">
                        {event.getName()}
                    </h1>
                </div>

                <div className="flex flex-col w-full gap-2">
                    <p id="hour-text" className="text-sm">
                        {timingString}
                    </p>
                    {event.getDescription() ? (
                        <p id="description-text" className="text-xs text-dark">
                            {event.getDescription()}
                        </p>
                    ) : null}
                </div>
            </div>
        </motion.div>
    );
}
