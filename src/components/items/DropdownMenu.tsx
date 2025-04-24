import { useState, useEffect, useRef } from "react";

interface DropdownMenuProps {
    options: string[];
    optionReaction?: CallableFunction;
    defaultOption?: any;
    className?: string;
    id?: string;
}

const DropdownMenu = ({
    options,
    optionReaction,
    defaultOption,
    id,
}: DropdownMenuProps) => {
    const [_, setSelectedOption] = useState<string>(
        defaultOption !== undefined ? defaultOption : options[0]
    );

    const inputRef = useRef<HTMLInputElement>(null);

    const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const i = e.target.selectedIndex;
        setSelectedOption(options[i]);
        if (optionReaction) {
            optionReaction(options[i], i);
        }
        if (inputRef.current) {
            inputRef.current.value = options[i];
        }
    };

    useEffect(() => {
        if (inputRef.current) {
            console.log("defaultOption", defaultOption);
            inputRef.current.value = defaultOption;
        }
    }, [])

    return (
        <div className="flex flex-row items-center justify-center gap-2 p-2 w-full h-full overflow-hidden bg-white rounded-md">
            <input ref={inputRef} id={id} className="w-full h-full outline-0"/>
            <select
                style={{ outline: "none" }}
                onChange={handleSelect}
                className="w-4 h-full bg-white rounded-md"
            >
                {options.map((option, i) => (
                    <option key={i} value={option} className="text-sm text-dark">
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default DropdownMenu;
