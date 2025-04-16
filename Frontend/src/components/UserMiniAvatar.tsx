import { ReactElement } from "react";

interface UserAvatarProps {
    size?: string; // width === height === size (e.g.: "12px", "3rem",...)
    fname: string;
    lname: string;
    avatarUrl?: string;
    title?: string;
    onClick?: () => void;
}

function extractRepresentativeName(fname: string, lname: string): string {
    return "" + (fname? fname[0].toUpperCase(): "") + (lname? lname[0].toUpperCase(): "")
}

export default function UserMiniAvatar(props: UserAvatarProps): ReactElement {
    return (
        <div title={props.title? props.title : ""}
            className={`flex items-center justify-center max-w-full max-h-full ${props.size? `min-w-[${props.size}] min-h-[${props.size}] w-[${props.size}] h-[${props.size}]` : "min-w-12 min-h-12 w-12 h-12"} rounded-full ${props.avatarUrl? "" : "bg-black"}`}
            onClick={props.onClick}
        >
            {
                props.avatarUrl? (
                    <img src={props.avatarUrl} alt="" className="w-full h-full rounded-full"/>
                ) : (
                    <span className="text-white font-black text-sm">
                        {extractRepresentativeName(props.fname, props.lname)}
                    </span>
                )
            }
            
        </div>
    )
}