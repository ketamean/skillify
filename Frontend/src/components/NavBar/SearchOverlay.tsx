import { ReactElement, useState, useEffect } from "react"
import GoBackIcon from "./GoBackIcon";
import SearchBar from "./SearchBar"

interface SearchOverlayProps {
    state: boolean;
    setState: (state: boolean) => void;
    onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
    className?: string;
}

export default function SearchOverlay(props: SearchOverlayProps): ReactElement {
    const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
    
    useEffect(() => {
        window.addEventListener("resize", () => {
            setWindowWidth(window.innerWidth);
        })
    }, [])
    
    useEffect(() => {
        props.setState(false)
    }, [windowWidth])
    
    const closeOverlay = () => {
        props.setState(false);
    };
    
    return (
        <div className={`w-full h-screen bg-white z-20 top-0 left-0
            ${props.state === true? "sticky" : "hidden"}
            md:hidden`}
        >
            <div className="h-24 px-4 bg-deepteal py-4 w-full flex flex-row items-center">
                <button type="button"
                    className="w-6 pr-2 aspect-square cursor-pointer"
                    onClick={closeOverlay}
                >
                    <GoBackIcon color="white" />
                </button>
                <SearchBar
                    onSubmit={(e) => {
                        if (props.onSubmit) {
                            props.onSubmit(e);
                        }
                        closeOverlay();
                    }}
                    backgroundColor="deepteal"
                    disabled={false}
                    textColor="white"
                />
            </div>
        </div>
    )
}