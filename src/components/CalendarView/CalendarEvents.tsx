import Day from "./Day";
export default function CalendarEvents() {
    const weekDays = [
        { name: "mon", num: 3 },
        { name: "tue", num: 4 },
        { name: "wed", num: 5 },
        { name: "thu", num: 6 },
        { name: "fri", num: 7 },
        { name: "sat", num: 8 },
        { name: "sun", num: 9 },
    ];

    const timeSlots = Array.from({ length: 13 }, (_, i) => {
        const hour = i + 7;
        return `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? "PM" : "AM"}`;
    });
    return (
        <>
            {/* This div NEEDS a specified height in order for overflow-y-scroll to work  */}
            <div
                id="calendar"
                className="grid grid-cols-[64px_repeat(7,1fr)] overflow-y-scroll h-[90vh] relative bg-gray-300"
            >
                <div className="h-full bg-blue-100 flex-col relative">
                    <div className="h-[10vh]"></div>
                    {Array.from(Array(24)).map((_, i) => (
                        <p
                            className="absolute right-4"
                            style={{ top: `${10 + 12 * (i + 1)}vh` }}
                        >
                            12
                        </p>
                    ))}
                </div>
                {weekDays.map((day) => (
                    <DayColumn day={day}></DayColumn>
                ))}
            </div>
        </>
    );
}

interface DayColumnProps {
    name: string;
    num: number;
}
function DayColumn({ day }: { day: DayColumnProps }) {
    return (
        <>
            {/* add 10 to overall vh height since the Day is 10vh tall */}
            <div className="h-[298vh] flex-col bg-blue-200">
                {/* The day at the top */}
                <Day num={day.num} name={day.name}></Day>
                {/* Nested loop to create 24 hour long blocks */}
                {/* Each hour has a height of 12vh, so each 15 minute block is 3vh height */}
                {Array.from(Array(24)).map(() =>
                    Array.from(Array(4)).map((_, i) =>
                        i === 3 ? (
                            <div className="h-[3vh] border-b-2"></div>
                        ) : (
                            <div className="h-[3vh]"></div>
                        )
                    )
                )}
            </div>
        </>
    );
}
