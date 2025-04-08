import { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { Plus } from "lucide-react";
import { useCreateDialogStore } from "@/store/TitleBarStore";
import useCalendarStore from "@/store/calendarStore";
import { Task } from "@/classes/thing/Thing";

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
        if (calendarStore === undefined) {
            console.log("Calendar store is undefined");
            return;
        }
        const now = new Date();
        switch (activeMenu) {
            case Menu.Task:
                const name = (document.getElementById("task-name") as HTMLInputElement).value;
                const durationDays = (document.getElementById("task-duration-days") as HTMLInputElement).valueAsNumber;
                const durationHours = (document.getElementById("task-duration-hours") as HTMLInputElement).valueAsNumber;
                const durationMinutes = (document.getElementById("task-duration-minutes") as HTMLInputElement).valueAsNumber;
                const dueYear = (document.getElementById("task-due-year") as HTMLInputElement).value;
                const dueMonth = (document.getElementById("task-due-month") as HTMLInputElement).value;
                const dueDay = (document.getElementById("task-due-day") as HTMLInputElement).value;
                const dueHour = (document.getElementById("task-due-hour") as HTMLInputElement).value;
                const dueMinute = (document.getElementById("task-due-minute") as HTMLInputElement).value;
                const description = (document.getElementById("task-description") as HTMLTextAreaElement).value;
                const dueDateText = `${(dueYear || now.getFullYear())}-${(dueMonth || now.getMonth() + 1).toString().padStart(2, '0')}-${(dueDay || now.getDate()).toString().padStart(2, '0')}T${(dueHour || "24").padStart(2, '0')}:${(dueMinute || "0").padStart(2, '0')}`;
                console.log(dueDateText);
                const task = new Task(
                    name,
                    (durationDays || 0) * 86400000 + (durationHours || 1) * 3600000 + (durationMinutes || 0) * 60000,
                    new Date(dueDateText).getTime(),
                    undefined,
                    description,
                    []
                );
                calendarStore.addThing(task);
                close();
                break;
            case Menu.Event:
                // Handle event creation logic here
                break;
            case Menu.TagBlock:
                // Handle tag block creation logic here
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
                        id="task-name"
                        type="text"
                        placeholder="Task Name"
                        className="flex w-full h-full text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm"
                    />

                </div>
                {/* Duration */}
                <div className="text-right h-10 flex flex-row gap-2">
                    <div className="w-full px-2 gap-2 text-right rounded-md bg-white flex truncate">
                        <input
                            id="task-duration-days"
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
                            id="task-duration-hours"
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
                            id="task-duration-minutes"
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
                            id="task-due-year"
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
                            id="task-due-month"
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
                            id="task-due-day"
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
                            id="task-due-hour"
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
                            id="task-due-minute"
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
                            id="task-description"
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
                        id="event-name"
                        type="text"
                        placeholder="Event Name"
                        className="flex w-full h-full text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm"
                    />
                </div>
                {/* Starts */}
                <div className="text-right h-10 flex flex-row gap-2">
                    <div className="w-full px-2 gap-2 text-right rounded-md bg-white flex truncate">
                        <input

                            id="event-start-year"
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
                            id="event-start-month"
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
                            id="event-start-day"
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
                            id="event-start-hour"
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
                            id="event-start-minute"
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
                            id="event-end-year"
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
                            id="event-end-month"
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
                            id="event-end-day"
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
                            id="event-end-hour"
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
                            id="event-end-minute"
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
                            id="event-description"
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
                            id="tag-block-start-year"
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
                            id="tag-block-start-month"
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
                            id="tag-block-start-day"
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
                            id="tag-block-start-hour"
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
                            id="tag-block-start-minute"
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
                            id="tag-block-end-year"
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
                            id="tag-block-end-month"
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
                            id="tag-block-end-day"
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
                            id="tag-block-end-hour"
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
                            id="tag-block-end-minute"
                            type="text"
                            placeholder="0"
                            className="w-full grow text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm flex"
                        />
                        <div className="text-right text-sm flex items-center">
                            Minute
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}