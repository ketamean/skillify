import { FormEvent, ReactElement, useState } from "react";
import { axiosJson } from "../../config/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
interface SearchBarProps {
    onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
    disabled?: boolean;
    textColor?: string;
    borderColor?: string
    backgroundColor?: string;
    disabledButtonColor?: string;
    enabledButtonColor?: string;
}

function defaultOnSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    console.log((e.target as HTMLFormElement).searchContent.value);
    axiosJson
        .get(`/form?content=${(e.target as HTMLFormElement).searchContent.value}`)
        .then((res) => res)
        .catch((res) => {
            console.error(res);
            alert(res);
        })
}

export default function SearchBar(props: SearchBarProps): ReactElement {
    const [searchIconState, setSearchIconState] = useState<boolean>(props.disabled? true : false);
    return (
        <form className={`w-full max-w-full h-full max-h-full relative focus:outline-none focus:border-none items-center ${props.textColor? `text-[${props.textColor}]!` : "text-white!"}`}
            onSubmit={props.onSubmit? props.onSubmit : defaultOnSubmit}
        >
            <input className="w-full h-3/4 min-h-12 text-nowrap overflow-hidden pl-4 pr-12 mt-2 rounded-full border-1
                focus:outline-none inline relative"
                placeholder="Search for anything..."
                onInput={(e: FormEvent<HTMLInputElement>) => {
                    const input: HTMLInputElement | null = e.target as HTMLInputElement
                    if (!input) return;
                    console.log((input.value as string).trim())
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
                <FontAwesomeIcon 
                    icon={faSearch}
                    className={`${searchIconState? 'text-[#868686]' : 'text-white'}`}
                />
            </button>
        </form>
    )
}