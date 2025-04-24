import { Section, Video, Document } from "./types"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'

import { useEffect, useState } from "react"
import AddFileDialog from "./AddFileDialog"

import { DialogClose } from "@/components/ui/dialog"
import { useItemPortalContext } from "./context"
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities"
import { Switch } from "@/components/ui/switch"

interface SectionContentItemProps {
    content: Video | Document,
    handleSaveContent: (title: string, description: string, file: File | null, isPublic: boolean) => void

    index: number | null
    listeners?: SyntheticListenerMap
}

export default function SectionContentItem(props: SectionContentItemProps) {
    const { tempChangedSelectedItem, setTempChangedSelectedItem } = useItemPortalContext()
    const [tempTitle, setTempTitle] = useState(props.content.title)
    const [tempDescription, setTempDescription] = useState(props.content.description)
    const [tempFile, setTempFile] = useState(props.content.file)
    const [tempIsPublic, setTempIsPublic] = useState((props.content as Video).isPublic)

    const [flagBlockSave, setFlagBlockSave] = useState(false)
    // console.log((props.content as Video).isPublic)
    function handleCancelEditting() {
        setTempTitle(props.content.title)
        setTempDescription(props.content.description)
        setTempFile(props.content.file)
        setTempIsPublic((props.content as Video).isPublic)
    }

    useEffect(() => {

        setTempTitle(props.content.title)
        setTempDescription(props.content.description)
        setTempFile(props.content.file)
        setTempIsPublic((props.content as Video).isPublic)
    }, [props.content])

    useEffect(() => {
        if (tempTitle === '' || tempFile === null) {
            setFlagBlockSave(false)
        } else {
            setFlagBlockSave(true)
        }
    }, [tempTitle, tempFile])

    return (
        <li className="w-full max-w-full flex flex-row gap-x-4 py-2" key={props.content.id}>
            {/* Drag icon */}
            {
                typeof props.index === 'number' && props.listeners ? 
                    <div className="w-4 text-zinc-500 flex flex-col items-center gap-y-2">
                        {props.index + 1}
                        <FontAwesomeIcon className="cursor-pointer" icon={faBars} {...props.listeners}/>
                    </div> : <></>
            }


            {/* Title + Description */}
            <div className="w-4/5 lg:w-5/6 flex flex-none flex-col gap-y-1">
                {/* title */}
                <div className="w-full">
                    <p className="max-w-full font-semibold text-lg truncate">
                        {props.content.title}
                    </p>
                </div>

                {/* description */}
                <div className="w-full">
                    <p className="max-w-full text-wrap truncate">
                        {props.content.description}
                    </p>
                </div>
            </div>

            {/* Edit button */}
            <div className="ml-auto">
                <AddFileDialog
                    trigger={
                        <div
                            className="cursor-pointer text-zinc-500"
                            title="Edit video"
                        >
                            <FontAwesomeIcon icon={faEdit}/>
                        </div>
                    }

                    okButton={
                        <DialogClose className={`w-20 text-white font-bold px-auto py-2 rounded-lg ${flagBlockSave ? 'cursor-pointer bg-green-400' : 'cursor-not-allowed bg-zinc-400'}`}
                            onClick={(e) => {
                                if (!flagBlockSave) {
                                    e.preventDefault()
                                    // e.stopPropagation()
                                    return;
                                }
                                props.handleSaveContent(tempTitle, tempDescription, tempFile, tempIsPublic)
                            }}
                        >
                            OK
                        </DialogClose>
                    }

                    additionalBody={
                        <div className="flex flex-row items-center gap-x-2">
                            <Switch
                                // id="isPublic"
                                checked={tempIsPublic}
                                onCheckedChange={setTempIsPublic}
                            />
                            <span className="font-bold">Is public</span>
                        </div>
                    }

                    onCancel={ handleCancelEditting }

                    onClickAIAutoFill={() => {}}

                    fileAcceptType="video/*"

                    title={tempTitle}
                    setTitle={setTempTitle}

                    description={tempDescription}
                    setDescription={setTempDescription}

                    file={tempFile}
                    setFile={setTempFile}
                />
            </div>

            {/* Delete button */}
            <div>
                <button
                    className="cursor-pointer text-red-500"
                    title="Delete video"
                    onClick={() => {
                        if (!tempChangedSelectedItem || !Object.keys(tempChangedSelectedItem as Section).includes("content")) return;
                        
                        setTempChangedSelectedItem(prev => {
                            if (!prev) return null;
                            return {
                                ...prev,
                                content: (prev as Section).content.filter(item => item.id !== props.content.id)
                            }
                        })
                    }}
                >
                    <FontAwesomeIcon icon={faTrash}/>
                </button>
            </div>
        </li>
    )
}