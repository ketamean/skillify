import { faFile, faTrash, faUpload } from "@fortawesome/free-solid-svg-icons"
import { Video, Document, Quiz, Material, Section } from "./types"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState, DragEvent, ChangeEvent, useEffect } from "react"
import {fileTypeFromBlob} from 'file-type'
import { toast } from "sonner"
import { AlignCenter } from "lucide-react"

interface ContentEditorProps {
    material: Material //Video | Document | Quiz
    setCurrentMaterial: (material: Material) => void
    children?: React.ReactNode
}

interface FileDropZoneProps {
    accept: string
    setNewSectionData: React.Dispatch<React.SetStateAction<Section>>
}

function FileDropZone(props: FileDropZoneProps) {
    const [isOnDrag, setIsOnDrag] = useState<boolean>(false)
    const [file, setFile] = useState<File | null>(null)
    useEffect(() => {
        props.setNewSectionData(prev => {
            return {
                ...prev,
                
            }
        })
    }, [file])
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
        if (ev.dataTransfer.files) {
            if (ev.dataTransfer.files.length !== 1) {
                toast.error("You can only upload one file at a time")
                return
            }
            if ((await (validateFile(ev.dataTransfer.files[0]))))
                setFile(ev.dataTransfer.files[0]);
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
                    setFile(file);
                else
                    toast.error('File type not accepted')
            }
        }
    }

    const handleFileBrowse = async (ev: ChangeEvent<HTMLInputElement>) => {
        const files = ev.target.files
        if (files?.length !== 1) {
            toast.error("You can only upload one file at a time")
            return
        }
    }
    return (
        <>
            <div className="flex flex-row gap-x-2 items-center">
                <label htmlFor="fileinput">File</label>
                <FontAwesomeIcon icon={faTrash} className="ml-auto text-red-500 hover:text-red-700 cursor-pointer" onClick={(e) => setFile(null)}/>
            </div>
            <div className="flex w-full h-32 border-1 border-gray-400 border-dashed rounded-lg items-center justify-center"
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
                    file?
                    <>
                        {file.name}
                    </>
                    :
                    <>
                        <div className="flex flex-col gap-y-2 items-center">
                            <p><FontAwesomeIcon className="text-black" icon={isOnDrag? faFile : faUpload}/> Drop files here or browse files</p>

                            <p className="text-sm">Accept type: {accept.join(', ')}.</p>
                        </div>
                        <input type="file" name="fileinput" id="fileinput" accept={props.accept} className="opacity-0 w-0"
                            onChange={(ev) => handleFileBrowse(ev)}
                        />
                    </>
                }
            </div>
        </>
    )
}

export default function ContentEditor(props: ContentEditorProps) {
    let material = props.material
    const [title, setTitle] = useState<string>(material.title)
    const [description, setDescription] = useState<string>(material.description)
    const [newMaterial, _] = useState<Material>(material)
    const materialType = material.type.charAt(0).toUpperCase() + material.type.substring(1)
    useEffect(() => {
        newMaterial.title = title
        newMaterial.description = description
    }, [title, description])
    return (
        <div className="w-full h-full pb-2 rounded-xl flex flex-col gap-y-4 min-w-fit">
            <div className="flex flex-row items-center gap-x-3">
                <h3>Editing {materialType}</h3>
                <button className="flex flex-row ml-auto items-center bg-light-green py-2 px-4 rounded-lg text-green-800 font-semibold hover:bg-light-teal cursor-pointer"
                    onChange={() => {
                        Object.assign(material, newMaterial)
                    }}
                >
                    Save
                </button>
            </div>
            <div className="flex flex-col gap-y-1">
                <label htmlFor="materialtitle">{materialType} Title</label>
                <input className=" px-2 h-10 border border-gray-300 rounded-sm" type="text" name="materialtitle" id="materialtitle" value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            <div className="flex flex-col gap-y-1">
                <label htmlFor="sectiondescription">{materialType} Description</label>
                <textarea className=" px-2 h-32 border border-gray-300 rounded-sm resize-none" name="sectiondescription" id="sectiondescription" value={description}
                    onChange={(e) => setDescription(e.target.value)}
                ></textarea>
            </div>
            {props.children? props.children : <></>}
        </div>
    )
}

interface ConcreteContentEditorProps {
    material: Material
    setCurrentMaterial: (material: Material) => void
    setNewSectionData: React.Dispatch<React.SetStateAction<Section>>
}

export function VideoEditor(props: ConcreteContentEditorProps) {
    const material = props.material as Video
    return (
        <ContentEditor material={material} setCurrentMaterial={props.setCurrentMaterial}>
            <FileDropZone accept={'video/*'} setNewSectionData={props.setNewSectionData}/>
        </ContentEditor>
    )
}

export function DocumentEditor(props: ConcreteContentEditorProps) {
    const material = props.material as Document
    return (
        <ContentEditor material={material} setCurrentMaterial={props.setCurrentMaterial}>
            <FileDropZone accept={'.md,.pdf.docx,.doc'} setNewSectionData={props.setNewSectionData}/>
        </ContentEditor>
    )
}

export function QuizEditor(props: ConcreteContentEditorProps) {
    const material = props.material as Quiz
    return (
        <ContentEditor material={material} setCurrentMaterial={props.setCurrentMaterial}>
            <div className="flex flex-col gap-y-1">
            </div>
        </ContentEditor>
    )
}