import { Image, Settings, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import CreateNewComponent from "@/components/layout/CreateNewComponent";
import useCalendarStore, { useScrollStore } from "@/store/calendarStore";
import { useCreateDialogStore } from "@/store/TitleBarStore";
import { useNowStore } from "../Updater/Updater";
import { months } from "@/utils/timeString";

export default function TitleBarComponent() {
    const { offset } = useCalendarStore();
    const nowStore = useNowStore();
    let now = nowStore.now;
    now += offset * 24 * 60 * 60 * 1000;
    const month = months[new Date(now).getMonth()];
    const year = new Date(now).getFullYear();

    const { incrementOffset, decrementOffset, setOffset } = useCalendarStore();
    const { resetScrollTop } = useScrollStore();
    const { isOpen, open: openCreateDialog } = useCreateDialogStore();

    return (
        <div
            id="title-bar"
            className="h-title-bar pt-2 bg-dark flex items-center [app-region:drag] pl-2"
        >
            <div id="left-side" className="w-[400px] flex justify-between">
                <div className="flex gap-2 items-center justify-center">
                    <Image
                        size={30}
                        color="white"
                        strokeWidth={1}
                        className="cursor-pointer [app-region:no-drag]"
                    />
                    <Settings
                        size={30}
                        color="white"
                        strokeWidth={1}
                        className="cursor-pointer [app-region:no-drag]"
                    />
                </div>

                <button
                    id="create-new-btn"
                    className="bg-white text-black font-semibold rounded-xl p-1 px-3 flex gap-1 cursor-pointer text-sm [app-region:no-drag] items-center justify-center select-none"
                    onClick={openCreateDialog}
                >
                    Create New <Plus size={16} strokeWidth={2} />
                </button>
            </div>
            <div id="right-side" className="flex items-center grow m-4 text-white gap-6">
                <div className="flex gap-4 items-center">
                    <ChevronLeft
                        size={24}
                        color="white"
                        strokeWidth={1.5}
                        className="cursor-pointer [app-region:no-drag]"
                        onClick={decrementOffset}
                    />
                    <h2
                        className="text-base font-regular cursor-pointer [app-region:no-drag] select-none"
                        onClick={() => {
                            setOffset(0);
                            resetScrollTop();
                        }} // Reset to today when clicked
                    >
                        Today
                    </h2>
                    <ChevronRight
                        size={24}
                        color="white"
                        strokeWidth={1.5}
                        className="cursor-pointer [app-region:no-drag]"
                        onClick={incrementOffset}
                    />
                </div>
                <div className="flex flex-row items-center justify-center gap-2 select-none">
                    <h1 className="font-bold text-lg">{month}</h1>
                    <h1 className="font-regular text-lg">{year}</h1>
                </div>
            </div>
            {isOpen && <CreateNewComponent />}
        </div>
    );
}
