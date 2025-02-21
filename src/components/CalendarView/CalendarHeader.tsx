export default function CalendarHeader() {
    return (
        <div className="flex justify-between items-center py-2 px-4 sticky h-[10vh]">
            <div id="month" className="flex gap-4">
                <h1 className="font-semibold text-2xl">February 2025</h1>
                <div className="font-semibold text-2xl font-mono">
                    <button className="mx-2 cursor-pointer">{"<"}</button>
                    <button className="mx-2 cursor-pointer">{">"}</button>
                </div>
            </div>

            <button className="font-medium text-xl bg-slate-300 rounded-md p-3 hover:bg-slate-500 cursor-pointer">
                Today
            </button>
        </div>
    );
}
