import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function Task() {
	const [open, setOpen] = useState(false);

    return (
        <div className={`bg-white drop-shadow-md max-w-full my-1 mx-4 p-2 flex rounded-3xl gap-4 relative
			${open ? "max-h-screen" : "max-h-28"} overflow-hidden transition-all`}> {/* task will be 28. then will grow till all data is shown when cheveron is clicked*/}
            <div className="tag-bar w-2 m-2 h- rounded-full overflow-hidden flex flex-col">
                <div className="w-full h-full bg-red-200"></div>
                <div className="w-full h-full bg-blue-200"></div>
            </div>
            <div>
                <h3 className="font-bold text-xl">
                    Test Task with a Long Name
                </h3>
                <p className="text-gray-600">2 hours</p>
                <p className="text-gray-600">Due in 10 hours at 11:59pm</p>
                <p className="text-gray-600">more data</p>
                <p className="text-gray-600">more data</p>
                <p className="text-gray-600">more data</p>
                <p className="text-gray-600">more data</p>
                <p className="text-gray-600">more data</p>
            </div>
            <ChevronDown onClick={()=> setOpen(!open)} className={`absolute right-4 bottom-2 cursor-pointer transition-transform ${open ? "rotate-180": ""}`} />
        </div>
    );
}
