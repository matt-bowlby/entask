import { useState, useEffect } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { Plus, X } from "lucide-react";
import { useCreateDialogStore } from "@/store/TitleBarStore";
import useCalendarStore from "@/store/calendarStore";
import { Task, Event } from "@/classes/thing/Thing";
import TagBlock from "@/classes/tag/TagBlock";
import Tag from "@/classes/tag/Tag";
import DropdownMenu from "../items/DropdownMenu";
import { createStore, useStore } from "zustand";
import { getDaysInMonth, months } from "@/utils/timeString";
import { motion, useAnimation } from "framer-motion";

enum Menu {
    Task,
    Event,
    TagBlock,
}

export default function CreateNewComponent() {
    const { isOpen, close } = useCreateDialogStore();
    const tagsStore = useStore(tagsArray);
    const calendarStore = useCalendarStore();
    const [activeMenu, setActiveMenu] = useState<Menu>(Menu.Task);
    const backdropAnimation = useAnimation();
    const panelAnimation = useAnimation();

    // const [tagsArray, setTagsArray] = useState<Tag[]>([]);

    const handleCreate = () => {
        if (calendarStore === undefined) return;

        // Get name, if applicable (Tag Blocks don't have names)
        let name: string = "";
        if (document.getElementById("name"))
            name = (document.getElementById("name") as HTMLInputElement).value;

        // Get date1 (All components have a date1)
        const year1: string = (document.getElementById("date-year-1") as HTMLInputElement).value;
        const month1: string = (
            months.indexOf((document.getElementById("date-month-1") as HTMLInputElement).value) + 1
        ).toString();
        const day1: string = (document.getElementById("date-day-1") as HTMLInputElement).value;
        const pm1: boolean =
            (document.getElementById("date-pm-1") as HTMLInputElement).value === "true";
        let hour1: number = parseInt(
            (document.getElementById("date-hour-1") as HTMLInputElement).value
        );
        if (hour1 === 12) hour1 = 0;
        if (pm1) hour1 += 12;
        const minute1: string = (document.getElementById("date-minute-1") as HTMLInputElement)
            .value;
        const date1: number = new Date(
            `${year1}-${month1.padStart(2, "0")}-${day1.padStart(2, "0")}T${hour1
                .toString()
                .padStart(2, "0")}:${minute1.padStart(2, "0")}`
        ).getTime();

        // Get date2 (Only events and tag blocks have date2)
        let date2: Date = new Date();
        if (document.getElementById("date-year-2")) {
            const year2: string = (document.getElementById("date-year-2") as HTMLInputElement)
                .value;
            const month2: number =
                months.indexOf(
                    (document.getElementById("date-month-2") as HTMLInputElement).value
                ) + 1;
            const day2: string = (document.getElementById("date-day-2") as HTMLInputElement).value;

            const pm2: boolean =
                (document.getElementById("date-pm-2") as HTMLInputElement).value === "true";
            let hour2: number = parseInt(
                (document.getElementById("date-hour-2") as HTMLInputElement).value
            );
            if (hour2 === 12) hour2 = 0;
            if (pm2) hour2 += 12;

            const minute2: string = (document.getElementById("date-minute-2") as HTMLInputElement)
                .value;
            date2 = new Date(
                `${year2}-${month2.toString().padStart(2, "0")}-${day2.padStart(2, "0")}T${hour2
                    .toString()
                    .padStart(2, "0")}:${minute2.padStart(2, "0")}`
            );
            // If second date is set to be 12 AM, it can be assumed they mean the end of the day
            // and not the start
            if (hour2 === 0 && !pm2) date2.setDate(date2.getDate() + 1);
        }

        // Get description (All components have a description)
        const description: string = (document.getElementById("description") as HTMLTextAreaElement)
            .value;

        // Get tags (All components have tags)
        const tags = tagsStore.tags as Tag[];

        // Create and add new thing to calendar
        switch (activeMenu) {
            case Menu.Task: {
                // Only tasks have durations
                const durationDays =
                    parseInt(
                        (document.getElementById("duration-days") as HTMLInputElement).value
                    ) || 0;
                const durationHours =
                    parseInt(
                        (document.getElementById("duration-hours") as HTMLInputElement).value
                    ) || 1;
                const durationMinutes =
                    parseInt(
                        (document.getElementById("duration-minutes") as HTMLInputElement).value
                    ) || 0;
                const task = new Task(
                    name,
                    durationDays * 86400000 + durationHours * 3600000 + durationMinutes * 60000,
                    date1,
                    undefined,
                    description,
                    tags
                );
                calendarStore.addThing(task);

                break;
            }
            case Menu.Event: {
                const event = new Event(name, date2.getTime() - date1, date1, description, tags);
                calendarStore.addThing(event);
                break;
            }
            case Menu.TagBlock: {
                if (tags.length === 0) {
                    console.log("No tags selected for tag block.");
                    return;
                }
                const tagBlock = new TagBlock(date2.getTime() - date1, date1, description, tags);
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
        }, 300);
    };

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                backdropAnimation.start({ opacity: 1, transition: { duration: 0.3 } });
                panelAnimation.start({
                    scale: 1,
                    opacity: 1,
                    transition: { duration: 0.3, ease: "backOut" },
                });
            }, 1);
        }
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onClose={handleClose} className="relative z-10" static>
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
                            {activeMenu === Menu.TagBlock && <CreateTagBlockDialog />}
                        </div>
                        <div className="flex flex-row h-fit p-2 w-full gap-2 justify-end items-center">
                            <motion.button
                                className="h-10 w-20 bg-white text-dark rounded-md flex items-center justify-center cursor-pointer"
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
                                className="h-10 w-20 bg-dark text-white rounded-md flex items-center justify-center cursor-pointer"
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
    return (
        <div className="flex flex-row h-fit w-full gap-2">
            <div className="flex flex-col h-fit w-fit gap-2 justify-start">
                <div className={`text-right flex items-center justify-end h-10`}>Name</div>
                <div className={`text-right flex items-center justify-end h-10`}>Duration</div>
                <div className={`text-right flex items-center justify-end h-10`}>Due Date</div>
                <div className={`text-right flex justify-end items-start py-1 h-20`}>
                    Description
                </div>
                <div className={`text-right flex items-center justify-end h-10`}>Tags</div>
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
                        <div className="text-right text-sm flex items-center">Days</div>
                    </div>
                    <div className="w-full px-2 gap-2 text-right rounded-md bg-white flex truncate">
                        <input
                            id="duration-hours"
                            type="text"
                            placeholder="1"
                            className="w-full grow text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm flex"
                        />
                        <div className="text-right text-sm flex items-center">Hours</div>
                    </div>

                    <div className="w-full px-2 gap-2 text-right rounded-md bg-white flex truncate">
                        <input
                            id="duration-minutes"
                            type="text"
                            placeholder="0"
                            className="w-full grow text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm flex"
                        />
                        <div className="text-right text-sm flex items-center">Minutes</div>
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
                <div className={`text-right flex items-center justify-end h-10`}>Name</div>
                <div className={`text-right flex items-center justify-end h-10`}>Start Time</div>
                <div className={`text-right flex items-center justify-end h-10`}>End Time</div>
                <div className={`text-right flex justify-end items-start py-1 h-20`}>
                    Description
                </div>
                <div className={`text-right flex items-center justify-end h-10`}>Tags</div>
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
                <div className={`text-right flex items-center justify-end h-10`}>Start Time</div>
                <div className={`text-right flex items-center justify-end h-10`}>End Time</div>
                <div className={`text-right flex justify-end items-start py-1 h-20`}>
                    Description
                </div>
                <div className={`text-right flex items-center justify-end h-10`}>Tags</div>
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

interface DateFieldProps {
    id: string;
}

const DateField = ({ id }: DateFieldProps) => {
    const now = new Date();

    const [month, setMonth] = useState<number>(now.getMonth());
    const [year, setYear] = useState<number>(now.getFullYear());
    const [amPm, setAmPm] = useState<string>(now.getHours() >= 12 ? "PM" : "AM");

    return (
        <div className="text-right h-10 flex flex-row gap-2">
            <div className="w-full px-2 gap-2 text-right rounded-md bg-white flex truncate">
                <DropdownMenu
                    id={`date-year-${id}`}
                    options={Array.from(
                        {
                            length: now.getFullYear() + 6 - (now.getFullYear() - 5),
                        },
                        (_, i) => (now.getFullYear() - 5 + i).toString()
                    )}
                    optionReaction={(_: string, i: number) => setYear(i)}
                    defaultOption={now.getFullYear().toString()}
                    className="w-full text-sm"
                />
            </div>
            <div className="w-fit flex-shrink-0 px-2 gap-2 text-right rounded-md bg-white flex truncate">
                <DropdownMenu
                    id={`date-month-${id}`}
                    options={months}
                    optionReaction={(_: string, i: number) => setMonth(i)}
                    defaultOption={months[now.getMonth()]}
                    className="w-full text-sm"
                />
            </div>
            <div className="w-full px-2 gap-2 text-right rounded-md bg-white flex truncate">
                <DropdownMenu
                    id={`date-day-${id}`}
                    options={Array.from({ length: getDaysInMonth(year, month + 1) }, (_, i) =>
                        (i + 1).toString()
                    )}
                    defaultOption={now.getDate()}
                    className="w-full text-sm [scroll-bar:none]"
                />
            </div>

            <div className="flex items-center justify-center">:</div>

            <div className="w-fit flex-shrink-0 p-2 gap-1 text-right rounded-md bg-white flex truncate">
                <DropdownMenu
                    id={`date-hour-${id}`}
                    options={Array.from({ length: 12 }, (_, i) => (i + 1).toString())}
                    defaultOption={now.getHours() ? now.getHours() % 12 : "12"}
                    className="w-12 flex-shrink-0 text-sm"
                />
            </div>
            <div className="w-auto flex-shrink-0 px-2 gap-2 text-right rounded-md bg-white flex truncate">
                <DropdownMenu
                    id={`date-minute-${id}`}
                    options={Array.from({ length: 12 }, (_, i) =>
                        (i * 5).toString().padStart(2, "0")
                    )}
                    defaultOption={"0"}
                    className="w-12 flex-shrink-0 text-sm"
                />
            </div>
            <div className="flex flex-col w-8 flex-shrink-0 rounded-md overflow-hidden select-none">
                <button
                    id={`date-am-${id}`}
                    value={amPm === "PM" ? "true" : "false"}
                    className={
                        amPm === "AM"
                            ? "justify-center text-xs flex items-center bg-dark text-white h-full"
                            : "justify-center text-xs flex items-center bg-white text-dark outline-1 outline-[#7772720a] h-full"
                    }
                    onClick={() => setAmPm(amPm === "AM" ? "PM" : "AM")}
                >
                    am
                </button>
                <button
                    id={`date-pm-${id}`}
                    value={amPm === "PM" ? "true" : "false"}
                    className={
                        amPm === "PM"
                            ? "justify-center text-xs flex items-center bg-dark text-white h-full"
                            : "justify-center text-xs flex items-center bg-white text-dark outline-1 outline-[#0000000a] h-full"
                    }
                    onClick={() => setAmPm(amPm === "AM" ? "PM" : "AM")}
                >
                    pm
                </button>
            </div>
        </div>
    );
};

interface TagsArray {
    tags: Tag[];
    addTag: (tag: Tag) => void;
    removeTag: (tag: Tag) => void;
    setTags: (tags: Tag[]) => void;
}
const tagsArray = createStore<TagsArray>((set) => ({
    tags: [] as Tag[],
    addTag: (tag: Tag) => set((state) => ({ tags: [...state.tags, tag] })),
    removeTag: (tag: Tag) => set((state) => ({ tags: state.tags.filter((t) => t !== tag) })),
    setTags: (tags: Tag[]) => set(() => ({ tags })),
}));

const NewTagField = () => {
    const calendarStore = useCalendarStore();

    const [tagMenuOpen, setTagMenuOpen] = useState(false);
    const [useExisting, setUseExisting] = useState(true);

    const tagsStore = useStore(tagsArray);
    const tags = tagsStore.tags as Tag[];
    const addTag = tagsStore.addTag;
    const removeTag = tagsStore.removeTag;

    const [newColor, setNewColor] = useState("#000000");

    if (calendarStore.calendar === undefined) return <></>;

    const handleAddTag = (tag: Tag) => {
        if (tags.find((t) => t === tag)) return;
        addTag(tag);
    };

    const handleCreateTag = () => {
        if (calendarStore.calendar === undefined) return;

        const name = (document.getElementById("tag-name") as HTMLInputElement).value;
        const color = (document.getElementById("tag-color") as HTMLInputElement).value;
        const description = (document.getElementById("tag-description") as HTMLTextAreaElement)
            .value;
        if (!name) return;

        const tag = new Tag(name, description, color);
        handleAddTag(tag);
        calendarStore.calendar.addTag(tag);
        setTagMenuOpen(false);
        setUseExisting(true);
    };

    return (
        <div className="flex flex-col h-fit w-full gap-2">
            <div className="flex flex-row h-fit w-full gap-2">
                <div className="flex w-full max-w-full max-h-50 flex-wrap items-start gap-2 rounded-md">
                    {Array.from({ length: tags.length }, (_, i) => {
                        const tag = tags[i];
                        return (
                            <div
                                className="flex w-fit h-10 rounded-md px-3 items-center justify-center gap-2 bg-white overflow-hidden flex-shrink-0"
                                key={tag.getName()}
                            >
                                <div
                                    className="w-4 h-4 rounded-full flex-shrink-0"
                                    style={{
                                        backgroundColor: "#" + tag.getColor(),
                                    }}
                                />
                                <div className="text-nowrap w-fit max-w-40 overflow-ellipsis overflow-hidden">
                                    {tag.getName()}
                                </div>
                                <X
                                    size={16}
                                    strokeWidth={1.5}
                                    className="cursor-pointer flex-shrink-0"
                                    onClick={() => removeTag(tag)}
                                />
                            </div>
                        );
                    })}
                </div>
                <motion.button
                    className="h-10 w-10 flex-shrink-0 text-dark bg-white rounded-md flex items-center justify-center cursor-pointer"
                    onClick={() => {
                        setTagMenuOpen(!tagMenuOpen);
                    }}
                    initial={{ scale: 1 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                >
                    <Plus size={20} strokeWidth={1.5} />
                </motion.button>
            </div>
            {tagMenuOpen ? (
                <div className="flex flex-col h-fit w-full rounded-md overflow-hidden bg-white">
                    <div className="h-fit flex-shrink-0 select-none">
                        <div className="flex flex-row justify-between">
                            <div
                                className={
                                    useExisting
                                        ? "flex justify-center items-center w-full h-10 bg-dark text-white"
                                        : "flex justify-center items-center w-full h-10 text-dark cursor-pointer"
                                }
                                onClick={() => setUseExisting(true)}
                            >
                                Use Existing
                            </div>
                            <div
                                className={
                                    !useExisting
                                        ? "flex justify-center items-center w-full h-10 bg-dark text-white"
                                        : "flex justify-center items-center w-full h-10 text-dark cursor-pointer"
                                }
                                onClick={() => setUseExisting(false)}
                            >
                                Create New
                            </div>
                        </div>
                    </div>

                    <div>
                        {useExisting ? (
                            <div>
                                <div className="flex flex-col h-fit w-full p-2">
                                    <input
                                        id="search-tags"
                                        type="text"
                                        className="w-full h-10 bg-white text-dark rounded-md px-2 outline-none drop-shadow-md"
                                        placeholder="Search Tags..."
                                    />
                                </div>
                                <div className="flex flex-col h-40 w-full overflow-auto p-2 gap-2 [scrollbar-width:none]">
                                    {Array.from(
                                        {
                                            length: calendarStore.calendar.getTags().length,
                                        },
                                        (_, i) => {
                                            if (calendarStore.calendar === undefined) return <></>;
                                            const tag = calendarStore.calendar.getTags()[i];
                                            return (
                                                <div
                                                    className="flex min-h-10 w-full bg-white text-dark rounded-md px-2 items-center justify-start gap-2 cursor-pointer drop-shadow-md"
                                                    key={tag.getName()}
                                                    onClick={handleAddTag.bind(this, tag)}
                                                >
                                                    <div
                                                        className="w-4 h-4 rounded-full flex-shrink-0"
                                                        style={{
                                                            backgroundColor: "#" + tag.getColor(),
                                                        }}
                                                    />
                                                    <div className="flex-grow overflow-hidden text-ellipsis whitespace-nowrap">
                                                        {tag.getName()}
                                                    </div>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col w-full h-fit p-2 gap-2">
                                <div className="flex flex-row w-full h-fit gap-2">
                                    <div className="flex flex-col h-fit w-fit gap-2 items-end justify-end">
                                        <p className="flex w-fit h-10 text-dark items-center justify-end text-right">
                                            Name
                                        </p>
                                        <p className="flex w-fit h-10 text-dark items-center justify-end text-right">
                                            Color
                                        </p>
                                        <p className="flex w-fit h-20 text-dark items-center justify-end text-right">
                                            Description
                                        </p>
                                    </div>
                                    <div className="flex flex-col h-fit w-full gap-2">
                                        <input
                                            id="tag-name"
                                            type="text"
                                            className="w-full h-10 bg-white text-dark rounded-md px-2 outline-none drop-shadow-md"
                                            placeholder="Tag Name"
                                        />
                                        <div className="flex flex-row w-full h-10 bg-white rounded-md drop-shadow-md overflow-hidden p-2">
                                            <div
                                                className="rounded-md overflow-hidden w-full h-full"
                                                style={{
                                                    backgroundColor: newColor,
                                                }}
                                            >
                                                <input
                                                    id="tag-color"
                                                    type="color"
                                                    className="w-full h-full rounded-md opacity-0"
                                                    onChange={(e) => setNewColor(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <textarea
                                            id="tag-description"
                                            className="w-full h-20 bg-white text-dark rounded-md p-2 outline-none drop-shadow-md overflow-y-auto resize-none"
                                            placeholder="Description"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-row w-full justify-end h-10">
                                    <button
                                        className="h-10 w-fit bg-white text-dark rounded-md flex items-center justify-center drop-shadow-md cursor-pointer px-4"
                                        onClick={handleCreateTag}
                                    >
                                        Create Tag
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <></>
            )}
        </div>
    );
};
