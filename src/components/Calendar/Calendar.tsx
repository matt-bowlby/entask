import Day from "@/components/Calendar/Day";
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
        <section className="bg-dark p-4 h-[95vh] grow overflow-hidden">
            <div className="bg-off-white h-full rounded-3xl"></div>
        </section>
    );
}
