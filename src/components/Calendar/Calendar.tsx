import { CalendarDays } from "lucide-react";
import DayLabel from "@/components/Calendar/DayLabel";
import Calendar from "../../classes/calendar/Calendar";
import { useState } from "react";

interface CalendarInterface {
    calendar: Calendar;
    numDaysInView: number;
}

export default function CalendarView({
    calendar,
    numDaysInView = 5,
}: CalendarInterface) {
    const dates: Array<Date> = [];
    for (let i = 0; i < numDaysInView; i++) {
        dates.push(new Date(Date.now() + i * 24 * 60 * 60 * 1000));
    }

    const timeSlots = Array.from({ length: 24 }, (_, i) => {
        const hour = i;
        return `${hour > 12 || i === 0 ? Math.abs(hour - 12) : hour} ${
            hour >= 12 ? "PM" : "AM"
        }`;
    });

    return (
        <section id="calendar" className="bg-dark grow">
            <div className="bg-off-white h-full rounded-3xl flex flex-col overflow-hidden">
                <div
                    id="calendar-header"
                    className="w-full bg-white h-[120px] flex flex-row items-center p-2 rounded-3xl drop-shadow-md"
                >
                    <div className="flex flex-col gap-2 w-16 h-full items-center justify-center flex-shrink-0">
                        <CalendarDays size={30} strokeWidth={1.25} />
                    </div>
                    <div className="flex flex-row gap-2 w-full">
                        {Array.from({ length: numDaysInView }, (_, i) => {
                            return <DayLabel key={i} date={dates[i]} />;
                        })}
                    </div>
                </div>
                <div
                    id="calendar-body"
                    className="flex p-2 overflow-y-scroll [scrollbar-width:none] relative"
                >
                    <div className="absolute top-0 right-0 left-0 h-column-height [padding:inherit]">
                        <div className="relative">
                            {timeSlots.map((item, i) => (
                                <div
                                    className="flex flex-row absolute w-full gap-4"
                                    style={{
                                        top: `calc(${i}*var(--column-height)/24)`,
                                    }}
                                >
                                    <p className="text-sm text-nowrap -translate-y-2">
                                        {item}
                                    </p>
                                    <div className="border-b-[1px] w-full h-0 shrink-0"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="w-16 flex-shrink-0 h-column-height"></div>
                    <div className="flex flex-row gap-2 w-full">
                        {Array.from({ length: numDaysInView }, (_, i) => {
                            return (
                                <div
                                    key={i}
                                    className="flex flex-col w-full h-column-height outline-1"
                                ></div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
