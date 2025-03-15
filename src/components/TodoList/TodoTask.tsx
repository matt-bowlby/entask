export default function TodoTask() {
    return (
        <div className="bg-white drop-shadow-md max-w-full m-4 p-2 h-28 flex rounded-3xl gap-4 relative">
            <div className="tag-bar w-2 m-2 h- rounded-full overflow-hidden flex flex-col">
                <div className="w-full h-full bg-red-200"></div>
                <div className="w-full h-full bg-blue-200"></div>
            </div>
            <div>
                <h3 className="font-bold text-xl">
                    Test Task with a Long Name
                </h3>
                <p className="">2 hours</p>
                <p>Due in 10 hours at 11:59pm</p>
            </div>
        </div>
    );
}
