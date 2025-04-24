import DropdownMenu from "@components/items/DropdownMenu";
import { useState } from "react";

interface DateFieldProps {
    id: string;
    defaultValue: Date; // for use in the EditDialog
}

export default function DateField({ id, defaultValue }: DateFieldProps) {
    const [amPm, setAmPm] = useState<string>(defaultValue.getHours() >= 12 ? "PM" : "AM");

    const defaultDate = `${defaultValue.getFullYear()}-${String(
        defaultValue.getMonth() + 1
    ).padStart(2, "0")}-${String(defaultValue.getDate()).padStart(2, "0")}`;

    return (
        <div className="text-right h-10 flex flex-row gap-2">
            <div className="w-full p-2 gap-2 text-right rounded-md bg-white flex truncate">
                <input
                    type="date"
                    id={`date-${id}`}
                    className="w-full outline-0"
                    defaultValue={defaultDate}
                />
            </div>
            <div className="flex items-center justify-center"> : </div>
            <div className="flex w-20 h-full flex-shrink-0">
                <DropdownMenu
                    id={`date-hour-${id}`}
                    options={Array.from({ length: 12 }, (_, i) => (i + 1).toString())}
                    defaultOption={
                        defaultValue ? (defaultValue.getHours() % 12 || 12).toString() : "12"
                    }
                />
            </div>
            <div className="flex w-20 h-full flex-shrink-0">
                <DropdownMenu
                    id={`date-minute-${id}`}
                    options={Array.from({ length: 12 }, (_, i) =>
                        (i * 5).toString().padStart(2, "0")
                    )}
                    defaultOption={defaultValue.getMinutes().toString().padStart(2, "0")}
                />
            </div>
            <div className="flex flex-col w-8 flex-shrink-0 rounded-md overflow-hidden select-none">
                <button
                    id={`date-am-${id}`}
                    value={amPm === "PM" ? "true" : "false"}
                    className={
                        amPm === "AM"
                            ? "justify-center text-xs flex items-center bg-dark text-white h-full"
                            : "justify-center text-xs flex items-center bg-white text-dark h-full cursor-pointer"
                    }
                    onClick={() => setAmPm("AM")}
                >
                    am
                </button>
                <button
                    id={`date-pm-${id}`}
                    value={amPm === "PM" ? "true" : "false"}
                    className={
                        amPm === "PM"
                            ? "justify-center text-xs flex items-center bg-dark text-white h-full"
                            : "justify-center text-xs flex items-center bg-white text-dark h-full cursor-pointer"
                    }
                    onClick={() => setAmPm("PM")}
                >
                    pm
                </button>
            </div>
        </div>
    );
}
