import DateField from "@components/layout/DateField";
import TagField, {
    ChooseTagField,
    TagBlockTagField,
    useCreateTagMenuStore,
} from "@components/layout/NewTagField";
import { Dialog, DialogPanel, DialogBackdrop } from "@headlessui/react";
import { Trash2 } from "lucide-react";

import { useEditDialogStore } from "@/store/EditDialogStore";
import { DialogType } from "@/store/EditDialogStore";
import useCalendarStore from "@/store/calendarStore";

import { Task } from "@/classes/thing/Thing";
import { useTagsArrayStore } from "@/store/TagsArrayStore";

import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import Tag from "@/classes/tag/Tag";

export default function EditDialog() {
    const tagsStore = useTagsArrayStore();
    const editDialogStore = useEditDialogStore();
    const thingType = editDialogStore.type;
    const { isOpen, close } = useEditDialogStore();
    const backdropAnimation = useAnimation();
    const panelAnimation = useAnimation();
    const updateCalendar = useCalendarStore.getState().updateCalendar;

    const handleSave = () => {
        const data = editDialogStore.data;

        if (thingType === DialogType.Task) {
            const name = (document.getElementById("name") as HTMLInputElement).value;
            const days =
                parseInt((document.getElementById("duration-days") as HTMLInputElement).value) || 0;
            const hours =
                parseInt((document.getElementById("duration-hours") as HTMLInputElement).value) ||
                0;
            const minutes =
                parseInt((document.getElementById("duration-minutes") as HTMLInputElement).value) ||
                0;
            const description = (document.getElementById("description") as HTMLTextAreaElement)
                .value;

            const date1 = (document.getElementById("date-1") as HTMLInputElement).value;
            const pm1 = (document.getElementById("date-pm-1") as HTMLInputElement).value === "true";
            let hour1 = parseInt(
                (document.getElementById("date-hour-1") as HTMLInputElement).value
            );
            if (hour1 === 12) hour1 = 0;
            if (pm1) hour1 += 12;
            const minute1 = (document.getElementById("date-minute-1") as HTMLInputElement).value;

            const dueDate = new Date(
                `${date1}T${hour1.toString().padStart(2, "0")}:${minute1.padStart(2, "0")}`
            ).getTime();

            const duration = (days * 24 * 60 + hours * 60 + minutes) * 60 * 1000;

            data.setName(name);
            data.setDuration(duration);
            data.setDescription(description);
            data.setTags(tagsStore.tags);
            (data as Task).setDueDate(dueDate);
        } else if (thingType === DialogType.Event) {
            const name = (document.getElementById("event-name") as HTMLInputElement).value;
            const description = (
                document.getElementById("event-description") as HTMLTextAreaElement
            ).value;

            // Get start time (date1)
            const date1 = (document.getElementById("date-1") as HTMLInputElement).value;
            const pm1 = (document.getElementById("date-pm-1") as HTMLInputElement).value === "true";
            let hour1 = parseInt(
                (document.getElementById("date-hour-1") as HTMLInputElement).value
            );
            if (hour1 === 12) hour1 = 0;
            if (pm1) hour1 += 12;
            const minute1 = (document.getElementById("date-minute-1") as HTMLInputElement).value;

            const startTime = new Date(
                `${date1}T${hour1.toString().padStart(2, "0")}:${minute1.padStart(2, "0")}`
            ).getTime();

            // Get end time (date2)
            const date2 = (document.getElementById("date-2") as HTMLInputElement).value;
            const pm2 = (document.getElementById("date-pm-2") as HTMLInputElement).value === "true";
            let hour2 = parseInt(
                (document.getElementById("date-hour-2") as HTMLInputElement).value
            );
            if (hour2 === 12) hour2 = 0;
            if (pm2) hour2 += 12;
            const minute2 = (document.getElementById("date-minute-2") as HTMLInputElement).value;

            const endTime = new Date(
                `${date2}T${hour2.toString().padStart(2, "0")}:${minute2.padStart(2, "0")}`
            ).getTime();

            data.setName(name);
            data.setDescription(description);
            data.setStartTime(startTime);
            data.setTags(tagsStore.tags);
            data.setDuration(endTime - startTime);
        } else if (thingType === DialogType.TagBlock) {
            const description = (
                document.getElementById("tagblock-description") as HTMLTextAreaElement
            ).value;

            // Get start time (date1)
            const date1 = (document.getElementById("date-1") as HTMLInputElement).value;
            const pm1 = (document.getElementById("date-pm-1") as HTMLInputElement).value === "true";
            let hour1 = parseInt(
                (document.getElementById("date-hour-1") as HTMLInputElement).value
            );
            if (hour1 === 12) hour1 = 0;
            if (pm1) hour1 += 12;
            const minute1 = (document.getElementById("date-minute-1") as HTMLInputElement).value;

            const startTime = new Date(
                `${date1}T${hour1.toString().padStart(2, "0")}:${minute1.padStart(2, "0")}`
            ).getTime();

            // Get end time (date2)
            const date2 = (document.getElementById("date-2") as HTMLInputElement).value;
            const pm2 = (document.getElementById("date-pm-2") as HTMLInputElement).value === "true";
            let hour2 = parseInt(
                (document.getElementById("date-hour-2") as HTMLInputElement).value
            );
            if (hour2 === 12) hour2 = 0;
            if (pm2) hour2 += 12;
            const minute2 = (document.getElementById("date-minute-2") as HTMLInputElement).value;

            const endTime = new Date(
                `${date2}T${hour2.toString().padStart(2, "0")}:${minute2.padStart(2, "0")}`
            ).getTime();

            data.setDescription(description);
            data.setStartTime(startTime);
            data.setDuration(endTime - startTime);
            data.setTags(tagsStore.tags);
        }

        updateCalendar();
        handleClose();
    };

    const handleClose = () => {
        backdropAnimation.start({ opacity: 0, transition: { duration: 0.3 } });
        panelAnimation.start({
            scale: 0.9,
            opacity: 0,
            transition: { duration: 0.3, ease: "backIn" },
        });
        setTimeout(() => {
            close();
            tagsStore.setTags([]);
            // setErrorMessage("");
        }, 300);
    };

    useEffect(() => {
        if (isOpen) {
            const id = setTimeout(() => {
                backdropAnimation.start({
                    opacity: 1,
                    transition: { duration: 0.3 },
                });
                panelAnimation.start({
                    scale: 1,
                    opacity: 1,
                    transition: { duration: 0.3, ease: "backOut" },
                });
            }, 1);

            return () => clearTimeout(id);
        }
    }, [isOpen]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key == "Enter") {
                e.preventDefault();
                if (!isOpen) return;
                handleSave();
            } else if (e.key === "Delete") {
                e.preventDefault();
                if (!isOpen) return;
                useCalendarStore.getState().removeThing(editDialogStore.data);
                updateCalendar();
                handleClose();
            }
        };

        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [isOpen, editDialogStore.data, tagsStore.tags]);

    return (
        <Dialog open={isOpen} onClose={handleClose} className="relative z-10">
            <DialogBackdrop
                as={motion.div}
                className="fixed inset-0 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={backdropAnimation}
            />
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex h-full justify-center p-0">
                    <DialogPanel
                        as={motion.div}
                        className="relative flex flex-col gap-2 overflow-hidden rounded-lg bg-off-white text-left shadow-xl w-[650px] h-fit"
                        style={{ top: "10%" }}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={panelAnimation}
                    >
                        <h1 className="flex font-bold text-2xl p-2 bg-white items-center justify-center drop-shadow-md">
                            Edit {thingType === DialogType.Task && "Task"}
                            {thingType === DialogType.Event && "Event"}
                            {thingType === DialogType.TagBlock && "Tag Block"}
                        </h1>

                        {thingType === DialogType.Task && <EditTask />}
                        {thingType === DialogType.Event && <EditEvent />}
                        {thingType === DialogType.TagBlock && <EditTagBlock />}

                        <div className="flex justify-between gap-2 border-t border-gray-200 p-2">
                            <motion.button
                                onClick={() => {
                                    useCalendarStore.getState().removeThing(editDialogStore.data);
                                    updateCalendar();
                                    handleClose();
                                }}
                                title="Delete"
                                className="p-2 text-red-400 hover:text-white hover:bg-red-400 rounded-md transition-colors text-sm flex items-center gap-2 cursor-pointer"
                                initial={{ scale: 1 }}
                                animate={{ scale: 1 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ duration: 0.15 }}
                            >
                                <Trash2 size={24} />
                            </motion.button>
                            <div className="flex gap-2">
                                <motion.button
                                    onClick={handleClose}
                                    className="px-4 py-2 rounded-md bg-white transition-colors text-sm"
                                    initial={{ scale: 1 }}
                                    animate={{ scale: 1 }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    onClick={handleSave}
                                    className="px-4 py-2 rounded-md bg-dark text-white transition-colors text-sm"
                                    initial={{ scale: 1 }}
                                    animate={{ scale: 1 }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    Save
                                </motion.button>
                            </div>
                        </div>
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
    const hours = Math.floor((duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));

    const { isOpen, setTagMenuOpen } = useCreateTagMenuStore();
    const addTag = useTagsArrayStore((state) => state.addTag);

    const handleAddTag = (tag: Tag) => {
        addTag(tag);
        setTagMenuOpen(false);
    };

    return (
        <div className="flex flex-row h-fit w-full gap-2 p-2">
            <div className="flex flex-col h-fit w-fit gap-2 justify-start">
                <div className="text-right flex items-center justify-end h-10">Name</div>
                <div className="text-right flex items-center justify-end h-10">Duration</div>
                <div className="text-right flex items-center justify-end h-10">Due Date</div>
                <div className="text-right flex justify-end items-start py-1 h-20">Description</div>
                <div className="text-right flex items-center justify-end h-10">Tags</div>
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
                        <div className="text-right text-sm flex items-center">Days</div>
                    </div>
                    <div className="w-full px-2 gap-2 text-right rounded-md bg-white flex truncate">
                        <input
                            id="duration-hours"
                            title="duration in hours"
                            type="text"
                            defaultValue={hours}
                            className="w-full grow text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm flex"
                        />
                        <div className="text-right text-sm flex items-center">Hours</div>
                    </div>
                    <div className="w-full px-2 gap-2 text-right rounded-md bg-white flex truncate">
                        <input
                            id="duration-minutes"
                            title="duration in minutes"
                            type="text"
                            defaultValue={minutes}
                            className="w-full grow text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm flex"
                        />
                        <div className="text-right text-sm flex items-center">Minutes</div>
                    </div>
                </div>
                {/* Due Date */}
                <DateField id={"1"} defaultValue={new Date((data as Task).getDueDate())} />
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
                <div className="flex flex-col h-fit w-full gap-2">
                    <TagField initialTags={data.getTags()} />
                    {isOpen ? <ChooseTagField onAddTag={handleAddTag} /> : null}
                </div>
            </div>
        </div>
    );
}

function EditEvent() {
    const data = useEditDialogStore().data;

    const { isOpen, setTagMenuOpen } = useCreateTagMenuStore();
    const addTag = useTagsArrayStore((state) => state.addTag);

    const handleAddTag = (tag: Tag) => {
        addTag(tag);
        setTagMenuOpen(false);
    };

    return (
        <div className="flex flex-row h-fit w-full gap-2 p-2">
            <div className="flex flex-col h-fit w-fit gap-2 justify-start">
                <div className="text-right flex items-center justify-end h-10">Name</div>
                <div className="text-right flex items-center justify-end h-10">Start Time</div>
                <div className="text-right flex items-center justify-end h-10">End Time</div>
                <div className="text-right flex justify-end items-start py-1 h-20">Description</div>
                <div className="text-right flex items-center justify-end h-10">Tags</div>
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
                <DateField id={"1"} defaultValue={new Date(data.getStartTime())} />
                {/* End Time */}
                <DateField id={"2"} defaultValue={new Date(data.getEndTime())} />
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
                <div className="flex flex-col h-fit w-full gap-2">
                    <TagField initialTags={data.getTags()} />
                    {isOpen ? <ChooseTagField onAddTag={handleAddTag} /> : null}
                </div>
            </div>
        </div>
    );
}

function EditTagBlock() {
    const data = useEditDialogStore().data;

    const { isOpen, setTagMenuOpen } = useCreateTagMenuStore();
    const { addTag, clear } = useTagsArrayStore((state) => state);

    const handleAddTag = (tag: Tag) => {
        clear();
        addTag(tag);
        setTagMenuOpen(false);
    };

    return (
        <div className="flex flex-row h-fit w-full gap-2 p-2">
            <div className="flex flex-col h-fit w-fit gap-2 justify-start">
                <div className="text-right flex items-center justify-end h-10">Start Time</div>
                <div className="text-right flex items-center justify-end h-10">End Time</div>
                <div className="text-right flex justify-end items-start py-1 h-20">Description</div>
                <div className="text-right flex items-center justify-end h-10">Tags</div>
            </div>
            <div className="flex flex-col h-full w-full gap-2 overflow-hidden">
                {/* Start Time */}
                <DateField id={"1"} defaultValue={new Date(data.getStartTime())} />
                {/* End Time */}
                <DateField id={"2"} defaultValue={new Date(data.getEndTime())} />
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
                <div className="flex flex-col h-fit w-full gap-2">
                    <TagBlockTagField initialTags={data.getTags()} />
                    {isOpen ? <ChooseTagField onAddTag={handleAddTag} /> : null}
                </div>
            </div>
        </div>
    );
}
