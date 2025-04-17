import { Check } from "lucide-react";
// import React  from "react";
import { Task } from "../../classes/thing/Thing";
import { msDurationToString } from "@/utils/timeString";
import { motion } from "framer-motion";
import useCalendarStore from "@/store/calendarStore";

interface TaskProps {
    task: Task;
}

export default function TodoTaskComponent({ task }: TaskProps) {
    const { completeThing, uncompleteThing } = useCalendarStore();

    const handleToggleComplete = () => {
        if (!task.isCompleted()) setTimeout(() => completeThing(task), 100);
        else setTimeout(() => uncompleteThing(task), 100);
    };

    const pastDue = task.getDueDate() < Date.now();
    const isClose = task.getDuration() > task.getDueDate() - Date.now();

    return (
        <motion.div
            className="h-auto w-full flex rounded-xl overflow-hidden bg-white"
            style={{
                opacity: task.isCompleted() ? 0.5 : 1,
            }}
            initial={{
                scale: 1,
                filter: "drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.2))",
            }}
            animate={{
                scale: 1,
                filter: "drop-shadow(0px 3px 3px rgba(0, 0, 0, 0.2))",
            }}
            whileHover={{
                filter: "drop-shadow(0px 3px 4px rgba(0, 0, 0, 0.4))",
            }}
            whileTap={{
                scale: 0.98,
            }}
            transition={{ duration: 0.15 }}
        >
            <div className="flex flex-row h-auto w-full p-2 gap-2 bg-white">
                <div className="tag-bar min-w-2 rounded-full overflow-hidden flex flex-col">
                    {task.getTags().length === 0 ? (
                        <div className="w-full h-full bg-dark"></div>
                    ) : (
                        task
                            .getTags()
                            .map((tag, i) => (
                                <div
                                    key={i}
                                    className="w-full h-full"
                                    style={{ backgroundColor: `#${tag.getColor()}` }}
                                ></div>
                            ))
                    )}
                </div>
                <div className="flex flex-col gap-2 w-full">
                    <div className="flex flex-col">
                        <h3 className="font-bold text-base text-inherit">{task.getName()}</h3>
                        <p className="text-inherit text-sm">
                            {msDurationToString(task.getDuration())}
                        </p>
                        <p className={`text-sm ${isClose ? "text-red-500" : "text-inherit"}`}>
                            {pastDue
                                ? "Due " + msDurationToString(task.getTimeUntilDue()) + " ago"
                                : "Due in " + msDurationToString(task.getTimeUntilDue())}
                        </p>
                    </div>
                    {task.getDescription().length > 0 && (
                        <p className="text-inherit text-sm">{task.getDescription()}</p>
                    )}
                </div>
            </div>
            <motion.button
                className="flex justify-center items-center w-12 h-full cursor-pointer bg-white"
                onClick={handleToggleComplete}
                initial={{
                    scale: 1,
                    filter: "drop-shadow(0px 0px 6px rgba(0, 0, 0, 0))",
                }}
                animate={{
                    scale: 1,
                    filter: "drop-shadow(0px 0px 6px rgba(0, 0, 0, 0))"
                }}
                whileHover=
                {{ filter: "drop-shadow(0px 0px 6px rgba(0, 0, 0, 0.2))" }}
                transition={{ duration: 0.15 }}
            >
                <Check size={20} strokeWidth={3} />
            </motion.button>
        </motion.div>
    );
}
