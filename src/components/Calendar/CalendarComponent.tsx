import { CalendarDays } from "lucide-react";
import { useState, useEffect, useMemo } from "react";

import { useCalendarOffsetStore } from "@/store/calendarStore";

import { meridiem } from "@/utils/timeString";

import Thing, { Event } from "@/classes/thing/Thing";
import Calendar from "../../classes/calendar/Calendar";

import DayLabel from "@/components/Calendar/DayLabelComponent";
import EventComponent from "@/components/Calendar/CalendarEventComponent";

interface CalendarInterface {
    calendar: Calendar;
    numDaysInView: number;
    dayOffset: number;
}

const CalendarView = ({
    calendar,
    numDaysInView = 5,
}: CalendarInterface) => {
    const dayOffset = useCalendarOffsetStore((state) => state.dayOffset);

    // Memoize the dates array
    const dates = useMemo(() => {
        const calculatedDates: Array<Date> = [];
        for (let i = 0; i < numDaysInView; i++) {
            const newDate = new Date(
                Date.now() + (i + dayOffset) * 24 * 60 * 60 * 1000
            );
            newDate.setHours(0, 0, 0, 0);
            calculatedDates.push(newDate);
        }
        return calculatedDates;
    }, [dayOffset, numDaysInView]);

    const [eventsList, setEventsList] = useState<Thing[][]>([]);

    useEffect(() => {
        const events: Thing[][] = [];
        for (let i = 0; i < numDaysInView; i++) {
            events.push(
                calendar.getActiveThings().filter((thing) => {
                    if (thing.getStartTime() !== 0) {
                        return (
                            thing.getStartTime() >= dates[i].getTime() &&
                            thing.getStartTime() <
                                dates[i].getTime() + 24 * 60 * 60 * 1000
                        );
                    }
                })
            );
        }
        setEventsList(events);
    }, [calendar, dates, numDaysInView]); // Dependencies to re-run the effect

    return (
        <section id="calendar" className="bg-dark grow">
            <div className="bg-off-white h-full rounded-xl flex flex-col overflow-hidden">
                <CalendarHeader numDaysInView={numDaysInView} dates={dates} />
                <div
                    id="calendar-body"
                    className="flex p-2 pt-4 gap-2 overflow-y-scroll [scrollbar-width:none] relative"
                >
                    <HourMarkers />
                    <div className="w-10 flex-shrink-0 h-column-height"></div>
                    <div className="flex flex-row gap-2 w-full">
                        {Array.from({ length: numDaysInView }, (_, i) => {
                            return (
                                <div
                                    key={i}
                                    className="flex flex-col w-full h-column-height relative"
                                >
                                    {(eventsList[i] || []).map((item, j) => {
                                        return (
                                            <EventComponent
                                                key={j}
                                                event={item}
                                            />
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

function CalendarHeader({
    dates,
    numDaysInView,
}: {
    dates: Date[];
    numDaysInView: number;
}) {
    return (
        <div
            id="calendar-header"
            className="w-full bg-white flex flex-row items-center p-2 gap-2 drop-shadow-md z-10"
        >
            <div className="flex flex-col gap-2 w-10 h-full items-center justify-center flex-shrink-0">
                <CalendarDays size={30} strokeWidth={1.25} />
            </div>
            <div className="flex flex-row gap-2 w-full text-dark">
                {Array.from({ length: numDaysInView }, (_, i) => {
                    return <DayLabel key={i} date={dates[i]} />;
                })}
            </div>
        </div>
    );
}

function HourMarkers() {
    const timeSlots = Array.from({ length: 25 }, (_, i) => {
        return (meridiem(i, 0)); // 0 minutes for simplicity
    });
    return (
        <div className="absolute top-0 right-0 left-0 h-column-height p-2 py-4 select-none">
            <div className="relative">
                {timeSlots.map((item, i) => (
                    <div
                        key={i}
                        className="flex flex-row absolute w-full gap-2"
                        style={{
                            top: `calc(${i}*var(--column-height)/24)`,
                        }}
                    >
                        <div className="w-10 flex-shrink-0 flex justify-center">
                            <p className="text-xs text-nowrap -translate-y-2 text-[#00000088]">
                                {item}
                            </p>
                        </div>
                        <div className="border-b-[#00000022] border-b-[1px] w-full h-0"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CalendarView;