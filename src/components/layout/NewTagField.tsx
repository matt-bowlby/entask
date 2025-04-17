import Tag from "@/classes/tag/Tag";
import { Plus, X } from "lucide-react";
import { useTagsArrayStore } from "@/store/TagsArrayStore";
import { useState } from "react";
import useCalendarStore from "@/store/calendarStore";

const NewTagField = () => {
    const calendarStore = useCalendarStore();

    const [tagMenuOpen, setTagMenuOpen] = useState(false);
    const [useExisting, setUseExisting] = useState(true);

    const tagsStore = useTagsArrayStore();
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

        const name = (document.getElementById("tag-name") as HTMLInputElement)
            .value;
        const color = (document.getElementById("tag-color") as HTMLInputElement)
            .value;
        const description = (
            document.getElementById("tag-description") as HTMLTextAreaElement
        ).value;
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
                <button
                    title="Toggle tag menu"
                    className="h-10 w-10 flex-shrink-0 text-dark bg-white rounded-md flex items-center justify-center cursor-pointer"
                    onClick={() => {
                        setTagMenuOpen(!tagMenuOpen);
                    }}
                >
                    <Plus size={20} strokeWidth={1.5} />
                </button>
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
                                            length: calendarStore.calendar.getTags()
                                                .length,
                                        },
                                        (_, i) => {
                                            if (
                                                calendarStore.calendar ===
                                                undefined
                                            )
                                                return <></>;
                                            const tag =
                                                calendarStore.calendar.getTags()[
                                                    i
                                                ];
                                            return (
                                                <div
                                                    className="flex min-h-10 w-full bg-white text-dark rounded-md px-2 items-center justify-start gap-2 cursor-pointer drop-shadow-md"
                                                    key={tag.getName()}
                                                    onClick={handleAddTag.bind(
                                                        this,
                                                        tag
                                                    )}
                                                >
                                                    <div
                                                        className="w-4 h-4 rounded-full flex-shrink-0"
                                                        style={{
                                                            backgroundColor:
                                                                "#" +
                                                                tag.getColor(),
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
                                            title="Tag Name"
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
                                                    title="Tag Color"
                                                    className="w-full h-full rounded-md opacity-0"
                                                    onChange={(e) =>
                                                        setNewColor(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <textarea
                                            id="tag-description"
                                            title="Tag Description"
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

export default NewTagField;
