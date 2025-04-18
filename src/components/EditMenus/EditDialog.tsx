import DateField from "@components/layout/DateField";
import NewTagField from "@components/layout/NewTagField";
import { Dialog, DialogPanel, DialogBackdrop } from "@headlessui/react";

import { useEditDialogStore } from "@/store/EditDialogStore";
import { DialogType } from "@/store/EditDialogStore";
import useCalendarStore from "@/store/calendarStore";

import { Task } from "@/classes/thing/Thing";
import { months } from "@/utils/timeString";

export default function EditDialog() {
    const editDialogStore = useEditDialogStore();
    const thingType = editDialogStore.type;
    const close = editDialogStore.close;
    const updateCalendar = useCalendarStore.getState().updateCalendar;

    const handleSave = () => {
        const data = editDialogStore.data;

        if (thingType === DialogType.Task) {
            const name = (document.getElementById("name") as HTMLInputElement)
                .value;
            const days =
                parseInt(
                    (
                        document.getElementById(
                            "duration-days"
                        ) as HTMLInputElement
                    ).value
                ) || 0;
            const hours =
                parseInt(
                    (
                        document.getElementById(
                            "duration-hours"
                        ) as HTMLInputElement
                    ).value
                ) || 0;
            const minutes =
                parseInt(
                    (
                        document.getElementById(
                            "duration-minutes"
                        ) as HTMLInputElement
                    ).value
                ) || 0;
            const description = (
                document.getElementById("description") as HTMLTextAreaElement
            ).value;

            // Fix: Use correct date field IDs
            const year1 = (
                document.getElementById("date-year-1") as HTMLInputElement
            ).value;
            const month1 = (
                months.indexOf(
                    (
                        document.getElementById(
                            "date-month-1"
                        ) as HTMLInputElement
                    ).value
                ) + 1
            ).toString();
            const day1 = (
                document.getElementById("date-day-1") as HTMLInputElement
            ).value;
            const pm1 =
                (document.getElementById("date-pm-1") as HTMLInputElement)
                    .value === "true";
            let hour1 = parseInt(
                (document.getElementById("date-hour-1") as HTMLInputElement)
                    .value
            );
            if (hour1 === 12) hour1 = 0;
            if (pm1) hour1 += 12;
            const minute1 = (
                document.getElementById("date-minute-1") as HTMLInputElement
            ).value;

            const dueDate = new Date(
                `${year1}-${month1.padStart(2, "0")}-${day1.padStart(
                    2,
                    "0"
                )}T${hour1.toString().padStart(2, "0")}:${minute1.padStart(
                    2,
                    "0"
                )}`
            ).getTime();

            const duration =
                (days * 24 * 60 + hours * 60 + minutes) * 60 * 1000;

            data.setName(name);
            data.setDuration(duration);
            data.setDescription(description);
            (data as Task).setDueDate(dueDate);
        } else if (thingType === DialogType.Event) {
            const name = (
                document.getElementById("event-name") as HTMLInputElement
            ).value;
            const description = (
                document.getElementById(
                    "event-description"
                ) as HTMLTextAreaElement
            ).value;
            const startTime = new Date(
                (
                    document.getElementById("event-start") as HTMLInputElement
                ).value
            ).getTime();
            const endTime = new Date(
                (document.getElementById("event-end") as HTMLInputElement).value
            ).getTime();

            data.setName(name);
            data.setDescription(description);
            data.setStartTime(startTime);
            data.setDuration(endTime - startTime);
        } else if (thingType === DialogType.TagBlock) {
            const description = (
                document.getElementById(
                    "tagblock-description"
                ) as HTMLTextAreaElement
            ).value;
            const startTime = new Date(
                (document.getElementById("1") as HTMLInputElement).value
            ).getTime();
            const endTime = new Date(
                (document.getElementById("2") as HTMLInputElement).value
            ).getTime();

            data.setDescription(description);
            data.setStartTime(startTime);
            data.setDuration(endTime - startTime);
        }

        updateCalendar();
        close();
    };

    return (
        <Dialog
            open={useEditDialogStore().isOpen}
            onClose={useEditDialogStore().close}
            className="relative z-10"
        >
            <DialogBackdrop className="fixed inset-0 backdrop-blur-sm" />
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex h-full justify-center p-0">
                    <DialogPanel
                        className="relative flex flex-col gap-2 overflow-hidden rounded-lg bg-off-white text-left shadow-xl w-[650px] h-fit p-3"
                        style={{ top: "10%" }}
                    >
                        <div className="flex justify-between items-center">
                            <h1 className="font-bold text-2xl">
                                Edit {thingType === DialogType.Task && "Task"}
                                {thingType === DialogType.Event && "Event"}
                                {thingType === DialogType.TagBlock &&
                                    "Tag Block"}
                            </h1>
                            <div className="flex gap-2">
                                <button
                                    onClick={close}
                                    className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                        {thingType === DialogType.Task && <EditTask />}
                        {thingType === DialogType.Event && <EditEvent />}
                        {thingType === DialogType.TagBlock && <EditTagBlock />}
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
}

function EditTask() {
    const data = useEditDialogStore().data;
    const duration = data.getDuration(); // duration in ms
    const days = Math.floor(duration / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
        (duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));

    return (
        <div className="flex flex-row h-fit w-full gap-2">
            <div className="flex flex-col h-fit w-fit gap-2 justify-start">
                <div className="text-right flex items-center justify-end h-10">
                    Name
                </div>
                <div className="text-right flex items-center justify-end h-10">
                    Duration
                </div>
                <div className="text-right flex items-center justify-end h-10">
                    Due Date
                </div>
                <div className="text-right flex justify-end items-start py-1 h-20">
                    Description
                </div>
                <div className="text-right flex items-center justify-end h-10">
                    Tags
                </div>
            </div>
            <div className="flex flex-col h-full w-full gap-2 overflow-hidden">
                {/* Name */}
                <div className="flex rounded-md h-10 bg-white px-2 gap-2">
                    <input
                        id="name"
                        type="text"
                        defaultValue={data.getName()}
                        placeholder="Task Name"
                        className="flex w-full h-full text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm"
                    />
                </div>
                {/* Duration */}
                <div className="text-right h-10 flex flex-row gap-2">
                    <div className="w-full px-2 gap-2 text-right rounded-md bg-white flex truncate">
                        <input
                            id="duration-days"
                            title="duration in days"
                            type="text"
                            defaultValue={days}
                            className="w-full grow text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm flex"
                        />
                        <div className="text-right text-sm flex items-center">
                            Days
                        </div>
                    </div>
                    <div className="w-full px-2 gap-2 text-right rounded-md bg-white flex truncate">
                        <input
                            id="duration-hours"
                            title="duration in hours"
                            type="text"
                            defaultValue={hours}
                            className="w-full grow text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm flex"
                        />
                        <div className="text-right text-sm flex items-center">
                            Hours
                        </div>
                    </div>
                    <div className="w-full px-2 gap-2 text-right rounded-md bg-white flex truncate">
                        <input
                            id="duration-minutes"
                            title="duration in minutes"
                            type="text"
                            defaultValue={minutes}
                            className="w-full grow text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm flex"
                        />
                        <div className="text-right text-sm flex items-center">
                            Minutes
                        </div>
                    </div>
                </div>
                {/* Due Date */}
                <DateField
                    id={"1"}
                    defaultValue={new Date((data as Task).getDueDate())}
                />
                {/* Description */}
                <div className="text-right h-20 flex flex-row gap-2">
                    <div className="w-full text-right rounded-md bg-white text-wrap">
                        <textarea
                            id="description"
                            defaultValue={data.getDescription()}
                            placeholder="Description"
                            className="w-full h-full text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm resize-none overflow-y-auto p-2"
                        />
                    </div>
                </div>
                {/* Tag */}
                <NewTagField initialTags={data.getTags()} />
            </div>
        </div>
    );
}

function EditEvent() {
    const data = useEditDialogStore().data;

    return (
        <div className="flex flex-row h-fit w-full gap-2">
            <div className="flex flex-col h-fit w-fit gap-2 justify-start">
                <div className="text-right flex items-center justify-end h-10">
                    Name
                </div>
                <div className="text-right flex items-center justify-end h-10">
                    Start Time
                </div>
                <div className="text-right flex items-center justify-end h-10">
                    End Time
                </div>
                <div className="text-right flex justify-end items-start py-1 h-20">
                    Description
                </div>
                <div className="text-right flex items-center justify-end h-10">
                    Tags
                </div>
            </div>
            <div className="flex flex-col h-full w-full gap-2 overflow-hidden">
                {/* Name */}
                <div className="flex rounded-md h-10 bg-white px-2 gap-2">
                    <input
                        id="event-name"
                        type="text"
                        defaultValue={data.getName()}
                        placeholder="Event Name"
                        className="flex w-full h-full text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm"
                    />
                </div>
                {/* Start Time */}
                <DateField
                    id={"event-start"}
                    defaultValue={new Date(data.getStartTime())}
                />
                {/* End Time */}
                <DateField
                    id={"event-end"}
                    defaultValue={new Date(data.getEndTime())}
                />
                {/* Description */}
                <div className="text-right h-20 flex flex-row gap-2">
                    <div className="w-full text-right rounded-md bg-white text-wrap">
                        <textarea
                            id="event-description"
                            defaultValue={data.getDescription()}
                            placeholder="Description"
                            className="w-full h-full text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm resize-none overflow-y-auto p-2"
                        />
                    </div>
                </div>
                {/* Tag */}
                <NewTagField initialTags={data.getTags()} />
            </div>
        </div>
    );
}

function EditTagBlock() {
    const data = useEditDialogStore().data;

    return (
        <div className="flex flex-row h-fit w-full gap-2">
            <div className="flex flex-col h-fit w-fit gap-2 justify-start">
                <div className="text-right flex items-center justify-end h-10">
                    Start Time
                </div>
                <div className="text-right flex items-center justify-end h-10">
                    End Time
                </div>
                <div className="text-right flex justify-end items-start py-1 h-20">
                    Description
                </div>
                <div className="text-right flex items-center justify-end h-10">
                    Tags
                </div>
            </div>
            <div className="flex flex-col h-full w-full gap-2 overflow-hidden">
                {/* Start Time */}
                <DateField
                    id={"1"}
                    defaultValue={new Date(data.getStartTime())}
                />
                {/* End Time */}
                <DateField
                    id={"2"}
                    defaultValue={new Date(data.getEndTime())}
                />
                {/* Description */}
                <div className="text-right h-20 flex flex-row gap-2">
                    <div className="w-full text-right rounded-md bg-white text-wrap">
                        <textarea
                            id="tagblock-description"
                            defaultValue={data.getDescription()}
                            placeholder="Description"
                            className="w-full h-full text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm resize-none overflow-y-auto p-2"
                        />
                    </div>
                </div>
                {/* Tag */}
                <NewTagField initialTags={data.getTags()} />
            </div>
        </div>
    );
}
