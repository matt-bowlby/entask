import Day from "@/components/Calendar/Day";
import Event from "@/components/Calendar/Event";
import { useState } from "react";

export default function CalendarEvents() {
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
        <>
            {/* This div NEEDS a specified height in order for overflow-y-scroll to work  */}
            {/* The container that holds all the days, views, etc. */}
            <div
                id="calendar"
                className="grid grid-cols-[64px_repeat(7,1fr)] overflow-y-scroll h-[90vh] relative bg-gray-300"
            >
                {/* Hour Text */}
                <div className="h-full bg-blue-100 flex-col relative">
                    <div className="h-[10vh]"></div>
                    {Array.from({ length: 24 }).map((_, i) => (
                        <p
                            className="absolute right-3 text-xs text-slate-500"
                            style={{ top: `${10 + 12 * i}vh` }}
                        >
                            {timeSlots[i]}
                        </p>
                    ))}
                </div>
                {/* Week Days at top */}
                {weekDays.map((day, i) => (
                    <div // one column
                        className="h-[298vh] flex-col bg-blue-200 relative" // add ten vh to height since Day is 10vh tall
                        key={day.num}
                    >
                        <Day num={day.num} name={day.name}></Day>

                        {/* Hour Markers */}
                        {/* Nested loop to create 24 hour long blocks */}
                        {Array.from({ length: 24 }).map(() =>
                            Array.from(Array(4)).map((_, i) =>
                                i === 0 ? ( // add an hour line if it's the last one in an hour long block
                                    <div
                                        className="h-[3vh] border-t-2 border-gray-400" // Each hour has a height of 12vh, so each 15 minute block is 3vh height
                                    ></div>
                                ) : (
                                    <div className="h-[3vh]"></div>
                                )
                            )
                        )}

                        {/* Displaying Events */}
                        {events.map((event) =>
                            weekDays[i].num ===
                            new Date(event.startTime).getDate() ? (
                                <Event
                                    name={event.name}
                                    description={event.description}
                                    duration={event.duration}
                                    completed={event.completed}
                                    startTime={event.startTime}
                                ></Event>
                            ) : (
                                <></>
                            )
                        )}
                    </div>
                ))}
            </div>
        </>
    );
}
