import { Event } from "@/classes/thing/Thing";
import { meridiem } from "@/utils/timeString";

interface EventProps {
    event: Event;
}

export default function EventComponent({ event }: EventProps) {
    const startTime = new Date(event.getStartTime());
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const root = document.documentElement;
    const columnHeight = parseFloat(getComputedStyle(root).getPropertyValue('--column-height'));

    const top: number = ((event.getStartTime() - today.getTime()) / (24 * 1000 * 60 * 60)) * columnHeight;
    const height: number = (event.getDuration() / (24 * 1000 * 60 * 60)) * columnHeight;

    if (height > 64)
        return (
            <div
                className="absolute flex flex-row bg-white rounded-xl gap-2 drop-shadow-md left-0 right-0 p-2 overflow-clip justify-between"
                style={{
                    top: `${top}px`,
                    height: `${height}px`,
                }}
            >
                <div className="flex flex-col flex-shrink overflow-hidden">
                    <div className="flex flex-col justify-center items-center w-full overflow-hidden h-fit flex-shrink-0">
                        <h1 className="font-bold text-dark text-sm w-full text-ellipsis whitespace-nowrap overflow-hidden">{event.getName()}</h1>
                    </div>

                    <div>
                        <p className="text-sm">{`${meridiem(startTime.getHours(), startTime.getMinutes())}`}</p>
                        <p className="text-xs text-dark">{event.getDescription()}</p>
                    </div>
                </div>
                <div className="flex flex-col w-2 h-full rounded-full overflow-hidden flex-shrink-0">
                    {
                    event.getTags().length === 0 ? (
                        <div className="h-full w-2 bg-dark flex-shrink-0"/>
                    ) : (
                        event.getTags().map((tag, i) => (
                            <div
                                key={i}
                                className="h-full w-2"
                                style={{ backgroundColor: `#${tag.getColor()}` }}
                            />
                        ))
                    )
                    }
                </div>
            </div>
        );

    // Abbereviated event for short duration (less than 45 minutes)
    return (
        <div
            className="bg-white rounded-md drop-shadow-md absolute left-0 right-0 flex-col px-2 overflow-hidden items-center justify-center"
            style={{
                top: `${top}px`,
                height: `${height}px`,
            }}
        >
            <div className="flex flex-row justify-between items-center h-full w-full">
                <div className="flex flex-row justify-start items-center h-full flex-shrink overflow-hidden">
                    <h1 className="font-bold text-dark text-sm w-full text-ellipsis overflow-hidden whitespace-nowrap">{event.getName()}</h1>
                </div>
                <div className="flex flex-row h-2 gap-1 w-auto rounded-full overflow-hidden flex-shrink-0">
                {
                event.getTags().length === 0 ? (
                    <div className="w-2 h-full bg-dark"></div>
                ) : (
                    event.getTags().map((tag, i) => (
                        <div
                            key={i}
                            className="w-2 h-full rounded-full"
                            style={{ backgroundColor: `#${tag.getColor()}` }}
                        />
                    ))
                )
                }
                </div>
            </div>
        </div>
    );
}
