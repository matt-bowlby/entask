import Day from "./Day";
import { useRef, useState } from "react";

export default function CalendarEvents() {
    function handleMouseDown(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        console.log(getTimeFromY(e.clientY, e.currentTarget));

        setIsDragging(true);
    }
    function handleMouseUp(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        setIsDragging(false);
    }
    function getTimeFromY(y: number, fella: HTMLDivElement) {
        console.log(y, fella);
        const goober = fella.getBoundingClientRect();
        return goober.top;
    }

    const gridRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    const weekDays = [
        { name: "mon", num: 3 },
        { name: "tue", num: 4 },
        { name: "wed", num: 5 },
        { name: "thu", num: 6 },
        { name: "fri", num: 7 },
        { name: "sat", num: 8 },
        { name: "sun", num: 9 },
    ];

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
                ref={gridRef}
            >
                <div className="h-full bg-blue-100 flex-col relative">
                    <div className="h-[10vh]"></div>
                    {Array.from({ length: 24 }).map((_, i) => (
                        <p
                            className="absolute right-3 text-xs text-slate-500"
                            style={{ top: `${10 + 12 * (i + 1)}vh` }}
                        >
                            {timeSlots[i]}
                        </p>
                    ))}
                </div>
                {weekDays.map((day) => (
                    <div // one column
                        className="h-[298vh] flex-col bg-blue-200" // add ten vh to height since Day is 10vh tall
                        key={day.num}
                    >
                        <Day num={day.num} name={day.name}></Day>
                        {/* Nested loop to create 24 hour long blocks */}
                        {Array.from({ length: 24 }).map(() =>
                            Array.from(Array(4)).map((_, i) =>
                                // add an hour line if it's the last one in an hour long block
                                i === 3 ? (
                                    <div
                                        onMouseDown={(e) => handleMouseDown(e)}
                                        onMouseUp={(e) => handleMouseUp(e)}
                                        className="h-[3vh] border-b-2 border-r-2 z-10" // Each hour has a height of 12vh, so each 15 minute block is 3vh height
                                    ></div>
                                ) : (
                                    <div
                                        onMouseDown={(e) => handleMouseDown(e)}
                                        onMouseUp={(e) => handleMouseUp(e)}
                                        className="h-[3vh] border-r-2 z-10"
                                    ></div>
                                )
                            )
                        )}
                    </div>
                ))}
            </div>
        </>
    );
}
