import { CalendarDays } from "lucide-react";
import DayLabel from "@/components/Calendar/DayLabel";
import Event from "@/components/Calendar/Event";
import { useState } from "react";

export default function Calendar() {
    const today = new Date();
    today.setMinutes(0);
    const tmw = new Date(today.setDate(today.getDay() + 1));
    tmw.setMinutes(0);

    // example events, setEvents not used since they're just examples
    const [events, setEvents] = useState([
        {
            name: "Morning Run",
            completed: false,
            description: "A refreshing 5K run in the park.",
            startTime: today.setHours(6),
            duration: 3600000,
        },
        {
            name: "Team Meeting",
            completed: true,
            description: "Weekly sync-up with the development team.",
            startTime: today.setHours(10),
            duration: 5400000,
        },
        {
            name: "Lunch with Sarah",
            completed: false,
            description: "Catching up over sushi.",
            startTime: today.setHours(12),
            duration: 3600000,
        },
    ]);

    const dayNames = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

    const weekDays = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(today.getDate() + i); // Handles month and year transitions automatically
        return { name: dayNames[date.getDay()], num: date.getDate() };
    });

    const timeSlots = Array.from({ length: 24 }, (_, i) => {
        const hour = i;
        return `${hour > 12 || i === 0 ? Math.abs(hour - 12) : hour}:00 ${
            hour >= 12 ? "PM" : "AM"
        }`;
    });
    return (
        <section id="calendar" className="bg-dark p-4 h-[95vh] grow">
            <div className="bg-off-white h-full rounded-3xl flex flex-col overflow-hidden">
                <div
                    id="calendar-header"
                    className="w-full bg-white h-[120px] flex flex-row items-center pl-4 rounded-3xl drop-shadow-md"
                >
                    <CalendarDays size={200} strokeWidth={1.25} />
                    <DayLabel num={15} name="Thu" selected={true} />
                    <DayLabel num={16} name="Fri" selected={false} />
                    <DayLabel num={17} name="Sat" selected={false} />
                    <DayLabel num={18} name="Sun" selected={false} />
                    <DayLabel num={19} name="Mon" selected={false} />
                </div>
                <div
                    id="calendar-body"
                    className="flex pl-4 py-4 overflow-y-scroll [scrollbar-width:none] relative"
                >
                    <div className="w-full absolute flex flex-row items-center">
                        <p className="absolute text-sm">9AM</p>
                        <div className="absolute w-6xl bg-indigo-400 h-[2px] -top-[1.5px] left-9"></div>
                    </div>

                    <div className="w-full absolute flex flex-row items-center top-[100px]">
                        <p className="absolute text-sm">10AM</p>
                        <div className="absolute w-6xl bg-indigo-400 h-[2px] -top-[1.5px] left-9"></div>
                    </div>
                    <div className="w-[200px]"></div>

                    <div className="flex flex-col gap-2 w-full mx-[10px] h-[1200px] outline-1"></div>
                    <div className="flex flex-col gap-2 w-full mx-[10px] h-[1200px] outline-1"></div>
                    <div className="flex flex-col gap-2 w-full mx-[10px] h-[1200px] outline-1"></div>
                    <div className="flex flex-col gap-2 w-full mx-[10px] h-[1200px] outline-1"></div>
                    <div className="flex flex-col gap-2 w-full mx-[10px] h-[1200px] outline-1"></div>
                </div>
            </div>
        </section>
    );
}
