import { CalendarDays } from "lucide-react";
import { useMemo, useEffect } from "react";
import { motion } from "framer-motion";

import useCalendarStore, { useCalendarOffsetStore, useCalendarScrollStore } from "@/store/calendarStore";

import { meridiem } from "@/utils/timeString";

import Thing from "@/classes/thing/Thing";
// import Calendar from "../../classes/calendar/Calendar";

import DayLabel from "@/components/Calendar/DayLabelComponent";
import EventComponent from "@/components/Calendar/CalendarEventComponent";

interface CalendarInterface {
    numDaysInView: number;
}

const CalendarComponent = ({
    numDaysInView = 5,
}: CalendarInterface) => {
    const dayOffset = useCalendarOffsetStore((state) => state.dayOffset);
    const resetScrollHeight = useCalendarScrollStore((state) => state.resetScrollHeight);
    const calendar = useCalendarStore().calendar;

    const { dates, events } = useMemo(() => {
        const calculatedDates: Array<Date> = [];
        const events: Thing[][] = [];

        for (let i = 0; i < numDaysInView; i++) {
            const newDate = new Date(
                Date.now() + (i + dayOffset) * 24 * 60 * 60 * 1000
            );
            newDate.setHours(0, 0, 0, 0);
            calculatedDates.push(newDate);

            if (calendar)
                events.push(
                    calendar.getActiveThings().filter((thing) => {
                        if (thing.getStartTime() !== 0) {
                            return (
                                thing.getStartTime() >= newDate.getTime() &&
                                thing.getStartTime() <
                                    newDate.getTime() + 24 * 60 * 60 * 1000
                            );
                        }
                    })
                );
        }

        return { dates: calculatedDates, events: events };
    }, [calendar, dayOffset, numDaysInView]);

    useEffect(() => {
        resetScrollHeight();
    }, []);

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
                                    {(events[i] || []).map((item, j) => {
                                        return (
                                            <motion.div
                                                key={j}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ ease: "circOut", duration: 0.3, delay: j * 0.1 }}
                                            >
                                                <EventComponent event={item} />
                                            </motion.div>
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
};

const CalendarHeader = ({
    dates,
    numDaysInView,
}: {
    dates: Date[];
    numDaysInView: number;
}) => {
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
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const milliseconds = Date.now() - startOfDay.getTime();

    return (
        <div className="absolute top-0 right-0 left-0 h-column-height p-2 py-4 select-none">
            <div className="relative">
                {timeSlots.map((item, i) => (
                    <div
                        id={`hour-marker-${i}`}
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
                <div
                    id="hour-indicator"
                    className={`absolute w-full z-10`}
                    style={{
                        top: `calc(${milliseconds}/(24 * 1000 * 60 * 60) * var(--column-height))`,
                    }}
                >
                    <div className="absolute -top-2 flex h-4 w-10 flex-shrink-0 text-xs items-center justify-center text-nowrap text-white bg-dark px-2 rounded-xs">
                        {meridiem(new Date().getHours(), new Date().getMinutes(), false)}
                    </div>
                    <div className="border-b-2 border-dark w-full"></div>
                </div>
            </div>
        </div>
    );
}

export default CalendarComponent;