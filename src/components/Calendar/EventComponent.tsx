import { Event } from "@/classes/thing/Thing";

interface EventProps {
    event: Event;
}

export default function EventComponent({ event }: EventProps) {
    const date = new Date(event.startTime);

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
                    50 * date.getHours() +
                    50 * minutesAsPercent(date.getMinutes())
                }px`,
                height: `${msToHours(event.getDuration()) * 50}px`,
            }}
        >
            <h1 className="font-black font-2xl">{event.name}</h1>
            <p className="text-xs">{event.description}</p>
            {event.completed ? (
                <div className="h-8 w-8 absolute right-0 bottom-0">✅</div>
            ) : (
                <div className="h-8 w-8 absolute right-0 bottom-0">❌</div>
            )}
        </div>
    );
}
