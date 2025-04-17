import DateField from "@components/layout/DateField";
import NewTagField from "@components/layout/NewTagField";
import { Dialog, DialogPanel, DialogBackdrop } from "@headlessui/react";

import { useEditDialogStore } from "@/store/EditDialogStore";
import { DialogType } from "@/store/EditDialogStore";

export default function EditDialog() {
    const thingType = useEditDialogStore().type;
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
                        <h1 className="font-bold text-2xl">
                            Edit
                            {thingType === DialogType.Task && "Task"}
                            {thingType === DialogType.Event && "Event"}
                            {thingType === DialogType.TagBlock && "Tag Block"}
                        </h1>

                        <EditTask />
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
                        value={data.getName()}
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
                            value={days}
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
                            value={hours}
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
                            value={minutes}
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
                            value={data.getDescription()}
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
}
