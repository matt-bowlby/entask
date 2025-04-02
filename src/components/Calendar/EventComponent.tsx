import { Event } from "@/classes/thing/Thing";

interface EventProps {
    event: Event;
}

export default function EventComponent({ event }: EventProps) {
    const startTime = new Date(event.getStartTime());
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    function msToHours(milliseconds: number) {
        return milliseconds / (1000 * 60 * 60);
    }
    function minutesAsPercent(hours: number) {
        return hours / 60;
    }

    return (
        <div
            className="bg-white rounded-lg absolute left-0 right-0 flex-col p-2 overflow-auto [scrollbar-width:none]"
            style={{
                top: `${
                    ((event.getStartTime() - today.getTime()) / (24 * 1000 * 60 * 60)) * 2000
                }px`,
                height: `${(event.getDuration() / (24 * 1000 * 60 * 60)) * 2000}px`,
            }}
        >
            <div className="flex flex-row h-2 rounded-full overflow-hidden">
                {event.getTags().length === 0 ? (
                        <div className="w-full h-full bg-dark"></div>
                    ) : (
                        event.getTags().map((tag, i) => (
                            <div
                                key={i}
                                className="w-full h-full"
                                style={{ backgroundColor: `#${tag.getColor()}` }}
                            ></div>
                        ))
                )}
            </div>
            <div>
                <h1 className="font-bold text-dark text-sm">{event.getName()}</h1>
                <p className="text-sm">{startTime.getHours()}</p>
                <p className="text-xs text-dark">{event.getDescription()}</p>
            </div>
        </div>
    );
}
