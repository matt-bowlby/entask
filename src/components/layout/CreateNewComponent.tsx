import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import DateField from "@/components/layout/DateField";
import NewTagField from "./NewTagField";

import { useCreateDialogStore } from "@/store/TitleBarStore";
import useCalendarStore from "@/store/calendarStore";
import { useTagsArrayStore } from "@/store/TagsArrayStore";
import { useState } from "react";

import { Task, Event } from "@/classes/thing/Thing";
import TagBlock from "@/classes/tag/TagBlock";
import Tag from "@/classes/tag/Tag";

import { months } from "@/utils/timeString";

enum Menu {
    Task,
    Event,
    TagBlock,
}

export default function CreateNewComponent() {
    const { isOpen, close } = useCreateDialogStore();
    const tagsStore = useTagsArrayStore();
    const calendarStore = useCalendarStore();
    const [activeMenu, setActiveMenu] = useState<Menu>(Menu.Task);

    // const [useTagsArrayStore, setuseTagsArrayStore] = useState<Tag[]>([]);

    const handleCreate = () => {
        if (calendarStore === undefined) return;

        // Get name, if applicable (Tag Blocks don't have names)
        let name: string = "";
        if (document.getElementById("name"))
            name = (document.getElementById("name") as HTMLInputElement).value;

        // Get date1 (All components have a date1)
        const year1: string = (
            document.getElementById("date-year-1") as HTMLInputElement
        ).value;
        const month1: string = (
            months.indexOf(
                (document.getElementById("date-month-1") as HTMLInputElement)
                    .value
            ) + 1
        ).toString();
        const day1: string = (
            document.getElementById("date-day-1") as HTMLInputElement
        ).value;
        const pm1: boolean =
            (document.getElementById("date-pm-1") as HTMLInputElement).value ===
            "true";
        let hour1: number = parseInt(
            (document.getElementById("date-hour-1") as HTMLInputElement).value
        );
        if (hour1 === 12) hour1 = 0;
        if (pm1) hour1 += 12;
        const minute1: string = (
            document.getElementById("date-minute-1") as HTMLInputElement
        ).value;
        const date1: number = new Date(
            `${year1}-${month1.padStart(2, "0")}-${day1.padStart(
                2,
                "0"
            )}T${hour1.toString().padStart(2, "0")}:${minute1.padStart(2, "0")}`
        ).getTime();

        // Get date2 (Only events and tag blocks have date2)
        let date2: Date = new Date();
        if (document.getElementById("date-year-2")) {
            const year2: string = (
                document.getElementById("date-year-2") as HTMLInputElement
            ).value;
            const month2: number =
                months.indexOf(
                    (
                        document.getElementById(
                            "date-month-2"
                        ) as HTMLInputElement
                    ).value
                ) + 1;
            const day2: string = (
                document.getElementById("date-day-2") as HTMLInputElement
            ).value;

            const pm2: boolean =
                (document.getElementById("date-pm-2") as HTMLInputElement)
                    .value === "true";
            let hour2: number = parseInt(
                (document.getElementById("date-hour-2") as HTMLInputElement)
                    .value
            );
            if (hour2 === 12) hour2 = 0;
            if (pm2) hour2 += 12;

            const minute2: string = (
                document.getElementById("date-minute-2") as HTMLInputElement
            ).value;
            date2 = new Date(
                `${year2}-${month2.toString().padStart(2, "0")}-${day2.padStart(
                    2,
                    "0"
                )}T${hour2.toString().padStart(2, "0")}:${minute2.padStart(
                    2,
                    "0"
                )}`
            );
            // If second date is set to be 12 AM, it can be assumed they mean the end of the day
            // and not the start
            if (hour2 === 0 && !pm2) date2.setDate(date2.getDate() + 1);
        }

        // Get description (All components have a description)
        const description: string = (
            document.getElementById("description") as HTMLTextAreaElement
        ).value;

        // Get tags (All components have tags)
        const tags = tagsStore.tags as Tag[];

        // Create and add new thing to calendar
        switch (activeMenu) {
            case Menu.Task: {
                // Only tasks have durations
                const durationDays =
                    parseInt(
                        (
                            document.getElementById(
                                "duration-days"
                            ) as HTMLInputElement
                        ).value
                    ) || 0;
                const durationHours =
                    parseInt(
                        (
                            document.getElementById(
                                "duration-hours"
                            ) as HTMLInputElement
                        ).value
                    ) || 1;
                const durationMinutes =
                    parseInt(
                        (
                            document.getElementById(
                                "duration-minutes"
                            ) as HTMLInputElement
                        ).value
                    ) || 0;
                const task = new Task(
                    name,
                    durationDays * 86400000 +
                        durationHours * 3600000 +
                        durationMinutes * 60000,
                    date1,
                    undefined,
                    description,
                    tags
                );
                calendarStore.addThing(task);

                break;
            }
            case Menu.Event: {
                const event = new Event(
                    name,
                    date2.getTime() - date1,
                    date1,
                    description,
                    tags
                );
                calendarStore.addThing(event);
                break;
            }
            case Menu.TagBlock: {
                if (tags.length === 0) {
                    console.log("No tags selected for tag block.");
                    return;
                }
                const tagBlock = new TagBlock(
                    date2.getTime() - date1,
                    date1,
                    description,
                    tags
                );
                calendarStore.addThing(tagBlock);
                break;
            }
        }
        close();
        tagsStore.setTags([]);
    };

    return (
        <Dialog open={isOpen} onClose={close} className="relative z-10">
            <DialogBackdrop className="fixed inset-0 backdrop-blur-sm" />
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex h-full justify-center p-0">
                    <DialogPanel
                        className="relative flex flex-col gap-2 overflow-hidden rounded-lg bg-off-white text-left shadow-xl w-[650px] h-fit"
                        style={{ top: "10%" }}
                    >
                        {/* Dialog Content */}
                        <div className="bg-white drop-shadow-md flex justify-between p-2 gap-2 flex-shrink-0">
                            <button
                                type="button"
                                onClick={() => setActiveMenu(Menu.Task)}
                                className={
                                    activeMenu === Menu.Task
                                        ? "h-16 bg-dark text-white font-semibold w-full text-xl rounded-md"
                                        : "h-16 bg-white text-dark font-semibold w-full text-xl rounded-md cursor-pointer"
                                }
                            >
                                Task
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveMenu(Menu.Event)}
                                className={
                                    activeMenu === Menu.Event
                                        ? "h-16 bg-dark text-white font-semibold w-full text-xl rounded-md"
                                        : "h-16 bg-white text-dark font-semibold w-full text-xl rounded-md cursor-pointer"
                                }
                            >
                                Event
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveMenu(Menu.TagBlock)}
                                className={
                                    activeMenu === Menu.TagBlock
                                        ? "h-16 bg-dark text-white font-semibold w-full text-xl rounded-md"
                                        : "h-16 bg-white text-dark font-semibold w-full text-xl rounded-md cursor-pointer"
                                }
                            >
                                Tag Block
                            </button>
                        </div>
                        <div className="h-full max-h-full p-2 flex">
                            {activeMenu === Menu.Task && <CreateTaskDialog />}
                            {activeMenu === Menu.Event && <CreateEventDialog />}
                            {activeMenu === Menu.TagBlock && (
                                <CreateTagBlockDialog />
                            )}
                        </div>
                        <div className="flex flex-row h-fit p-2 w-full gap-2 justify-end items-center">
                            <button
                                className="h-10 w-20 bg-white text-dark rounded-md flex items-center justify-center cursor-pointer"
                                onClick={close}
                            >
                                Cancel
                            </button>
                            <button
                                className="h-10 w-20 bg-dark text-white rounded-md flex items-center justify-center cursor-pointer"
                                onClick={handleCreate}
                            >
                                Create
                            </button>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
}

