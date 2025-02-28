import { FormEvent, ReactElement, useState, useEffect } from "react"
// import Modal from 'react-modal'
import GoBackIcon from "./GoBackIcon";
import SearchBar from "./SearchBar"

interface SearchOverlayProps {
    state: boolean;
    setState: (state: boolean) => void;
    onSubmit?: (e: FormEvent) => void;
    className?: string;
}

interface SearchResults {
    name: string;
    link: string;
}

export default function SearchOverlay(props: SearchOverlayProps): ReactElement {
    const [searchResults, setSearchResults] = useState<SearchResults[]>([]);
    const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
    useEffect(() => {
        window.addEventListener("resize", () => {
            setWindowWidth(window.innerWidth);
        })
    }, [])
    useEffect(() => {
        props.setState(false)
    }, [windowWidth])
    return (
        <div className={`w-full h-screen bg-white z-20
            transition-all duration-300 ease-in-out
            ${props.state === true? "opacity-100 translate-y-0" : "hidden"}
            md:hidden`}
        >
            <div className="h-24 px-4 bg-deepteal py-4 w-full flex flex-row items-center">
                <button type="button"
                    className="w-6 pr-2 aspect-square cursor-pointer"
                    onClick={() => props.setState(false)}
                >
                    <GoBackIcon color="white" />
                </button>
                <SearchBar
                    // onSubmit={props.onSubmit}
                    onSubmit={props.onSubmit}
                    backgroundColor="deepteal"
                    disabled={true}
                />
            </div>

            {/* results container */}
            <div className="container w-full h-full">
                {
                    searchResults.map((result) => {
                        return (
                            <a href={result.link}>
                                <div>
                                    {result.name}
                                </div>
                            </a>
                        )
                    })
                }
            </div>
        </div>
    )
}