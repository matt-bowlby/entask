import { CalendarDays } from "lucide-react";
import DayLabel from "@/components/Calendar/DayLabel";
import Calendar from "../../classes/calendar/Calendar";
import EventComponent from "@/components/Calendar/EventComponent";
import Thing, { Event } from "@/classes/thing/Thing";
import { useState } from "react";

interface CalendarInterface {
    calendar: Calendar;
    numDaysInView: number;
    dayOffset: number;
}

export default function CalendarView({
    calendar,
    numDaysInView = 5,
    dayOffset = 0,
}: CalendarInterface) {
    const dates: Array<Date> = [];
    for (let i = 0; i < numDaysInView; i++) {
        const newDate = new Date(
            Date.now() + (i + dayOffset) * 24 * 60 * 60 * 1000
        );
        newDate.setHours(0, 0, 0, 0);
        dates.push(newDate);
    }

    const events: Array<Array<Thing>> = [];
    for (let i = 0; i < numDaysInView; i++) {
        events.push(
            calendar.getActiveThings().filter((thing) => {
                console.log(dates[i].getTime());
                if (thing.getStartTime() !== 0) {
                    if (
                        thing.getStartTime() >= dates[i].getTime() &&
                        thing.getStartTime() <
                            dates[i].getTime() + 24 * 60 * 60 * 1000
                    ) {
                        return true;
                    }
                    return false;
                }
            })
        );
    }

    const [eventsList, setEventsList] = useState<Array<Array<Thing>>>(events);

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
                                    {eventsList[i].map((item, j) => {
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
        const hour = i;
        return `${hour > 12 || i === 0 ? Math.abs(hour - 12) : hour} ${
            hour >= 12 ? "PM" : "AM"
        }`;
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
