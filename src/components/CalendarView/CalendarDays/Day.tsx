interface Day {
    num: number;
    name: string;
}

export default function Day({ num, name }: Day) {
    return (
        <div className="flex flex-col items-center select-none border-r border-gray-800 text-center">
            <h2 className="font-black text-5xl">{num}</h2>
            <p className="font-light text-lg">{name}</p>
        </div>
    );
}
