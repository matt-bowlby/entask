import { CalendarDays } from "lucide-react";
import { useMemo, useEffect } from "react";
import useCalendarStore, { useScrollStore } from "@/store/calendarStore";
import { meridiem } from "@/utils/timeString";
import DayLabel from "@/components/Calendar/DayLabelComponent";
import EventComponent from "@/components/Calendar/CalendarEventComponent";
import { useNowStore } from "../updater/Updater";
import CalendarTagBlock from "./CalendarTagBlock";

const CalendarComponent = () => {
    const now = useNowStore((state) => state.now);
    const offset = useCalendarStore((state) => state.offset);
    const numDaysInView = useCalendarStore((state) => state.numDaysInView);
    const getDatesInView = useCalendarStore((state) => state.getDatesInView);

    const scrollStore = useScrollStore();

    const { dates } = useMemo(() => {
        return { dates: getDatesInView(now) };
    }, [getDatesInView, now, offset, numDaysInView]);

    useEffect(() => {
        scrollStore.resetScrollTop();
    }, [new Date(now).getHours()]);

    return (
        <section id="calendar" className="bg-dark grow">
            <div className="bg-off-white h-full rounded-xl flex flex-col overflow-hidden">
                <CalendarHeader />
                <div
                    id="calendar-body"
                    className="flex p-2 pt-4 gap-2 overflow-y-scroll [scrollbar-width:none] relative"
                >
                    <HourMarkers />
                    <div className="w-10 flex-shrink-0 h-column-height"></div>
                    <div className="flex flex-row gap-2 w-full">
                        {Array.from({ length: numDaysInView }, (_, i) => {
                            return <CalendarDay key={i} date={dates[i]} />;
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

const CalendarHeader = () => {
    const now = useNowStore((state) => state.now);
    const { offset, numDaysInView, getDatesInView } = useCalendarStore();

    const { dates } = useMemo(() => {
        return { dates: getDatesInView(now) };
    }, [getDatesInView, now, offset, numDaysInView]);

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
};

interface CalendarDayProps {
    date: Date;
}
const CalendarDay = ({ date }: CalendarDayProps) => {
    const calendar = useCalendarStore().calendar;
    if (calendar === undefined) return <></>;

    const events = calendar.getActiveThings().filter((thing) => {
        if (thing.getStartTime() !== 0) {
            return (
                thing.getStartTime() >= date.getTime() &&
                thing.getStartTime() < date.getTime() + 24 * 60 * 60 * 1000
            );
        }
    });
    const tagBlocks = calendar.getTagBlocks().filter((tagBlock) => {
        if (tagBlock.getStartTime() !== 0) {
            return (
                tagBlock.getStartTime() >= date.getTime() &&
                tagBlock.getStartTime() < date.getTime() + 24 * 60 * 60 * 1000
            );
        }
    });

    return (
        <div className="flex flex-col w-full h-column-height relative">
            {tagBlocks.map((item, j) => {
                return <CalendarTagBlock tagBlock={item} key={j} />;
            })}
            {events.map((item, j) => {
                return <EventComponent event={item} key={j} />;
            })}
        </div>
    );
};

function HourMarkers() {
    const { now } = useNowStore();
    const timeSlots = Array.from({ length: 25 }, (_, i) => {
        return meridiem(i, 0, true, false);
    });
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const milliseconds = now - startOfDay.getTime();

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
                        {meridiem(
                            new Date().getHours(),
                            new Date().getMinutes(),
                            false
                        )}
                    </div>
                    <div className="border-b-2 border-dark w-full rounded-full"></div>
                </div>
            </div>
        </div>
    );
}

export default CalendarComponent;
