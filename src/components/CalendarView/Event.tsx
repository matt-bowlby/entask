interface Event {
    title: string;
    startTime: number;
    duration: number;
}

export default function Event({ title, startTime, duration }: Event) {
    return (
        <div
            className="absolute left-0 right-0 w-full bg-orange-100 rounded-lg"
            style={{ height: `${25 * duration}vh`, top: `${25 * startTime}vh` }}
        >
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="text-xl">{startTime}</p>
        </div>
    );
}
