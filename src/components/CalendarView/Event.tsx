interface EventProps {
    name: string;
    completed: boolean;
    description: string;
    startTime: number;
    duration: number;
}

export default function Event({
    name,
    completed,
    description,
    startTime,
    duration,
}: EventProps) {
    const date = new Date(startTime);

    function msToHours(milliseconds: number) {
        return milliseconds / (1000 * 60 * 60);
    }
    function minutesAsPercent(hours: number) {
        return hours / 60;
    }

    return (
        <div
            className="bg-cyan-100 rounded-lg absolute left-0 right-0 flex-col p-2"
            style={{
                top: `${
                    12 * date.getHours() +
                    12 * minutesAsPercent(date.getMinutes()) +
                    10
                }vh`,
                height: `${msToHours(duration) * 12}vh`,
            }}
        >
            <h1 className="font-black font-2xl">{name}</h1>
            <p className="text-xs">{description}</p>
            {completed ? (
                <div className="h-8 w-8 absolute right-0 bottom-0">✅</div>
            ) : (
                <div className="h-8 w-8 absolute right-0 bottom-0">❌</div>
            )}
        </div>
    );
}
