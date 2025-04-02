import { ChevronDown } from "lucide-react";
import Thing, { Task, Event } from "../../classes/thing/Thing";

interface TaskProps {
    task: Task;
}

export default function TodoTaskComponent({ task }: TaskProps) {
    return (
        <div className="bg-white drop-shadow-md max-w-full p-2 h-28 flex rounded-xl gap-4 relative">
            <div className="tag-bar w-2 rounded-full overflow-hidden flex flex-col">
                {
                task.getTags().length === 0 ? (
                    <div className="w-full h-full bg-dark"></div>
                ) : (
                    task.getTags().map((tag, i) => (
                        <div
                            key={i}
                            className="w-full h-full"
                            style={{ backgroundColor: `#${tag.getColor()}` }}
                        ></div>
                    ))
                )
                }
            </div>
            <div className="overflow-clip flex flex-col justify-between">
                <div className="flex, flex-col">
                    <h3 className="font-bold text-base">{task.getName()}</h3>
                    <p className="text-gray-600 text-sm">
                        {(task.getDuration() / 1000 / 60 / 60) + " hrs"}
                    </p>
                    <p className="text-gray-600 text-sm">
                        {"Due in " + (task.getTimeUntilDue() / 1000 / 60 / 60) + " hrs"}
                    </p>
                </div>
                <p className="text-gray-600 text-sm">{task.getDescription()}</p>
            </div>
            <ChevronDown className="absolute right-4 bottom-2 cursor-pointer" />
        </div>
    );
}
