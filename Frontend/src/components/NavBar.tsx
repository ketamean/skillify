import React, { ReactElement } from "react";
import Button from "../components/Button";
import UserMiniAvatar from "../components/UserMiniAvatar";
import SearchBar from "./SearchBar";

interface NavBarUserInfo {
    fname: string;
    lname: string;
    email?: string;
    avatarUrl?: string;
}
interface NavBarProps {
    disabled?: boolean;
    children?: React.ReactNode;
    toInstructor?: boolean;
    isLoggedIn?: boolean;
    user: NavBarUserInfo;
}
interface UserProfileProps {
    user: NavBarUserInfo
}
interface UserProfileDropDownProps {
    user: NavBarUserInfo
}
interface UserProfileInfoCardProps {
    user: NavBarUserInfo
}

function UserProfileInfoCard(props: UserProfileInfoCardProps): ReactElement {
    return (
        <div className="flex flex-row items-center">
            <UserMiniAvatar fname={props.user.fname} lname={props.user.lname} avatarUrl={props.user.avatarUrl}/>
            <div className="flex flex-col">
                <div>
                    {props.user.fname? props.user.fname : ""} {props.user.lname? props.user.lname : ""}
                </div>
                <div>
                    {props.user.email? props.user.email : ""}
                </div>
            </div>
        </div>
    )
}

function UserProfileDropDown(props: UserProfileDropDownProps): ReactElement {
    return (
        <div className="">
            <UserProfileInfoCard user={props.user} />
        </div>
    )
}

function AccountButton(props: UserProfileProps): ReactElement {
    return (
        <a href="/">
            <div className="rounded-full h-12 w-12">
                {
                    ((): ReactElement => {
                        if (props.user.avatarUrl) {
                            return (
                                <>
                                </>
                            )
                        }
                        // else
                        return (
                            <div className="w-full h-full">
                                <img src={props.user.avatarUrl} alt="" />
                            </div>
                        )

                    })()
                }
            </div>
        </a>
    );
}

export default function NavBar(props: NavBarProps): ReactElement {
    return (
        <nav className="w-screen h-24 fixed top-0 left-0 py-4 px-4 items-center justify-center bg-deepteal grid
            grid-cols-4 gap-x-2
            md:grid-cols-12 md:gap-x-4">
            <div className="min-w-8 h-full flex items-center text-white!
                    col-span-2 justify-start
                    md:col-span-1 md:justify-center"
            >
                <a href="#"
                    className="text-decoration-none! text-white! font-bold! text-2xl! hover:text-white! hover:no-underline!"
                >
                    <span>
                        Skillify
                    </span>
                </a>
            </div>
            <div className="h-full
                    md:col-span-6 md:min-w-80"
            >
                <SearchBar disabled={true}/>
            </div>
            <div className="h-full
                col-span-1
                md:hidden"
            >
                {/* <svg className="h-full w-full rounded-full"
                    xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0,0,256,256"
                    onClick={
                        () => {
                            if (searchIconState) return null
                            else return ((): void => {
                                document.querySelector('#searchBarForm')?.dispatchEvent(new Event('submit'));
                            })
                        }
                    }
                >
                    <g className="mix-blend-normal" fill={searchIconState? "#868686" : "#ffffff"} fillRule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" stroke-masharray="" strokeDashoffset="0" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none">
                        <g transform="scale(5.12,5.12)">
                            <path d="M21,3c-9.37891,0 -17,7.62109 -17,17c0,9.37891 7.62109,17 17,17c3.71094,0 7.14063,-1.19531 9.9375,-3.21875l13.15625,13.125l2.8125,-2.8125l-13,-13.03125c2.55469,-2.97656 4.09375,-6.83984 4.09375,-11.0625c0,-9.37891 -7.62109,-17 -17,-17zM21,5c8.29688,0 15,6.70313 15,15c0,8.29688 -6.70312,15 -15,15c-8.29687,0 -15,-6.70312 -15,-15c0,-8.29687 6.70313,-15 15,-15z"></path>
                        </g>
                    </g>
                </svg> */}
            </div>
            <div title="Go to home page"
                className="w-full max-h-full h-12 flex items-center justify-center
                    col-span-1
                    md:col-start-10"
            >
                <a href="#"
                    className="text-decoration-none! text-white! text-lg font-bold! hover:text-light-green! hover:no-underline!"
                >
                    <span>Home</span>
                </a>
            </div>
            {/* <div className="h-full w-full flex flex-row gap-x-4 items-center justify-center col-end-12">


            </div> */}
            <div title="Go to instructor page"
                className="w-full max-h-full h-12 flex items-center justify-center
                    col-span-1
                    md:col-start-11"
            >
                <a href="#"
                    className="text-decoration-none! text-white! text-lg font-bold! hover:text-light-green! hover:no-underline!"
                >
                    <span>Instructor</span>
                </a>
            </div>
            <div title="View basic settings"
                className="w-full h-full cursor-pointer flex items-center row-start-1
                    col-start-4 justify-end
                    md:col-start-12 md:justify-center"
            >
                <UserMiniAvatar fname="Truong Thanh" lname="Toan" title="View basic settings"/>
            </div>
        </nav>
    );
}