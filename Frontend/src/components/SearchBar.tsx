import { ReactElement } from "react";
import {axiosForm} from "../config/axios";
import searchIcon from '../assets/searchIcon.svg'
interface SearchBarProps {
    onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
    className?: string;
    disabled?: boolean;
    iconOnly?: boolean;
}

function defaultOnSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    console.log((e.target as HTMLFormElement).searchContent.value);
    axiosForm
        .get(`/form?content=${(e.target as HTMLFormElement).searchContent.value}`)
        .then((res) => res)
        .catch((res) => {
            console.error(res);
            alert(res);
        })
}

export default function SearchBar(props: SearchBarProps): ReactElement {
    return (
        <form className="w-full max-w-full h-full max-h-full relative focus:outline-none focus:border-none flex items-center"
            onSubmit={props.onSubmit? props.onSubmit : defaultOnSubmit}
            id="searchBarForm"
        >
            <input className="w-full h-[3/4] min-h-12 text-nowrap overflow-hidden px-4 pr-18 rounded-full border-1
                focus:outline-none"
                placeholder="Search for anything..."
                name='searchContent'
            />
            <button type='submit'
                disabled={props.disabled}
                className={`h-[calc(75%-0.5rem)] aspect-square absolute right-1 top-[calc(12.5%+0.25rem)] p-2 rounded-full
                    ${props.disabled? "cursor-not-allowed bg-zinc-500": "cursor-pointer bg-black"}`}
            >
                {/* <img src={searchIcon}

                    onClick={(): void => {
                        document.querySelector('#searchBarForm')?.dispatchEvent(new Event('submit'));
                    }}
                /> */}
                <svg className="h-full w-full rounded-full"
                    xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0,0,256,256"
                    onClick={
                        () => {
                            if (props.disabled) return null
                            else return ((): void => {
                                document.querySelector('#searchBarForm')?.dispatchEvent(new Event('submit'));
                            })
                        }
                    }
                >
                    <g className="mix-blend-normal" fill={props.disabled? "#868686" : "#ffffff"} fillRule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" stroke-masharray="" strokeDashoffset="0" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none">
                        <g transform="scale(5.12,5.12)">
                            <path d="M21,3c-9.37891,0 -17,7.62109 -17,17c0,9.37891 7.62109,17 17,17c3.71094,0 7.14063,-1.19531 9.9375,-3.21875l13.15625,13.125l2.8125,-2.8125l-13,-13.03125c2.55469,-2.97656 4.09375,-6.83984 4.09375,-11.0625c0,-9.37891 -7.62109,-17 -17,-17zM21,5c8.29688,0 15,6.70313 15,15c0,8.29688 -6.70312,15 -15,15c-8.29687,0 -15,-6.70312 -15,-15c0,-8.29687 6.70313,-15 15,-15z"></path>
                        </g>
                    </g>
                </svg>
            </button>
        </form>
    )
}