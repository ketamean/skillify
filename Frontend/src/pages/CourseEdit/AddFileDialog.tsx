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
import FileDropZone from "./FileDropZone"

import AIAutoFillButton from './AIAutoFillButton'
import { Dispatch, ReactElement, SetStateAction, MouseEvent } from "react"

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faEdit } from '@fortawesome/free-solid-svg-icons'

interface AddFileDialogProps {
    trigger: ReactElement
    onCancel?: () => void
    okButton: ReactElement

    onClickAIAutoFill: (e: MouseEvent) => void

    fileAcceptType: string

    title: string,
    setTitle: Dispatch<SetStateAction<string>>

    description: string
    setDescription: Dispatch<SetStateAction<string>>

    file: File | null
    setFile: Dispatch<SetStateAction<File | null>>

    additionalBody?: ReactElement
}

export default function AddFileDialog(props: AddFileDialogProps) {
    function _handleOnCancel() {
        props.setTitle('')
        props.setDescription('')
        props.setFile(null)
    }

    const handleOnCancel = props.onCancel? props.onCancel : _handleOnCancel;
    return (
        <Dialog>
            <DialogTrigger className="ml-auto">
                {props.trigger}
            </DialogTrigger>
            <DialogOverlay className="z-0" onClick={() => {
                handleOnCancel();
            }}>
            </DialogOverlay>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-center text-zinc-700">
                        Set the content
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-600">
                        Set your video's title, description, and upload file.
                    </DialogDescription>
                </DialogHeader>
                <div className="w-full flex flex-col gap-y-2">
                    {/* AI Autofill button */}
                    <div className="ml-auto">
                        <AIAutoFillButton onClick={props.onClickAIAutoFill} />
                    </div>
                    {/* Title */}
                    <div className="w-full flex flex-col gap-y-2">
                        <label htmlFor="main-edit-title">Title</label>
                        <input className=" px-2 h-10 border border-gray-300 rounded-sm" type="text" name="main-edit-title" id="main-edit-title"
                            value={props.title}
                            onChange={(e) => {
                                props.setTitle(e.target.value)
                            }}
                            maxLength={100}
                        />
                    </div>

                    {/* Description */}
                    <div className="w-full flex flex-col gap-y-1">
                        <label htmlFor="main-edit-description">Description</label>
                        <textarea
                            className="px-2 py-1 border border-gray-300 rounded-sm resize-none"
                            name="main-edit-description" id="main-edit-description"
                            onChange={(e) => {
                                props.setDescription(e.target.value)
                            }}
                            value={props.description}
                            rows={6}
                            maxLength={1000}
                        ></textarea>
                    </div>

                    {/* File input */}
                    <FileDropZone
                        accept={props.fileAcceptType}
                        file={props.file}
                        setFile={props.setFile}
                    />

                    {/* Additional body */}
                    {
                        props.additionalBody ? props.additionalBody : <></>
                    }
                </div>
                <DialogFooter className="flex flex-row gap-x-6">
                    <DialogClose className="w-20 text-white px-auto py-2 rounded-lg bg-zinc-600 cursor-pointer"
                        onClick={handleOnCancel}
                    >
                        Cancel
                    </DialogClose>

                    {
                        props.okButton ? props.okButton : 
                        <DialogClose className='w-20 text-white font-bold px-auto py-2 rounded-lg cursor-pointer bg-green-400'>
                            OK
                        </DialogClose>
                    }
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}