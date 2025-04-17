import { Event } from "@/classes/thing/Thing";
import { meridiem } from "@/utils/timeString";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface EventProps {
    event: Event;
}

export default function EventComponent({ event }: EventProps) {
    const startTime = new Date(event.getStartTime());
    const endTime = new Date(event.getEndTime());
    const dayStart = new Date(startTime);
    dayStart.setHours(0, 0, 0, 0);

    const root = document.documentElement;
    const columnHeight = parseFloat(getComputedStyle(root).getPropertyValue('--column-height'));

    const top: number = ((event.getStartTime() - dayStart.getTime()) / (24 * 1000 * 60 * 60)) * columnHeight;
    const height: number = (event.getDuration() / (24 * 1000 * 60 * 60)) * columnHeight;

    const containerRef = useRef<HTMLDivElement>(null);
    const descriptionTextRef = useRef<HTMLParagraphElement>(null);

    const [isDescriptionVisible, setIsDescriptionVisible] = useState(true);

    useEffect(() => {
        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach(entry => {
                // Set visibility to true only if the element is fully visible
                setIsDescriptionVisible(entry.intersectionRatio >= 0.6);
            });
        };

        const observer = new IntersectionObserver(observerCallback, {
            root: containerRef.current?.parentElement, // Observe within the parent container
            threshold: 0.6, // Fully visible
        });

        if (descriptionTextRef.current) {
            observer.observe(descriptionTextRef.current);
        }

        return () => {
            if (descriptionTextRef.current) {
                observer.unobserve(descriptionTextRef.current);
            }
        };
    }, []);

    // Abbreviated event for short duration (less than 45 minutes)
    if (event.getDuration() < 40 * 60 * 1000) {
        return (
            <motion.div
                className="bg-white rounded-md absolute left-0 right-0 flex-col px-2 overflow-hidden items-center justify-center"
                style={{
                    top: `${top}px`,
                    height: `${height}px`,
                }}
                initial={{
                    scale: 1,
                    filter: "drop-shadow(0px 3px 3px rgba(0, 0, 0, 0.2))",
                }}
                animate={{
                    scale: 1,
                    filter: "drop-shadow(0px 3px 3px rgba(0, 0, 0, 0.2))"
                }}
                whileTap={{
                    scale: 0.98,
                }}
                whileHover={{
                    filter: "drop-shadow(0px 3px 4px rgba(0, 0, 0, 0.4))"
                }}
                transition={{ duration: 0.15 }}

            >
                <div className="flex flex-row justify-between items-center h-full w-full overflow-hidden">
                    <div className="flex flex-col justify-center items-start h-full flex-shrink overflow-hidden">
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
            </motion.div>
        );
    }

    // Non-abbreviated event
    return (
        <motion.div
            className="absolute flex flex-col bg-white rounded-xl gap-1 left-0 right-0 p-2 overflow-clip"
            style={{
                top: `${top}px`,
                height: `${height}px`,
            }}
            ref={containerRef}
            initial={{
                scale: 1,
                filter: "drop-shadow(0px 3px 3px rgba(0, 0, 0, 0.2))",
            }}
            animate={{
                scale: 1,
                filter: "drop-shadow(0px 3px 3px rgba(0, 0, 0, 0.2))"
            }}
            whileTap={{
                scale: 0.98,
            }}
            whileHover={{
                filter: "drop-shadow(0px 3px 4px rgba(0, 0, 0, 0.4))"
            }}
            transition={{ duration: 0.15 }}
        >
            <div className="flex flex-row h-2 w-full rounded-full overflow-hidden flex-shrink-0">
                {event.getTags().length === 0 ? (
                    <div className="w-full h-2 bg-dark flex-shrink-0" />
                ) : (
                    event.getTags().map((tag, i) => (
                        <div
                            key={i}
                            className="w-full h-2"
                            style={{ backgroundColor: `#${tag.getColor()}` }}
                        />
                    ))
                )}
            </div>
            <div className="flex flex-col w-full overflow-auto [scrollbar-width:none]">
                <div className="flex flex-col justify-center items-center w-full overflow-hidden h-fit flex-shrink-0">
                    <h1 className="font-bold text-dark text-sm w-full text-ellipsis whitespace-nowrap overflow-hidden">{event.getName()}</h1>
                </div>

                <div className="flex flex-col w-full">
                    <p
                        id="hour-text"
                        className="text-sm"
                    >
                        {`${meridiem(startTime.getHours(), startTime.getMinutes())} - ${meridiem(endTime.getHours(), endTime.getMinutes())}`}
                    </p>
                    {isDescriptionVisible && (
                        <p
                            id="description-text"
                            ref={descriptionTextRef}
                            className="text-xs text-dark"
                        >
                            {event.getDescription()}
                        </p>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
