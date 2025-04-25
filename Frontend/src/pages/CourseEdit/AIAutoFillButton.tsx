import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faCopy, faFeather } from '@fortawesome/free-solid-svg-icons'
import { MouseEvent, useRef, useState } from 'react'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
    DialogOverlay
} from "@/components/ui/dialog"
import { toast } from 'sonner'

interface AIAutoFillButtonProps {
    text: string,
    setText: (s: string) => void,
    onClick: (e: MouseEvent) => void,
    loadingText: string
}

export default function AIAutoFillButton(props: AIAutoFillButtonProps) {
    const [isWaiting, setIsWaiting] = useState(true)
    const aiResponseRef = useRef<HTMLTextAreaElement>(null)
    const [isCopied, setIsCopied] = useState<boolean>(false);

    async function handleCopyClick() {
        if (!aiResponseRef.current || !navigator.clipboard) return;
        try {
            navigator.clipboard.writeText(aiResponseRef.current.value)
            setIsCopied(true)
            setTimeout(() => setIsCopied(false), 2000)
        } catch (err) {
            toast.message('Failed to copy text')
        }
    }

    function resetOnCancel() {
        setIsWaiting(true)
        setIsCopied(false)
        props.setText('')
    }

    return (
        <Dialog>
            <DialogTrigger className="flex flex-row items-center gap-x-2 cursor-pointer text-white px-4 py-2 rounded-xl font-bold transition-colors duration-300 ease-in-out bg-linear-to-bl from-violet-500 to-fuchsia-400 hover:to-blue-500 hover:from-fuchsia-500"
                onClick={props.onClick}
            >
                <FontAwesomeIcon icon={faFeather} className='text-white'/>AI autofill
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-center text-zinc-700">
                        AI Generated Description
                    </DialogTitle>
                </DialogHeader>
                {/* body */}
                {
                    isWaiting ? <p>{props.loadingText}</p> :
                    <div className='flex flex-col gap-y-2'>
                        <button className='text-zinc-700 cursor-pointer bg-zinc-200 hover:bg-zinc-300 flex flex-row gap-x-1 items-center rounded-lg p-2 ml-auto'
                            onClick={handleCopyClick}
                        >
                            Copy {isCopied ? <FontAwesomeIcon icon={faCheck}/> : <FontAwesomeIcon icon={faCopy}/>}
                        </button>
                        <textarea ref={aiResponseRef} rows={10} name="aiResponse" id="aiResponse" disabled={true}
                            value={props.text}
                            className='resize-none p-2 text-black border border-zinc-300 rounded-lg'
                        ></textarea>
                    </div>
                }

                <DialogFooter>
                    <DialogClose
                        className='text-white p-2 font-bold bg-zinc-400 rounded-lg hover:bg-zinc-800'
                        onClick={resetOnCancel}
                    >
                        Cancel
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    )
}