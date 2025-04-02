import { Image, Settings, Plus, ChevronLeft, ChevronRight } from "lucide-react";
export default function TitleBar() {
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
                    className="bg-white text-black font-semibold rounded-xl p-1 px-3 flex gap-1 cursor-pointer z-30 text-sm [app-region:no-drag] items-center justify-center select-none"
                >
                    Create New <Plus size={16} strokeWidth={2} />
                </button>
            </div>
            <div
                id="right-side"
                className="flex items-center grow m-4 text-white gap-6"
            >
                <div className="flex gap-4 items-center">
                    <ChevronLeft
                        size={24}
                        color="white"
                        strokeWidth={1.5}
                        className="cursor-pointer [app-region:no-drag]"
                    />
                    <h2 className="text-base font-regular cursor-pointer [app-region:no-drag] select-none">Today</h2>
                    <ChevronRight
                        size={24}
                        color="white"
                        strokeWidth={1.5}
                        className="cursor-pointer [app-region:no-drag]"
                    />
                </div>
                <div className="flex flex-row items-center justify-center gap-2 select-none">
                    <h1 className="font-bold text-lg">September</h1>
                    <h1 className="font-regular text-lg">2025</h1>
                </div>
            </div>
        </div>
    );
}
