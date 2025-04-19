import { FormEvent, ReactElement, useState } from "react";
import SearchIcon from "./SearchIcon";
import getNearestParentByTagName from '../../utils/getNearestParentByTagName'
import { useNavigate } from "react-router-dom";

interface SearchBarProps {
    onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
    disabled?: boolean;
    textColor?: string;
    borderColor?: string
    backgroundColor?: string;
    disabledButtonColor?: string;
    enabledButtonColor?: string;
}

export default function SearchBar(props: SearchBarProps): ReactElement {
    const [searchIconState, setSearchIconState] = useState<boolean>(props.disabled? true : false);
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const searchValue = (e.target as HTMLFormElement).searchContent.value.trim();
        
        if (searchValue) {
            // Redirect to search page with query parameter
            navigate(`/search?query=${encodeURIComponent(searchValue)}`);
        }
    };

    return (
        <form className={`w-full max-w-full h-full max-h-full relative focus:outline-none focus:border-none items-center ${props.textColor? `text-[${props.textColor}]!` : "text-white!"}`}
            onSubmit={props.onSubmit? props.onSubmit : handleSearch}
        >
            <input className="w-full h-3/4 min-h-12 text-nowrap overflow-hidden pl-4 pr-12 mt-2 rounded-full border-1
                focus:outline-none inline relative"
                placeholder="Search for anything..."
                onInput={(e: FormEvent<HTMLInputElement>) => {
                    const input: HTMLInputElement | null = e.target as HTMLInputElement
                    if (!input) return;
                    if ((input.value as string).trim())
                        setSearchIconState(false)
                    else
                        setSearchIconState(true)
                }}
                name="searchContent"
            />
            <button type='submit'
                disabled={searchIconState}
                className={`h-[calc(75%-0.5rem)] aspect-square absolute right-1 top-[calc(12.5%+0.25rem)] p-2 rounded-full ${props.borderColor? `border-[${props.borderColor}]!` : "border-white"}
                    ${
                        searchIconState?
                            `cursor-not-allowed ${props.disabledButtonColor? `bg-[${props.disabledButtonColor}]` : "bg-zinc-500"}` :
                            `cursor-pointer ${props.enabledButtonColor? `bg-[${props.enabledButtonColor}]` : "bg-light-teal"}`
                    }
                `}
            >
                <SearchIcon
                    onClick={
                        (e: Event): void => {
                            if (searchIconState) return
                            // else
                            const res: HTMLElement | null = getNearestParentByTagName(e.target as HTMLElement, 'form')
                            if (res) (res as HTMLFormElement).submit();
                        }
                    }
                    fill={searchIconState? "#868686" : "#ffffff"}
                />
            </button>
        </form>
    )
}