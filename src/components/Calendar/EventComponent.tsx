import { Event } from "@/classes/thing/Thing";

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

    if (event.getDuration() > 1000 * 60 * 30)
        return (
            <div
                className="absolute flex flex-row bg-white rounded-xl gap-2 drop-shadow-md left-0 right-0 p-2 overflow-clip"
                style={{
                    top: `${top}px`,
                    height: `${height}px`,
                }}
            >
                <div className="flex flex-col w-fit h-full rounded-full overflow-hidden">
                    {
                    event.getTags().length === 0 ? (
                        <div className="h-full w-2 bg-dark"/>
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
                <div className="flex flex-col">
                    <div className="flex flex-col justify-center items-center">
                        <h1 className="font-bold text-dark text-sm w-full">{event.getName()}</h1>
                    </div>

                    <div>
                        <p className="text-sm">{startTime.getHours()}</p>
                        <p className="text-xs text-dark overflow-ellipsis">{event.getDescription()}</p>
                    </div>
                </div>
            </div>
        );

    return (
        <div
            className="bg-white rounded-md drop-shadow-md absolute left-0 right-0 flex-col px-2 overflow-auto [scrollbar-width:none]"
            style={{
                top: `${top}px`,
                height: `${height}px`,
            }}
        >
            <div className="flex flex-row justify-between items-center">
                <h1 className="font-bold text-dark text-sm overflow-ellipsis">{event.getName()}</h1>
                <div className="flex flex-row h-2 gap-1 w-auto rounded-full overflow-hidden">
                {
                event.getTags().length === 0 ? (
                    <div className="h-full bg-dark"></div>
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

            <div>
                <p className="text-sm overflow-ellipsis">{startTime.getHours()}</p>
                <p className="text-xs text-dark overflow-ellipsis">{event.getDescription()}</p>
            </div>
        </div>
    );
}
