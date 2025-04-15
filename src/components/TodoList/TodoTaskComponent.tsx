import { CheckSquare2, Square } from "lucide-react";
import React from "react";
import { Task } from "../../classes/thing/Thing";
import { msDurationToString } from "@/utils/timeString";

interface TaskProps {
    task: Task;
}

export default function TodoTaskComponent({ task }: TaskProps) {
    const [isComplete, setIsComplete] = React.useState(task.isCompleted());

    const handleToggleComplete = () => {
        task.setCompleted(!task.isCompleted());
        setIsComplete(!isComplete);
    };

    const pastDue = task.getDueDate() < Date.now();
    const isClose = task.getDuration() > (task.getDueDate() - Date.now());

    return (
        <div className="bg-white h-auto max-w-full drop-shadow-md p-2 flex rounded-xl gap-2 relative">
            <div className="tag-bar min-w-2 rounded-full overflow-hidden flex flex-col">
                {task.getTags().length === 0 ? (
                    <div className="w-full h-full bg-dark"></div>
                ) : (
                    task.getTags().map((tag, i) => (
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
                    <h3 className="font-bold text-base text-dark">{task.getName()}</h3>
                    <p className="text-dark text-sm">
                        {msDurationToString(task.getDuration())}
                    </p>
                    <p className={`text-sm ${isClose ? "text-red-500" : "text-dark"}`}>
                        {
                            (pastDue ? (
                                "Due " + msDurationToString(task.getTimeUntilDue()) + " ago"
                            ) : (
                                "Due in " + msDurationToString(task.getTimeUntilDue())
                            ))
                        }
                    </p>
                </div>
                {task.getDescription().length > 0 && (
                    <p className="text-dark text-sm">{task.getDescription()}</p>
                )}
            </div>
            <div className="flex justify-center items-center">
                {isComplete ? (
                    <CheckSquare2
                        size={32}
                        strokeWidth={1}
                        className="cursor-pointer text-dark"
                        onClick={handleToggleComplete}
                    />
                ) : (
                    <Square
                        size={32}
                        strokeWidth={1}
                        className="cursor-pointer text-dark"
                        onClick={handleToggleComplete}
                    />
                )}
            </div>
        </div>
    );
}
