import {fileTypeFromBlob} from 'file-type'
import { toast } from "sonner"
import { useState, DragEvent, ChangeEvent, Dispatch, SetStateAction } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faUpload, faRemove } from '@fortawesome/free-solid-svg-icons'

interface FileDropZoneProps {
    accept: string
    file: File | null,
    setFile: Dispatch<SetStateAction<File | null>>
}

export default function FileDropZone(props: FileDropZoneProps) {
    const [isOnDrag, setIsOnDrag] = useState<boolean>(false)
    const accept = props.accept.split(',').map((type) => type.includes('/') ? type : type.split('.')[1])
    const validateFile = async (blob: File) => {
        const res = await fileTypeFromBlob(blob)
        if (!res) return false
        return accept.some(type => {
            if (type.includes('/'))
                return type.split('/')[0] === res?.mime.split('/')[0]
            return res?.ext === type
        })
    }

    const handleFileDrop = async (ev: DragEvent<HTMLDivElement>) => {
        try {
            if (ev.dataTransfer.files) {
                if (ev.dataTransfer.files.length !== 1) {
                    toast.error("You can only upload one file at a time")
                    return
                }
                if ((await (validateFile( ev.dataTransfer.files[0] ))))
                    props.setFile(ev.dataTransfer.files[0]);
                else
                    toast.error('File type not accepted')
            } else {
                if (ev.dataTransfer.items.length !== 1) {
                    toast.error("You can only upload one file at a time")
                    return
                }
                const item = ev.dataTransfer.items[0];
                if (item.kind === "file") {
                    const file = item.getAsFile();
                    if (file && (await (validateFile(file))))
                        props.setFile(file);
                    else
                        toast.error('File type not accepted')
                }
            }
        } catch (_) {
            toast.error("Error while processing file")
        }
    }

    const handleFileBrowse = async (ev: ChangeEvent<HTMLInputElement>) => {
        const files = ev.target.files
        if (files?.length !== 1) {
            toast.error("You can only upload one file at a time")
            return
        }
        props.setFile(files[0])
    }

    return (
        <>
            <div className="flex flex-row gap-x-2 items-center">
                <label htmlFor="fileinput">File</label>
                {
                    props.file?
                        <button className='ml-auto' onClick={() => props.setFile(null)}>
                            <FontAwesomeIcon className="cursor-pointer text-zinc-500" title="Remove file" icon={faRemove}/>
                        </button>
                         :
                        <></>
                }
            </div>
            <div className="flex relative w-full h-32 border-1 border-gray-400 border-dashed rounded-lg items-center justify-center"
                onDrop={async (ev) => {
                    ev.preventDefault();
                    setIsOnDrag(false);
                    handleFileDrop(ev);
                }}
                onDragOver={(e) => {
                    setIsOnDrag(true);
                    e.preventDefault();
                }}
            >
                {
                    props.file?
                    <>
                        <p className='text-lg font-semibold text-center'>
                            {props.file.name}
                        </p>
                    </>
                    :
                    <div className="flex flex-col gap-y-2 items-center">
                        <p><FontAwesomeIcon className="text-black" icon={isOnDrag? faFile : faUpload}/> Drop file here or browse file</p>
                        <p className="text-sm">Accept type: {accept.join(', ')}.</p>
                    </div>
                }
                <input type="file" name="fileinput" id="fileinput" accept={props.accept} className="opacity-0 absolute bottom-0 w-full h-full z-0"
                    onChange={(ev) => handleFileBrowse(ev)}
                />
            </div>
        </>
    )
}