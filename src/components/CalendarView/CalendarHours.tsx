export default function CalendarHours() {
    return (
        <div id="hours" className="grid grid-cols-7 overflow-y-scroll h-[80vh]">
            {Array.from({ length: 7 }, (_, k) => (
                <div className="bg-red-300 border-r-2 h-[600vh]">HI!</div>
            ))}
            <h1>the end</h1>
        </div>
    );
}
