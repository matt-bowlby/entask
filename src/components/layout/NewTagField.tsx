import Tag from "@/classes/tag/Tag";
import useCalendarStore from "@/store/calendarStore";
import { useTagsArrayStore } from "@/store/TagsArrayStore";
import { motion } from "framer-motion";
import { PaletteIcon, Plus, X } from "lucide-react";
import { useState, useEffect } from "react";
import { create, useStore } from "zustand";

const defaultColors = [
    "#DE6C50",
    "#fce07b",
    "#5ED27D",
    "#a5f2e8",
    "#7FB4DA",
    "#474D7A",
    "#dc9ce8",
];

type CreateTagMenu = {
    isOpen: boolean;
    setTagMenuOpen: (open: boolean) => void;
};
export const useCreateTagMenuStore = create<CreateTagMenu>((set) => ({
    isOpen: false,
    setTagMenuOpen: (open: boolean) => set({ isOpen: open }),
}));

type TagsArray = {
    tags: Tag[];
    addTag: (tag: Tag) => void;
    removeTag: (tag: Tag) => void;
    setTags: (tags: Tag[]) => void;
};
export const useTagsArray = create<TagsArray>((set) => ({
    tags: [] as Tag[],
    addTag: (tag: Tag) => set((state) => ({ tags: [...state.tags, tag] })),
    removeTag: (tag: Tag) => set((state) => ({ tags: state.tags.filter((t) => t !== tag) })),
    setTags: (tags: Tag[]) => set(() => ({ tags })),
}));

interface TagBlockTagFieldProps {
    initialTags?: Tag[];
}

export const TagBlockTagField = ({ initialTags = [] }: TagBlockTagFieldProps) => {
    const { tags, addTag, clear } = useTagsArrayStore();
    const { isOpen, setTagMenuOpen } = useStore(useCreateTagMenuStore);

    useEffect(() => {
        clear();
        initialTags.forEach((tag) => {
            addTag(tag);
        });
    }, []);

    return (
        <div className="flex flex-col h-fit w-full gap-2">
            <button
                className="flex w-fit h-10 max-w-full items-center justify-center max-h-50 rounded-md bg-white cursor-pointer px-4"
                onClick={() => {
                    setTagMenuOpen(!isOpen);
                }}
            >
                {tags.length < 1 ? (
                    "Click to select a tag"
                ) : (
                    <div className="flex flex-row items-center justify-start gap-2 w-full p-2">
                        <div
                            className="w-4 h-4 rounded-full flex-shrink-0"
                            style={{
                                backgroundColor: "#" + tags[0].getColor(),
                            }}
                        />
                        <div className="text-nowrap w-fit max-w-40 overflow-ellipsis overflow-hidden">
                            {tags[0].getName()}
                        </div>
                    </div>
                )}
            </button>
        </div>
    );
};

interface TagFieldProps {
    initialTags?: Tag[];
}

const TagField = ({ initialTags = [] }: TagFieldProps) => {
    const { tags, removeTag, addTag, clear } = useTagsArrayStore();
    const { isOpen, setTagMenuOpen } = useStore(useCreateTagMenuStore);

    useEffect(() => {
        clear();
        initialTags.forEach((tag) => {
            addTag(tag);
        });
    }, []);

    return (
        <div className="flex flex-col h-fit w-full gap-2">
            <div className="flex flex-row h-fit w-full gap-2">
                {tags.length > 0 ? (
                    <div className="flex w-fit max-w-full max-h-50 flex-wrap items-start gap-2 rounded-md">
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
                ) : null}

                <motion.button
                    className="h-10 w-10 flex-shrink-0 text-dark bg-white rounded-md flex items-center justify-center cursor-pointer"
                    onClick={() => {
                        setTagMenuOpen(!isOpen);
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
        </div>
    );
};

interface ChooseTagFieldProps {
    onAddTag?(tag: Tag): void;
}

export const ChooseTagField = ({ onAddTag }: ChooseTagFieldProps) => {
    const calendarStore = useCalendarStore();
    if (calendarStore.calendar === undefined) return <></>;

    const [useExisting, setUseExisting] = useState(true);
    const [tags, setTags] = useState<Tag[]>([]);
    const [newColor, setNewColor] = useState("#000000");

    const handleAddTag = (tag: Tag) => {
        if (tags.find((t) => t === tag)) return;
        setTags((prevTags) => [...prevTags, tag]);
        if (onAddTag) onAddTag(tag);
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
        setUseExisting(true);
    };

    return (
        <div className="flex flex-col h-fit w-full overflow-hidden gap-2">
            <div className="h-fit flex-shrink-0 select-none">
                <div className="flex flex-row justify-between gap-2">
                    <div
                        className={
                            useExisting
                                ? "flex justify-center items-center w-full h-10 bg-dark text-white rounded-md"
                                : "flex justify-center items-center w-full h-10 text-dark bg-white cursor-pointer rounded-md"
                        }
                        onClick={() => setUseExisting(true)}
                    >
                        Use Existing
                    </div>
                    <div
                        className={
                            !useExisting
                                ? "flex justify-center items-center w-full h-10 bg-dark text-white rounded-md"
                                : "flex justify-center items-center w-full h-10 bg-white text-dark cursor-pointer rounded-md"
                        }
                        onClick={() => setUseExisting(false)}
                    >
                        Create New
                    </div>
                </div>
            </div>

            <div>
                {useExisting ? (
                    <div className="flex flex-col bg-white rounded-md">
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
                    <div className="flex flex-col w-full h-fit p-2 gap-2 bg-white rounded-md">
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
                                    </div>
                                </div>
                                <div className="flex flex-wrap w-full h-full gap-2 ">
                                    {defaultColors.map((color) => {
                                        return (
                                            <div
                                                className="flex bg-white p-2 drop-shadow-md w-10 h-10 rounded-md cursor-pointer"
                                                onClick={() => setNewColor(color)}
                                            >
                                                <div
                                                    key={color}
                                                    className="rounded-md w-full h-full cursor-pointer"
                                                    style={{
                                                        backgroundColor: color,
                                                    }}
                                                />
                                            </div>
                                        );
                                    })}
                                    <div className="relative flex bg-white drop-shadow-md w-10 h-10 rounded-md cursor-pointer">
                                        <PaletteIcon
                                            size={20}
                                            strokeWidth={1.5}
                                            className="text-dark cursor-pointer absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                                        ></PaletteIcon>
                                        <input
                                            id="tag-color"
                                            type="color"
                                            className="w-full h-full rounded-md opacity-0 cursor-pointer"
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
    );
};

export default TagField;