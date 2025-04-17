import DropdownMenu from "@components/items/DropdownMenu";
import { useState } from "react";
import { getDaysInMonth, months } from "@/utils/timeString";

interface DateFieldProps {
    id: string;
}

export default function DateField({ id }: DateFieldProps) {
    const now = new Date();

    const [month, setMonth] = useState<number>(now.getMonth());
    const [year, setYear] = useState<number>(now.getFullYear());
    const [amPm, setAmPm] = useState<string>(
        now.getHours() >= 12 ? "PM" : "AM"
    );

    return (
        <div className="text-right h-10 flex flex-row gap-2">
            <div className="w-full px-2 gap-2 text-right rounded-md bg-white flex truncate">
                <DropdownMenu
                    id={`date-year-${id}`}
                    options={Array.from(
                        {
                            length:
                                now.getFullYear() + 6 - (now.getFullYear() - 5),
                        },
                        (_, i) => (now.getFullYear() - 5 + i).toString()
                    )}
                    optionReaction={(_: string, i: number) => setYear(i)}
                    defaultOption={now.getFullYear().toString()}
                    className="w-full text-sm"
                />
            </div>
            <div className="w-fit flex-shrink-0 px-2 gap-2 text-right rounded-md bg-white flex truncate">
                <DropdownMenu
                    id={`date-month-${id}`}
                    options={months}
                    optionReaction={(_: string, i: number) => setMonth(i)}
                    defaultOption={months[now.getMonth()]}
                    className="w-full text-sm"
                />
            </div>
            <div className="w-full px-2 gap-2 text-right rounded-md bg-white flex truncate">
                <DropdownMenu
                    id={`date-day-${id}`}
                    options={Array.from(
                        { length: getDaysInMonth(year, month + 1) },
                        (_, i) => (i + 1).toString()
                    )}
                    defaultOption={now.getDate()}
                    className="w-full text-sm [scroll-bar:none]"
                />
            </div>

            <div className="flex items-center justify-center">:</div>

            <div className="w-fit flex-shrink-0 p-2 gap-1 text-right rounded-md bg-white flex truncate">
                <DropdownMenu
                    id={`date-hour-${id}`}
                    options={Array.from({ length: 12 }, (_, i) =>
                        (i + 1).toString()
                    )}
                    defaultOption={now.getHours() ? now.getHours() % 12 : "12"}
                    className="w-12 flex-shrink-0 text-sm"
                />
            </div>
            <div className="w-auto flex-shrink-0 px-2 gap-2 text-right rounded-md bg-white flex truncate">
                <DropdownMenu
                    id={`date-minute-${id}`}
                    options={Array.from({ length: 12 }, (_, i) =>
                        (i * 5).toString().padStart(2, "0")
                    )}
                    defaultOption={"0"}
                    className="w-12 flex-shrink-0 text-sm"
                />
            </div>
            <div className="flex flex-col w-8 flex-shrink-0 rounded-md overflow-hidden select-none">
                <button
                    id={`date-am-${id}`}
                    value={amPm === "PM" ? "true" : "false"}
                    className={
                        amPm === "AM"
                            ? "justify-center text-xs flex items-center bg-dark text-white h-full"
                            : "justify-center text-xs flex items-center bg-white text-dark outline-1 outline-[#7772720a] h-full"
                    }
                    onClick={() => setAmPm(amPm === "AM" ? "PM" : "AM")}
                >
                    am
                </button>
                <button
                    id={`date-pm-${id}`}
                    value={amPm === "PM" ? "true" : "false"}
                    className={
                        amPm === "PM"
                            ? "justify-center text-xs flex items-center bg-dark text-white h-full"
                            : "justify-center text-xs flex items-center bg-white text-dark outline-1 outline-[#0000000a] h-full"
                    }
                    onClick={() => setAmPm(amPm === "AM" ? "PM" : "AM")}
                >
                    pm
                </button>
            </div>
        </div>
    );
}
