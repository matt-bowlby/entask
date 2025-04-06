export default function TodoEvent() {
    return (
        <div className="bg-slate-200 w-full flex gap-2 p-2">
            <div className="items-center flex">
                <input
                    title="done"
                    type="checkbox"
                    disabled
                    className="drop-shadow-lg"
                ></input>
            </div>
            <div>
                <h1>TodoEvent</h1>
                <p>in 1 hour</p>
            </div>
        </div>
    );
}
