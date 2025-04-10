import {useState} from "react";

interface DropdownMenuProps {
  options: string[];
  optionReaction?: CallableFunction;
  defaultOption?: any;
  className?: string;
  id?: string;
}

const DropdownMenu = ({ options, optionReaction, defaultOption, className, id }: DropdownMenuProps) => {
    const [selectedOption, setSelectedOption] = useState<string>(
        defaultOption !== undefined ? defaultOption : options[0]
    );

    const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const i = e.target.selectedIndex;
        setSelectedOption(options[i]);
        if (optionReaction) {
            optionReaction(options[i], i);
        }
    };

    return (
        <select
            id={id}
            style={{ outline: "none" }}
            className={className}
            onChange={handleSelect}
            value={selectedOption}
        >
            {options.map((option, i) => (
                <option
                    key={i}
                    value={option}
                    className="flex flex-col w-full h-full bg-white rounded-md"
                >
                    {option}
                </option>
            ))}
        </select>
    );
}

export default DropdownMenu;