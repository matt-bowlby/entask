import { Image, Settings, Plus, ChevronLeft, ChevronRight } from "lucide-react";
export default function TitleBar() {
    return (
        <div
            id="title-bar"
            className="h-title-bar pt-3 bg-dark flex items-center [app-region:drag]"
        >
            <div id="left-side" className="w-[400px] flex justify-between m-4">
                <div className="flex gap-2">
                    <Image
                        size={32}
                        color="white"
                        strokeWidth={1}
                        className="cursor-pointer [app-region:no-drag]"
                    />
                    <Settings
                        size={32}
                        color="white"
                        strokeWidth={1}
                        className="cursor-pointer [app-region:no-drag]"
                    />
                </div>

                <button
                    id="create-new-btn"
                    className="bg-white text-black font-semibold rounded-full p-1 px-3 flex gap-1 cursor-pointer z-30 [app-region:no-drag]"
                >
                    Create New <Plus strokeWidth={2} />
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
                    <span className="text-lg font-semibold">Today</span>
                    <ChevronRight
                        size={24}
                        color="white"
                        strokeWidth={1.5}
                        className="cursor-pointer [app-region:no-drag]"
                    />
                </div>

                <h2 className="font-bold text-2xl">
                    September <span className="font-semibold">2025</span>
                </h2>
            </div>
        </div>
    );
}
