import { ChevronDown } from "lucide-react";
import Thing, { Task, Event } from "../../classes/thing/Thing";

interface TaskProps {
    task: Task;
}

export default function TodoTaskComponent({ task }: TaskProps) {
    return (
        <div className="bg-white drop-shadow-md max-w-full p-2 h-28 flex rounded-md gap-4 relative">
            <div className="tag-bar w-2 m-2 rounded-full overflow-hidden flex flex-col">
                <div className="w-full h-full bg-red-200"></div>
                <div className="w-full h-full bg-blue-200"></div>
            </div>
            <div className="overflow-clip flex flex-col">
                <h3 className="font-bold text-xl">{task.getName()}</h3>
                <p className="text-gray-600">
                    {task.getDuration() / 1000 / 60 / 60 + " hrs"}
                </p>
                <p className="text-gray-600">
                    {"Due in " +
                        task.getTimeUntilDue() / 1000 / 60 / 60 +
                        " hrs"}
                </p>
                <p className="text-gray-600">{task.getDescription()}</p>
            </div>
            <ChevronDown className="absolute right-4 bottom-2 cursor-pointer" />
        </div>
    );
}
