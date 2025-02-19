export default function TodoTask() {
    return (
        <div className="bg-slate-200 w-full flex gap-2 p-3">
            <div className="items-center flex">
                <input
                    title="done"
                    type="checkbox"
                    className="drop-shadow-lg"
                ></input>
            </div>
            <div>
                <h1>TodoTask</h1>
                <p>100 hours</p>
                <p>Due Date</p>
            </div>
        </div>
    );
}
