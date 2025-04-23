import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFeather } from '@fortawesome/free-solid-svg-icons'
import { MouseEvent } from 'react'

interface AIAutoFillButtonProps {
    onClick: (e: MouseEvent) => void
}

export default function AIAutoFillButton(props: AIAutoFillButtonProps) {
    return (
        <button className="flex flex-row items-center gap-x-2 cursor-pointer text-white px-4 py-2 rounded-xl font-bold transition-colors duration-300 ease-in-out bg-linear-to-bl from-violet-500 to-fuchsia-400 hover:to-blue-500 hover:from-fuchsia-500"
            onClick={props.onClick}
        >
            <FontAwesomeIcon icon={faFeather} className='text-white'/>AI autofill
        </button>
    )
}