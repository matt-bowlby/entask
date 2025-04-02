import { CheckSquare2, Square } from "lucide-react";
import React from "react";
import Thing, { Task, Event } from "../../classes/thing/Thing";

interface TaskProps {
    task: Task;
}

export default function TodoTaskComponent({ task }: TaskProps) {
    const [isComplete, setIsComplete] = React.useState(task.isCompleted());

    const handleToggleComplete = () => {
        task.setCompleted(!task.isCompleted());
        setIsComplete(!isComplete);
    };

    return (
        <div className="bg-white h-auto max-w-full p-2 flex rounded-xl gap-4 relative">
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
                        {(task.getDuration() / 1000 / 60 / 60) + " hrs"}
                    </p>
                    <p className="text-dark text-sm">
                        {"Due in " + (task.getTimeUntilDue() / 1000 / 60 / 60) + " hrs"}
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