const CreateTaskDialog = () => {
    return (
        <div className="flex flex-row h-fit w-full gap-2">
            <div className="flex flex-col h-fit w-fit gap-2 justify-start">
                <div
                    className={`text-right flex items-center justify-end h-10`}
                >
                    Name
                </div>
                <div
                    className={`text-right flex items-center justify-end h-10`}
                >
                    Duration
                </div>
                <div
                    className={`text-right flex items-center justify-end h-10`}
                >
                    Due Date
                </div>
                <div
                    className={`text-right flex justify-end items-start py-1 h-20`}
                >
                    Description
                </div>
                <div
                    className={`text-right flex items-center justify-end h-10`}
                >
                    Tags
                </div>
            </div>
            <div className="flex flex-col h-full w-full gap-2 overflow-hidden">
                {/* Name */}
                <div className="flex rounded-md h-10 bg-white px-2 gap-2">
                    <input
                        id="name"
                        type="text"
                        placeholder="Task Name"
                        className="flex w-full h-full text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm"
                    />
                </div>
                {/* Duration */}
                <div className="text-right h-10 flex flex-row gap-2">
                    <div className="w-full px-2 gap-2 text-right rounded-md bg-white flex truncate">
                        <input
                            id="duration-days"
                            type="text"
                            placeholder="0"
                            className="w-full grow text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm flex"
                        />
                        <div className="text-right text-sm flex items-center">
                            Days
                        </div>
                    </div>
                    <div className="w-full px-2 gap-2 text-right rounded-md bg-white flex truncate">
                        <input
                            id="duration-hours"
                            type="text"
                            placeholder="1"
                            className="w-full grow text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm flex"
                        />
                        <div className="text-right text-sm flex items-center">
                            Hours
                        </div>
                    </div>

                    <div className="w-full px-2 gap-2 text-right rounded-md bg-white flex truncate">
                        <input
                            id="duration-minutes"
                            type="text"
                            placeholder="0"
                            className="w-full grow text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm flex"
                        />
                        <div className="text-right text-sm flex items-center">
                            Minutes
                        </div>
                    </div>
                </div>
                {/* Due Date */}
                <DateField id={"1"} />
                {/* Description */}
                <div className="text-right h-20 flex flex-row gap-2">
                    <div className="w-full text-right rounded-md bg-white text-wrap">
                        <textarea
                            id="description"
                            placeholder="Description"
                            className="w-full h-full text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm resize-none overflow-y-auto p-2"
                        />
                    </div>
                </div>
                {/* Tag */}
                <NewTagField />
            </div>
        </div>
    );
};

