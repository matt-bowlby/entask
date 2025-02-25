interface Day {
    num: number;
    name: string;
}

export default function Day({ num, name }: Day) {
    return (
        <div className="h-[10vh] sticky flex flex-col items-center select-none text-center">
            <h2 className="font-black text-5xl">{num}</h2>
            <p className="font-light text-lg">{name}</p>
        </div>
    );
}
