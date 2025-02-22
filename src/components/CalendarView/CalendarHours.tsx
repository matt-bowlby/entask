export default function CalendarHours() {
    return (
        <>
            {/* NOTE: this div NEEDS a specified height in order for overflow-y-scroll to work  */}
            <div
                id="hours"
                className="grid grid-cols-7 overflow-y-scroll h-[80vh] relative"
            >
                {/* The hour lines behind the events */}
                <div className="absolute h-[600vh] w-full">
                    {Array.from({ length: 24 }, (_, k) => (
                        <div
                            key={k}
                            className="absolute flex ml-4 left-0 right-0 items-center text-amber-600 gap-x-3"
                            style={{ top: `${25 * k}vh` }}
                        >
                            {/* There might be issues here of the contents being so tall that it actually misaligns the events in the calendar */}
                            <span>{k + 1}</span>
                            <div className="h-[2px] w-full bg-amber-600"></div>
                        </div>
                    ))}
                </div>

                {/* The columns that hold the events */}
                {Array.from({ length: 7 }, (_, k) => (
                    <div
                        key={k}
                        id={`items-col-${k}`}
                        className="border-r-2 h-[600vh] z-10"
                    ></div>
                ))}
            </div>
        </>
    );
}
