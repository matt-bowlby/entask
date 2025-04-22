import { useState, useEffect } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import DateField from "@/components/layout/DateField";

import { useCreateDialogStore, Menu } from "@/store/TitleBarStore";
import useCalendarStore from "@/store/calendarStore";
import { useTagsArrayStore } from "@/store/TagsArrayStore";

import { Task, Event } from "@/classes/thing/Thing";
import TagBlock from "@/classes/tag/TagBlock";
import Tag from "@/classes/tag/Tag";

import { months } from "@/utils/timeString";
import { motion, useAnimation } from "framer-motion";
import ErrorMessage from "../items/ErrorMessage";
import { useStore } from "zustand";
import TagField, { ChooseTagField, TagBlockTagField } from "./NewTagField";
import { useCreateTagMenuStore } from "./NewTagField";

export default function CreateNewComponent() {
    const { isOpen, close, type, setType } = useCreateDialogStore();
    const { setTagMenuOpen } = useCreateTagMenuStore();
    const tagsStore = useTagsArrayStore();
    const calendarStore = useCalendarStore();

    const [errorMessage, setErrorMessage] = useState<string>("");

    const panelAnimation = useAnimation();
    const backdropAnimation = useAnimation();
    const taskTitleAnimation = useAnimation();
    const eventTitleAnimation = useAnimation();
    const tagBlockTitleAnimation = useAnimation();

    const handleCreate = () => {
        if (calendarStore === undefined) return;
        setErrorMessage("");

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

        if (date2.getTime() < date1 && type !== Menu.Task) {
            setErrorMessage("End date cannot be before start date.");
            return;
        }

        // Get description (All components have a description)
        const description: string = (
            document.getElementById("description") as HTMLTextAreaElement
        ).value;

        // Get tags (All components have tags)
        const tags = tagsStore.tags as Tag[];

        // Create and add new thing to calendar
        switch (type) {
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
                    setErrorMessage("Tag Block must have a tag.");
                    return;
                } else if (date2.getTime() - date1 < 30 * 60 * 1000) {
                    setErrorMessage(
                        "Tag Block must be at least 30 minutes long."
                    );
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
            setErrorMessage("");
        }, 300);
    };

    useEffect(() => {
        if (isOpen) {
            const id = setTimeout(() => {
                if (type) {
                    setType(type); // Set the initial menu type
                }else {
                    setType(Menu.Task); // Default to Task if type is undefined
                }
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
                handleCreate();
            }
        };

        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    useEffect(() => {
        switch (type) {
            case Menu.Task:
                taskTitleAnimation.start({
                    backgroundColor: "var(--color-dark)",
                    color: "#ffffff",
                    transition: { duration: 0.2 },
                });
                eventTitleAnimation.start({
                    backgroundColor: "#ffffff",
                    color: "var(--color-dark)",
                    transition: { duration: 0.2 },
                });
                tagBlockTitleAnimation.start({
                    backgroundColor: "#ffffff",
                    color: "var(--color-dark)",
                    transition: { duration: 0.2 },
                });
                break;
            case Menu.Event:
                taskTitleAnimation.start({
                    backgroundColor: "#ffffff",
                    color: "var(--color-dark)",
                    transition: { duration: 0.2 },
                });
                eventTitleAnimation.start({
                    backgroundColor: "var(--color-dark)",
                    color: "#ffffff",
                    transition: { duration: 0.2 },
                });
                tagBlockTitleAnimation.start({
                    backgroundColor: "#ffffff",
                    color: "var(--color-dark)",
                    transition: { duration: 0.2 },
                });
                break;
            case Menu.TagBlock:
                taskTitleAnimation.start({
                    backgroundColor: "#ffffff",
                    color: "var(--color-dark)",
                    transition: { duration: 0.2 },
                });
                eventTitleAnimation.start({
                    backgroundColor: "#ffffff",
                    color: "var(--color-dark)",
                    transition: { duration: 0.2 },
                });
                tagBlockTitleAnimation.start({
                    backgroundColor: "var(--color-dark)",
                    color: "#ffffff",
                    transition: { duration: 0.2 },
                });
                break;
        }
        setErrorMessage(""); // Reset error message when changing type
        tagsStore.setTags([]); // Clear tags when changing type
        setTagMenuOpen(false); // Close tag menu if it was open
    }, [type])

    return (
        <Dialog
            open={isOpen}
            onClose={handleClose}
            className="relative z-10"
            static
        >
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
                        className="relative flex flex-col gap-2 overflow-hidden rounded-xl bg-off-white text-left shadow-xl w-[650px] h-fit"
                        style={{ top: "10%" }}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={panelAnimation}
                    >
                        {/* Dialog Content */}
                        <div className="bg-white drop-shadow-md flex justify-between p-2 gap-2 flex-shrink-0">
                            <motion.button
                                type="button"
                                onClick={() => setType(Menu.Task)}
                                className={
                                    type === Menu.Task
                                        ? "h-16 bg-dark text-white font-semibold w-full text-xl rounded-md"
                                        : "h-16 bg-white text-dark font-semibold w-full text-xl rounded-md cursor-pointer"
                                }
                                initial={{ backgroundColor: "#ffffff", color: "var(--color-dark)" }}
                                animate={taskTitleAnimation}
                            >
                                Task
                            </motion.button>
                            <motion.button
                                type="button"
                                onClick={() => setType(Menu.Event)}
                                className={
                                    type === Menu.Event
                                        ? "h-16 bg-dark text-white font-semibold w-full text-xl rounded-md"
                                        : "h-16 bg-white text-dark font-semibold w-full text-xl rounded-md cursor-pointer"
                                }
                                initial={{ backgroundColor: "#ffffff", color: "var(--color-dark)" }}
                                animate={eventTitleAnimation}
                            >
                                Event
                            </motion.button>
                            <motion.button
                                type="button"
                                onClick={() => setType(Menu.TagBlock)}
                                className={
                                    type === Menu.TagBlock
                                        ? "h-16 bg-dark text-white font-semibold w-full text-xl rounded-md"
                                        : "h-16 bg-white text-dark font-semibold w-full text-xl rounded-md cursor-pointer"
                                }
                                initial={{ backgroundColor: "#ffffff", color: "var(--color-dark)" }}
                                animate={tagBlockTitleAnimation}
                            >
                                Tag Block
                            </motion.button>
                        </div>
                        <div className="h-full max-h-full p-2 flex">
                            {type === Menu.Task && <CreateTaskDialog />}
                            {type === Menu.Event && <CreateEventDialog />}
                            {type === Menu.TagBlock && (
                                <CreateTagBlockDialog />
                            )}
                        </div>
                        <div className="flex flex-row h-fit p-2 w-full gap-2 justify-end items-center">
                            {errorMessage ? (
                                <ErrorMessage
                                    message={errorMessage}
                                    className="flex w-full h-fit p-2 items-center justify-end"
                                />
                            ) : null}
                            <motion.button
                                className="h-10 w-20 bg-white text-dark rounded-md flex items-center justify-center cursor-pointer flex-shrink-0"
                                onClick={handleClose}
                                initial={{ scale: 1 }}
                                animate={{ scale: 1 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ duration: 0.15 }}
                            >
                                Cancel
                            </motion.button>
                            <motion.button
                                className="h-10 w-20 bg-dark text-white rounded-md flex items-center justify-center cursor-pointer flex-shrink-0"
                                onClick={handleCreate}
                                initial={{ scale: 1 }}
                                animate={{ scale: 1 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ duration: 0.15 }}
                            >
                                Create
                            </motion.button>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
}

const CreateTaskDialog = () => {
    const numericInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Allow only numeric input
        const value = e.target.value.replace(/[^0-9]/g, "");
        e.target.value = value;
    };
    const { addTag } = useTagsArrayStore();
    const { isOpen, setTagMenuOpen } = useStore(useCreateTagMenuStore);

    const handleAddTag = (tag: Tag) => {
        addTag(tag);
        setTagMenuOpen(false);
    };

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
                            onChange={numericInputHandler}
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
                            onChange={numericInputHandler}
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
                            onChange={numericInputHandler}
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
                <div className="flex flex-col h-fit w-full gap-2">
                    <TagField />
                    {isOpen ? <ChooseTagField onAddTag={handleAddTag} /> : null}
                </div>
            </div>
        </div>
    );
};

const CreateEventDialog = () => {
    const { addTag } = useTagsArrayStore();
    const { isOpen, setTagMenuOpen } = useStore(useCreateTagMenuStore);

    const handleAddTag = (tag: Tag) => {
        addTag(tag);
        setTagMenuOpen(false);
    };

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
                <div className="flex flex-col h-fit w-full gap-2">
                    <TagField />
                    {isOpen ? <ChooseTagField onAddTag={handleAddTag} /> : null}
                </div>
            </div>
        </div>
    );
};

const CreateTagBlockDialog = () => {
    const { addTag, setTags } = useTagsArrayStore();
    const { isOpen, setTagMenuOpen } = useStore(useCreateTagMenuStore);

    const handleAddTag = (tag: Tag) => {
        setTags([]); // Clear existing tags to avoid duplicates
        addTag(tag);
        setTagMenuOpen(false);
    };

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
                <div className={`text-right flex items-center justify-end h-10`}>Tag</div>
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
                <div className="flex flex-col h-fit w-full gap-2">
                    <TagBlockTagField />
                    {isOpen ? <ChooseTagField onAddTag={handleAddTag} /> : null}
                </div>
            </div>
        </div>
    );
};

