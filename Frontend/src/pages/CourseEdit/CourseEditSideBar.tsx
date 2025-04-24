import { MouseEvent, useEffect, useState } from "react"
import { useItemPortalContext } from "./context"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faChevronDown, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import {closestCorners, DndContext, PointerSensor, useSensor} from "@dnd-kit/core"
import {SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable"
import { useSortable } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { CSS } from  '@dnd-kit/utilities'
import { getNewId, handleDragEnd } from "./handlers";
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
import FileDropZone from "./FileDropZone";
import { Document, Section, Quiz, CourseDescription } from "./types";

// interface CourseEditSideBarProps {}

interface CollapsibleProps {
    title: string,
    children: React.ReactNode,
}



interface DraggableCollapsibleProps<T extends Section | Document | Quiz | CourseDescription> { //{ id: number; title: string; description: string, content?: Video[], type?: MaterialType, file?: File | null, duration?: string, questions?: QuizQuestion[] }
    title: string,
    items: T[],
    setItems: (items: T[]) => void,
    type: "document" | "section" | "quiz" | "description"
}

interface SortableItemProps {
    id: number
    title: string
    onClick: (e: MouseEvent<HTMLDivElement>) => void
    onRemove: (id: number) => void
    selected: boolean
}

function Collapsible(props: CollapsibleProps) { // <T extends {id: number}>
    const [isOpen, setIsOpen] = useState(false);
    const contentId = `collapsible-content-${props.title.replace(/\s+/g, '-')}`;

    return (
        <div className="w-full border border-gray-300 rounded-md mb-4 overflow-hidden">
            {/* Header section */}
            <button
                type="button"
                onClick={() => {
                    setIsOpen(prev => !prev)
                }}
                className="flex justify-between items-center w-full p-4 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-150"
                aria-expanded={isOpen}
                aria-controls={contentId}
            >
                <span className="font-semibold text-gray-800">{props.title}</span>
    
                {/* Font Awesome Icon */}
                <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`h-4 w-4 text-gray-600 transform transition-transform duration-300 ease-in-out ${
                        isOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                    aria-hidden="true"
                />
            </button>
    
            {/* Content section */}
            <div
                id={contentId}
                className={`
                    px-4 py-2 w-full min-w-full max-w-full overflow-hidden transition-[max-height,opacity] duration-500 ease-in-out ${
                    isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}
                `}
            >
                <div className="bg-white text-gray-700">
                    {props.children}
                </div>
            </div>
        </div>
    )
}

function SortableItem(props: SortableItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({id: props.id});
    const dragItemStyle = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.7 : 1,
    }
    return (
        <div
            onClick={(e) => props.onClick(e)}
            ref={setNodeRef} {...attributes} style={ dragItemStyle } key={props.id}
            className={`${isDragging? 'z-1000' : 'z-10'} border-l-3 flex flex-row  ${props.selected? 'border-green-900' : 'border-light-green hover:bg-green-200 hover:border-mint'} rounded-xl ${props.selected? 'bg-green-300' : 'bg-green-100'} w-full p-2 select-none cursor-pointer`}
        >
            <p className="w-full max-w-full text-wrap truncate font-bold">
                {props.title}
            </p>

            <div className="ml-3 flex flex-row gap-x-2 h-fit">
                <button className="cursor-pointer h-fit w-fit" title="Delete section"
                    onClick={(e) => {
                        e.stopPropagation()
                        props.onRemove(props.id)
                    }}
                >
                    <FontAwesomeIcon icon={faTrash} className="text-red-500 hover:text-red-700"/>
                </button>
                <button className={`${isDragging? 'cursor-grabbing' : 'cursor-pointer'} h-fit w-fit`} title="Drag section">
                    <FontAwesomeIcon icon={faBars} className="text-gray-500 hover:text-gray-700" {...listeners}/>
                </button>
            </div>
        </div>
    )
}

function DraggableCollapsible<T extends Section | Document | Quiz | CourseDescription>(props: DraggableCollapsibleProps<T>) { // {id: number, title: string, description: string, content?: Video[], file?: File | null}
    const pointerSensor = useSensor(PointerSensor, {
        // activationConstraint: {distance: 5}
    })
    const { currentSelectedItem, setCurrentSelectedItem } = useItemPortalContext()

    // for adding
    const [ newTitle, setNewTitle ] = useState('')
    const [ newDescription, setNewDescription ] = useState('')
    // for document only
    const [ newDocumentFile, setNewDocumentFile ] = useState<File | null>(null)
    function handleOnCancelDialog() {
        setNewDescription('')
        setNewTitle('')
        setNewDocumentFile(null)
    }

    const createNewItem = (): T => {
        const baseItem = {
            id: getNewId(props.items),
            title: newTitle,
            description: newDescription,
        };

        switch (props.type) {
            case 'section':
                return {
                    ...baseItem,
                    content: [],
                } as unknown as T;
            
            case 'document':
                return {
                    ...baseItem,
                    type: 'document',
                    file: newDocumentFile,
                } as T;
            
            case 'quiz':
                return {
                    ...baseItem,
                    type: 'quiz',
                    content: [],
                } as unknown as T;
            case 'description':
                return {
                    ...baseItem
                } as unknown as T
        }
    };

    return (
        <Collapsible title={props.title}>
            <DndContext sensors={[pointerSensor]} collisionDetection={closestCorners}
                onDragEnd={(e) => {
                    handleDragEnd(
                        e,
                        props.items,
                        props.setItems
                    )
                } }
                modifiers={[restrictToVerticalAxis]}
            
            >
                <SortableContext
                    items={ props.items.map((item) => item.id) }
                    strategy={verticalListSortingStrategy}
                >
                    <div className="flex flex-col gap-y-2 w-full">
                        {
                            !props.items? <></> : props.items.map((item) => {
                                return (
                                    <SortableItem
                                        key={`${props.type}${item.id}`}
                                        id={item.id}
                                        title={item.title}
                                        selected={currentSelectedItem?.type === props.type && currentSelectedItem?.id === item.id}
                                        onClick={() => {
                                            if ( currentSelectedItem?.type === props.type && currentSelectedItem?.id === item.id ) return;
                                            setCurrentSelectedItem({
                                                type: props.type,
                                                id: item.id
                                            })
                                        }}

                                        onRemove={(id: number) => {
                                            props.setItems(
                                                props.items.filter((item) => item.id !== id)
                                            )

                                            if (id === currentSelectedItem?.id) {
                                                setCurrentSelectedItem(null)
                                            }
                                        }}
                                    />
                                )
                            })
                        }
                    </div>
                </SortableContext>
            </DndContext>

            {/* Button: Add */}
            <Dialog>
                {/* Trigger */}
                <DialogTrigger className="mt-2 text-zinc-500 bg-green-200 cursor-pointer p-2 rounded-lg font-semibold hover:bg-green-300">
                    <FontAwesomeIcon icon={faPlus} /> Add              
                </DialogTrigger>

                <DialogOverlay className="z-0" onClick={handleOnCancelDialog}></DialogOverlay>
                <DialogContent>
                    {/* Header */}
                    <DialogHeader>
                        <DialogTitle className="text-center text-zinc-700">
                            Add
                        </DialogTitle>
                        <DialogDescription className="text-center text-zinc-600">
                            Add a new thing to the course.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Body */}
                    <div className="w-full">
                        {/* Title */}
                        <div className="w-full flex flex-col gap-y-2">
                            <label htmlFor="main-edit-title">Title</label>
                            <input className=" px-2 h-10 border border-gray-300 rounded-sm" type="text" name="main-edit-title" id="main-edit-title"
                                value={newTitle}
                                onChange={(e) => {
                                    setNewTitle(e.target.value)
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
                                    setNewDescription(e.target.value)
                                }}
                                value={newDescription}
                                rows={6}
                                maxLength={1000}
                            ></textarea>
                        </div>

                        {/* File input: if any */}
                        {
                            props.type === 'document' ?
                                <FileDropZone
                                    accept={'.pdf,.docx,.pptx,.txt,.md'}
                                    file={newDocumentFile}
                                    setFile={setNewDocumentFile}
                                /> : <></>
                        }
                    </div>

                    {/* Footer */}
                    <DialogFooter>
                        <DialogClose
                            className="w-20 text-white px-auto py-2 rounded-lg bg-zinc-600 cursor-pointer"
                            onClick={handleOnCancelDialog}
                        >
                            Cancel
                        </DialogClose>

                        <DialogClose
                            className='w-20 text-white font-bold px-auto py-2 rounded-lg cursor-pointer bg-green-400'
                            onClick={() => {
                                const newItem = createNewItem();
                                props.setItems([...props.items, newItem]);
                                setCurrentSelectedItem({
                                    type: props.type,
                                    id: newItem.id
                                })
                                handleOnCancelDialog();
                            }}
                        >
                            Add
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Collapsible>
    )
}

export default function CourseEditSideBar() {
    const { sections, setSections, documents, setDocuments, quizzes, setQuizzes, courseDescriptionList, setCourseDescriptionList} = useItemPortalContext()

    return (
        <div className="flex flex-col w-full">
            <DraggableCollapsible<CourseDescription> title="Descriptions" items={courseDescriptionList} setItems={setCourseDescriptionList} type="description"/>

            <DraggableCollapsible<Section> title="Sections" items={sections} setItems={setSections} type="section"/>
            
            <DraggableCollapsible<Document> title="Documents" items={documents} setItems={setDocuments} type="document"/>

            <DraggableCollapsible<Quiz> title="Quizzes" items={quizzes} setItems={setQuizzes} type="quiz"/>
        </div>
    )
}