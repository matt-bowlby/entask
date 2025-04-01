import { CalendarDays } from "lucide-react";
import DayLabel from "@/components/Calendar/DayLabel";
import Calendar from "../../classes/calendar/Calendar";
import { useState } from "react";

interface CalendarInterface {
    calendar: Calendar;
    numDaysInView: number;
}

export default function CalendarView({ calendar, numDaysInView = 5 }: CalendarInterface) {
    const dates: Array<Date> = [];
    for (let i = 0; i < numDaysInView; i++) {
        dates.push(new Date(Date.now() + i * 24 * 60 * 60 * 1000));
    }

    return (
        <section id="calendar" className="bg-dark grow">
            <div className="bg-off-white h-full rounded-3xl flex flex-col overflow-hidden">
                <div
                    id="calendar-header"
                    className="w-full bg-white h-[120px] flex flex-row items-center p-2 rounded-3xl drop-shadow-md"
                >
                    <div className="flex flex-col gap-2 w-16 h-full items-center justify-center flex-shrink-0">
                        <CalendarDays
                            size={30}
                            strokeWidth={1.25}
                        />
                    </div>
                    <div className="flex flex-row gap-2 w-full">
                        {Array.from({length: numDaysInView}, (_, i) => {
                            return (<DayLabel date={dates[i]} />);
                        })}
                    </div>
                </div>
                <div
                    id="calendar-body"
                    className="flex p-2 overflow-y-scroll [scrollbar-width:none] relative"
                >
                    <div className="w-16 flex-shrink-0 h-column-height"></div>
                    <div className="flex flex-row gap-2 w-full">
                        {Array.from({length: numDaysInView}, (_, i) => {
                            return (<div className="flex flex-col w-full h-column-height outline-1"></div>);
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
