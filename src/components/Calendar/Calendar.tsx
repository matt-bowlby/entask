import { CalendarDays } from "lucide-react";
import DayLabel from "@/components/Calendar/DayLabel";
import Event from "@/components/Calendar/Event";
import { useState } from "react";
import HourMarkers from "./HourMarkers";

interface Calendar {
    numDaysInView: number;
}


export default function Calendar( { numDaysInView = 5 }: Calendar ) {
    const dates: Array<Date> = [];
    for (let i = 0; i < numDaysInView; i++) {
        dates.push(new Date(Date.now() + i * 24 * 60 * 60 * 1000));
    }

    // example events, setEvents not used since they're just examples
    const [events, setEvents] = useState([
        {
            name: "Morning Run",
            completed: false,
            description: "A refreshing 5K run in the park.",
            startTime: dates[0].setHours(6),
            duration: 3600000,
        },
        {
            name: "Team Meeting",
            completed: true,
            description: "Weekly sync-up with the development team.",
            startTime: dates[0].setHours(10),
            duration: 5400000,
        },
        {
            name: "Lunch with Sarah",
            completed: false,
            description: "Catching up over sushi.",
            startTime: dates[0].setHours(12),
            duration: 3600000,
        },
    ]);

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
                        <DayLabel date={dates[0]} />
                        <DayLabel date={dates[1]} />
                        <DayLabel date={dates[2]} />
                        <DayLabel date={dates[3]} />
                        <DayLabel date={dates[4]} />
                    </div>
                </div>
                <div
                    id="calendar-body"
                    className="flex p-2 overflow-y-scroll [scrollbar-width:none] relative"
                >
                    <div className="w-16 flex-shrink-0 h-column-height"></div>
                    <div className="flex flex-row gap-2 w-full">
                        <div className="flex flex-col w-full h-column-height outline-1"></div>
                        <div className="flex flex-col w-full h-column-height outline-1"></div>
                        <div className="flex flex-col w-full h-column-height outline-1"></div>
                        <div className="flex flex-col w-full h-column-height outline-1"></div>
                        <div className="flex flex-col w-full h-column-height outline-1"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
