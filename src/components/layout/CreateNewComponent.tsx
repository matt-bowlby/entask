import { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { Plus } from "lucide-react";
import { useCreateDialogStore } from "@/store/TitleBarStore";
import useCalendarStore from "@/store/calendarStore";
import { Task, Event } from "@/classes/thing/Thing";
import TagBlock from "@/classes/tag/TagBlock";

enum Menu {
    Task,
    Event,
    TagBlock,
}

export default function CreateNewComponent() {
    const { isOpen, close } = useCreateDialogStore();
    const calendarStore = useCalendarStore();
    const [activeMenu, setActiveMenu] = useState<Menu>(Menu.Task);

    // const [tagsArray, setTagsArray] = useState<Tag[]>([]);

    const handleCreate = () => {
        if (calendarStore === undefined) return;
        // Get current date
        const now = new Date();

        // Get name, if applicable (Tag Blocks don't have names)
        let name: string = "";
        if (document.getElementById("name"))
            name = (document.getElementById("name") as HTMLInputElement).value;

        // Get date1 (All components have a date1)
        const year1: string = (document.getElementById("date-year-1") as HTMLInputElement).value;
        const month1: string = (document.getElementById("date-month-1") as HTMLInputElement).value;
        const day1: string = (document.getElementById("date-day-1") as HTMLInputElement).value;
        const hour1: string = (document.getElementById("date-hour-1") as HTMLInputElement).value;
        const minute1: string = (document.getElementById("date-minute-1") as HTMLInputElement).value;
        const date1: number = new Date(
            `${(year1 || now.getFullYear())}-${(month1 || now.getMonth() + 1).toString().padStart(2, '0')}-${(day1 || now.getDate()).toString().padStart(2, '0')}T${(hour1 || "0").padStart(2, '0')}:${(minute1 || "0").padStart(2, '0')}`
        ).getTime();
        let date2: number = 0;
        if (document.getElementById("date-year-2")) {
            const year2: string = (document.getElementById("date-year-2") as HTMLInputElement).value;
            const month2: string = (document.getElementById("date-month-2") as HTMLInputElement).value;
            const day2: string = (document.getElementById("date-day-2") as HTMLInputElement).value;
            const hour2: string = (document.getElementById("date-hour-2") as HTMLInputElement).value;
            const minute2: string = (document.getElementById("date-minute-2") as HTMLInputElement).value;
            date2 = new Date(
                `${(year2 || now.getFullYear())}-${(month2 || now.getMonth() + 1).toString().padStart(2, '0')}-${(day2 || now.getDate()).toString().padStart(2, '0')}T${(hour2 || "0").padStart(2, '0')}:${(minute2 || "0").padStart(2, '0')}`
            ).getTime();
        }
        console.log("date1: ", date1);
        console.log("date2: ", date2)
        console.log("duration: ", date2 - date1);

        // Get description (All components have a description)
        const description: string = (document.getElementById("description") as HTMLTextAreaElement).value;


        switch (activeMenu) {
            case Menu.Task:
                // Only tasks have durations
                const durationDays = (document.getElementById("duration-days") as HTMLInputElement).valueAsNumber;
                const durationHours = (document.getElementById("duration-hours") as HTMLInputElement).valueAsNumber;
                const durationMinutes = (document.getElementById("duration-minutes") as HTMLInputElement).valueAsNumber;
                const task = new Task(
                    name,
                    (durationDays || 0) * 86400000 + (durationHours || 1) * 3600000 + (durationMinutes || 0) * 60000,
                    date1,
                    undefined,
                    description,
                    []
                );
                calendarStore.addThing(task);
                close();
                break;
            case Menu.Event:
                const event = new Event(
                    name,
                    date2 - date1,
                    date1,
                    description,
                    []
                );
                calendarStore.addThing(event);
                close();
                break;
            case Menu.TagBlock:
                const tagBlock = new TagBlock(
                    date2 - date1,
                    date1,
                    description,
                    []
                );
                calendarStore.addThing(tagBlock);
                close();
                break;
        }
    }

    return (
        <Dialog open={isOpen} onClose={close} className="relative z-10">

            <DialogBackdrop className="fixed inset-0 backdrop-blur-md" />
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
                                        : "h-16 bg-white text-dark font-semibold w-full text-xl rounded-md"
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
                                        : "h-16 bg-white text-dark font-semibold w-full text-xl rounded-md"
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
                                        : "h-16 bg-white text-dark font-semibold w-full text-xl rounded-md"
                                }
                            >
                                Tag Block
                            </button>
                        </div>
                        <div className="h-full max-h-full p-2 flex">
                            {activeMenu === Menu.Task && <CreateTaskDialog />}
                            {activeMenu === Menu.Event && <CreateEventDialog />}
                            {activeMenu === Menu.TagBlock && <CreateTagBlockDialog />}
                        </div>
                        <div className="flex flex-row h-fit p-2 w-full gap-2 justify-end items-center">
                            <button
                            className="h-10 w-20 bg-white text-dark rounded-md flex items-center justify-center"
                            onClick={close}
                            >
                                Cancel
                            </button>
                            <button
                            className="h-10 w-20 bg-dark text-white rounded-md flex items-center justify-center"
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
    const now = new Date();
    return (
        <div className="flex flex-row h-full w-full items-center gap-2">
            <div className="flex flex-col h-full w-fit gap-2">
                <div className={`text-right flex items-center justify-end h-10`}>
                    Name
                </div>
                <div className={`text-right flex items-center justify-end h-10`}>
                    Duration
                </div>
                <div className={`text-right flex items-center justify-end h-10`}>
                    Due Date
                </div>
                <div className={`text-right flex justify-end items-start py-1 h-40`}>
                    Description
                </div>
                <div className={`text-right flex items-center justify-end h-10`}>
                    Tags
                </div>
            </div>
            <div className="flex flex-col h-full w-full gap-2">
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
                <div className="text-right h-10 flex flex-row gap-2">
                    <div className="w-full px-2 gap-2 text-right rounded-md bg-white flex truncate">
                        <input
                            id="date-year-1"
                            type="text"
                            placeholder={now.getFullYear().toString()}
                            className="w-full grow text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm flex"
                        />
                        <div className="text-right text-sm flex items-center">
                            Year
                        </div>
                    </div>
                    <div className="w-full px-2 gap-2 text-right rounded-md bg-white flex truncate">
                        <input
                            id="date-month-1"
                            type="text"
                            placeholder={(now.getMonth() + 1).toString()}
                            className="w-full grow text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm flex"
                        />
                        <div className="text-right text-sm flex items-center">
                            Month
                        </div>
                    </div>
                    <div className="w-full px-2 gap-2 text-right rounded-md bg-white flex truncate">
                        <input
                            id="date-day-1"
                            type="text"
                            placeholder={now.getDate().toString()}
                            className="w-full grow text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm flex"
                        />
                        <div className="text-right text-sm flex items-center">
                            Day
                        </div>
                    </div>

                    <div className="flex items-center justify-center">:</div>

                    <div className="w-full px-2 gap-2 text-right rounded-md bg-white flex truncate">
                        <input
                            id="date-hour-1"
                            type="text"
                            placeholder="0"
                            className="w-full grow text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm flex"
                        />
                        <div className="text-right text-sm flex items-center">
                            Hour
                        </div>
                    </div>
                    <div className="w-full px-2 gap-2 text-right rounded-md bg-white flex truncate">
                        <input
                            id="date-minute-1"
                            type="text"
                            placeholder="0"
                            className="w-full grow text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm flex"
                        />
                        <div className="text-right text-sm flex items-center">
                            Minute
                        </div>
                    </div>
                </div>
                {/* Description */}
                <div className="text-right h-40 flex flex-row gap-2">
                    <div className="w-full text-right rounded-md bg-white text-wrap">
                        <textarea
                            id="description"
                            placeholder="Description"
                            className="w-full h-full text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm resize-none overflow-y-auto p-2"
                        />
                    </div>
                </div>
                {/* Tag */}
                <div className="flex flex-row h-fit w-full gap-2">
                    <div className="flex w-full items-start gap-2 h-10 bg-white rounded-md">
                    </div>
                    <button className="h-10 w-10 flex-shrink-0 text-dark bg-white rounded-md flex items-center justify-center">
                        <Plus size={20} strokeWidth={1.5} />
                    </button>
                </div>
            </div>

        </div>
    );
}

const CreateEventDialog = () => {
    const now = new Date();
    return (
        <div className="flex flex-row h-full w-full items-center gap-2">
            <div className="flex flex-col h-full w-fit gap-2">
                <div className={`text-right flex items-center justify-end h-10`}>
                    Name
                </div>
                <div className={`text-right flex items-center justify-end h-10`}>
                    Starts
                </div>
                <div className={`text-right flex items-center justify-end h-10`}>
                    Ends
                </div>
                <div className={`text-right flex justify-end items-start py-1 h-40`}>
                    Description
                </div>
                <div className={`text-right flex items-center justify-end h-10`}>
                    Tags
                </div>
            </div>
            <div className="flex flex-col h-full w-full gap-2">
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
                <div className="text-right h-10 flex flex-row gap-2">
                    <div className="w-full px-2 gap-2 text-right rounded-md bg-white flex truncate">
                        <input

                            id="date-year-1"
                            type="text"
                            placeholder={now.getFullYear().toString()}
                            className="w-full grow text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm flex"
                        />
                        <div className="text-right text-sm flex items-center">
                            Year
                        </div>
                    </div>
                    <div className="w-full px-2 gap-2 text-right rounded-md bg-white flex truncate">
                        <input
                            id="date-month-1"
                            type="text"
                            placeholder={(now.getMonth() + 1).toString()}
                            className="w-full grow text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm flex"
                        />
                        <div className="text-right text-sm flex items-center">
                            Month
                        </div>
                    </div>
                    <div className="w-full px-2 gap-2 text-right rounded-md bg-white flex truncate">
                        <input
                            id="date-day-1"
                            type="text"
                            placeholder={now.getDate().toString()}
                            className="w-full grow text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm flex"
                        />
                        <div className="text-right text-sm flex items-center">
                            Day
                        </div>
                    </div>

                    <div className="flex items-center justify-center">:</div>

                    <div className="w-full px-2 gap-2 text-right rounded-md bg-white flex truncate">
                        <input
                            id="date-hour-1"
                            type="text"
                            placeholder="0"
                            className="w-full grow text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm flex"
                        />
                        <div className="text-right text-sm flex items-center">
                            Hour
                        </div>
                    </div>
                    <div className="w-full px-2 gap-2 text-right rounded-md bg-white flex truncate">
                        <input
                            id="date-minute-1"
                            type="text"
                            placeholder="0"
                            className="w-full grow text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm flex"
                        />
                        <div className="text-right text-sm flex items-center">
                            Minute
                        </div>
                    </div>
                </div>
                {/* Ends */}
                <div className="text-right h-10 flex flex-row gap-2">
                    <div className="w-full px-2 gap-2 text-right rounded-md bg-white flex truncate">
                        <input
                            id="date-year-2"
                            type="text"
                            placeholder={now.getFullYear().toString()}
                            className="w-full grow text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm flex"
                        />
                        <div className="text-right text-sm flex items-center">
                            Year
                        </div>
                    </div>
                    <div className="w-full px-2 gap-2 text-right rounded-md bg-white flex truncate">
                        <input
                            id="date-month-2"
                            type="text"
                            placeholder={(now.getMonth() + 1).toString()}
                            className="w-full grow text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm flex"
                        />
                        <div className="text-right text-sm flex items-center">
                            Month
                        </div>
                    </div>
                    <div className="w-full px-2 gap-2 text-right rounded-md bg-white flex truncate">
                        <input
                            id="date-day-2"
                            type="text"
                            placeholder={now.getDate().toString()}
                            className="w-full grow text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm flex"
                        />
                        <div className="text-right text-sm flex items-center">
                            Day
                        </div>
                    </div>

                    <div className="flex items-center justify-center">:</div>

                    <div className="w-full px-2 gap-2 text-right rounded-md bg-white flex truncate">
                        <input
                            id="date-hour-2"
                            type="text"
                            placeholder="0"
                            className="w-full grow text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm flex"
                        />
                        <div className="text-right text-sm flex items-center">
                            Hour
                        </div>
                    </div>
                    <div className="w-full px-2 gap-2 text-right rounded-md bg-white flex truncate">
                        <input
                            id="date-minute-2"
                            type="text"
                            placeholder="0"
                            className="w-full grow text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm flex"
                        />
                        <div className="text-right text-sm flex items-center">
                            Minute
                        </div>
                    </div>
                </div>
                {/* Description */}
                <div className="text-right h-40 flex flex-row gap-2">
                    <div className="w-full text-right rounded-md bg-white text-wrap">
                        <textarea
                            id="description"
                            placeholder="Description"
                            className="w-full h-full text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm resize-none overflow-y-auto p-2"
                        />
                    </div>
                </div>
                {/* Tag */}
                <div className="flex flex-row h-fit w-full gap-2">
                    <div className="flex w-full items-start gap-2 h-10 bg-white rounded-md">
                    </div>
                    <button className="h-10 w-10 flex-shrink-0 text-dark bg-white rounded-md flex items-center justify-center">
                        <Plus size={20} strokeWidth={1.5} />
                    </button>
                </div>
            </div>
        </div>
    );
}

const CreateTagBlockDialog = () => {
    const now = new Date();
    return (
        <div className="flex flex-row h-full w-full items-center gap-2">
            <div className="flex flex-col h-full w-fit gap-2">
                <div className={`text-right flex items-center justify-end h-10`}>
                    Tags
                </div>
                <div className={`text-right flex items-center justify-end h-10`}>
                    Starts
                </div>
                <div className={`text-right flex items-center justify-end h-10`}>
                    Ends
                </div>
                <div className={`text-right flex items-center justify-end h-40`}>
                    Description
                </div>
            </div>
            <div className="flex flex-col h-full w-full gap-2">
                {/* Tag */}
                <div className="flex flex-row h-fit w-full gap-2">
                    <div className="flex w-full items-start gap-2 h-10 bg-white rounded-md">
                    </div>
                    <button className="h-10 w-10 flex-shrink-0 text-dark bg-white rounded-md flex items-center justify-center">
                        <Plus size={20} strokeWidth={1.5} />
                    </button>
                </div>
                {/* Starts */}
                <div className="text-right h-10 flex flex-row gap-2">
                    <div className="w-full px-2 gap-2 text-right rounded-md bg-white flex truncate">
                        <input
                            id="date-year-1"
                            type="text"
                            placeholder={now.getFullYear().toString()}
                            className="w-full grow text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm flex"
                        />
                        <div className="text-right text-sm flex items-center">
                            Year
                        </div>
                    </div>
                    <div className="w-full px-2 gap-2 text-right rounded-md bg-white flex truncate">
                        <input
                            id="date-month-1"
                            type="text"
                            placeholder={(now.getMonth() + 1).toString()}
                            className="w-full grow text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm flex"
                        />
                        <div className="text-right text-sm flex items-center">
                            Month
                        </div>
                    </div>
                    <div className="w-full px-2 gap-2 text-right rounded-md bg-white flex truncate">
                        <input
                            id="date-day-1"
                            type="text"
                            placeholder={now.getDate().toString()}
                            className="w-full grow text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm flex"
                        />
                        <div className="text-right text-sm flex items-center">
                            Day
                        </div>
                    </div>

                    <div className="flex items-center justify-center">:</div>

                    <div className="w-full px-2 gap-2 text-right rounded-md bg-white flex truncate">
                        <input
                            id="date-hour-1"
                            type="text"
                            placeholder="0"
                            className="w-full grow text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm flex"
                        />
                        <div className="text-right text-sm flex items-center">
                            Hour
                        </div>
                    </div>
                    <div className="w-full px-2 gap-2 text-right rounded-md bg-white flex truncate">
                        <input
                            id="date-minute-1"
                            type="text"
                            placeholder="0"
                            className="w-full grow text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm flex"
                        />
                        <div className="text-right text-sm flex items-center">
                            Minute
                        </div>
                    </div>
                </div>
                {/* Ends */}
                <div className="text-right h-10 flex flex-row gap-2">
                    <div className="w-full px-2 gap-2 text-right rounded-md bg-white flex truncate">
                        <input
                            id="date-year-2"
                            type="text"
                            placeholder={now.getFullYear().toString()}
                            className="w-full grow text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm flex"
                        />
                        <div className="text-right text-sm flex items-center">
                            Year
                        </div>
                    </div>
                    <div className="w-full px-2 gap-2 text-right rounded-md bg-white flex truncate">
                        <input
                            id="date-month-2"
                            type="text"
                            placeholder={(now.getMonth() + 1).toString()}
                            className="w-full grow text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm flex"
                        />
                        <div className="text-right text-sm flex items-center">
                            Month
                        </div>
                    </div>
                    <div className="w-full px-2 gap-2 text-right rounded-md bg-white flex truncate">
                        <input
                            id="date-day-2"
                            type="text"
                            placeholder={now.getDate().toString()}
                            className="w-full grow text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm flex"
                        />
                        <div className="text-right text-sm flex items-center">
                            Day
                        </div>
                    </div>

                    <div className="flex items-center justify-center">:</div>

                    <div className="w-full px-2 gap-2 text-right rounded-md bg-white flex truncate">
                        <input
                            id="date-hour-2"
                            type="text"
                            placeholder="0"
                            className="w-full grow text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm flex"
                        />
                        <div className="text-right text-sm flex items-center">
                            Hour
                        </div>
                    </div>
                    <div className="w-full px-2 gap-2 text-right rounded-md bg-white flex truncate">
                        <input
                            id="date-minute-2"
                            type="text"
                            placeholder="0"
                            className="w-full grow text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm flex"
                        />
                        <div className="text-right text-sm flex items-center">
                            Minute
                        </div>
                    </div>
                </div>
                {/* Description */}
                <div className="text-right h-40 flex flex-row gap-2">
                    <div className="w-full text-right rounded-md bg-white text-wrap">
                        <textarea
                            id="description"
                            placeholder="Description"
                            className="w-full h-full text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm resize-none overflow-y-auto p-2"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}