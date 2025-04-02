export default function HourMarkers() {
    const timeSlots = Array.from({ length: 24 }, (_, i) => {
        const hour = i;
        return `${hour > 12 || i === 0 ? Math.abs(hour - 12) : hour} ${
            hour >= 12 ? "PM" : "AM"
        }`;
    });
    return (
        <>
            {timeSlots.map((item, i) => (
                <div
                    className="w-full absolute flex flex-row items-center"
                    style={{ top: `calc(var(--column-height)/24 * ${i})` }}
                >
                    <p className="absolute text-sm">{item}</p>
                    <div className="absolute w-[95.4%] bg-indigo-400 h-[1px] -top-[1.5px] left-[3%]"></div>
                </div>
            ))}
        </>
    );
}