const CreateEventDialog = () => {
    return (
        <div className="flex flex-row h-fit w-full gap-2">
            <div className="flex flex-col h-fit w-fit gap-2 justify-start">
                <div
                    className={`text-right flex items-center justify-end h-10`}
                >
                    Name
                </div>
                <div
                    className={`text-right flex items-center justify-end h-10`}
                >
                    Start Time
                </div>
                <div
                    className={`text-right flex items-center justify-end h-10`}
                >
                    End Time
                </div>
                <div
                    className={`text-right flex justify-end items-start py-1 h-20`}
                >
                    Description
                </div>
                <div
                    className={`text-right flex items-center justify-end h-10`}
                >
                    Tags
                </div>
            </div>
            <div className="flex flex-col h-full w-full gap-2 overflow-hidden">
                {/* Name */}
                <div className="flex rounded-md h-10 bg-white px-2 gap-2">
                    <input
                        id="name"
                        type="text"
                        placeholder="Event Name"
                        className="flex w-full h-full text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm"
                    />
                </div>
                {/* Starts */}
                <DateField id={"1"} />
                {/* Ends */}
                <DateField id={"2"} />
                {/* Description */}
                <div className="text-right h-20 flex flex-row gap-2">
                    <div className="w-full text-right rounded-md bg-white text-wrap">
                        <textarea
                            id="description"
                            placeholder="Description"
                            className="w-full h-full text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm resize-none overflow-y-auto p-2"
                        />
                    </div>
                </div>
                {/* Tag */}
                <NewTagField />
            </div>
        </div>
    );
};

const CreateTagBlockDialog = () => {
    return (
        <div className="flex flex-row h-fit w-full gap-2">
            <div className="flex flex-col h-fit w-fit gap-2 justify-start">
                <div
                    className={`text-right flex items-center justify-end h-10`}
                >
                    Start Time
                </div>
                <div
                    className={`text-right flex items-center justify-end h-10`}
                >
                    End Time
                </div>
                <div
                    className={`text-right flex justify-end items-start py-1 h-20`}
                >
                    Description
                </div>
                <div
                    className={`text-right flex items-center justify-end h-10`}
                >
                    Tags
                </div>
            </div>
            <div className="flex flex-col h-full w-full gap-2 overflow-hidden">
                {/* Starts */}
                <DateField id={"1"} />
                {/* Ends */}
                <DateField id={"2"} />
                {/* Description */}
                <div className="text-right h-20 flex flex-row gap-2">
                    <div className="w-full text-right rounded-md bg-white text-wrap">
                        <textarea
                            id="description"
                            placeholder="Description"
                            className="w-full h-full text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm resize-none overflow-y-auto p-2"
                        />
                    </div>
                </div>
                {/* Tag */}
                <NewTagField />
            </div>
        </div>
    );
};
