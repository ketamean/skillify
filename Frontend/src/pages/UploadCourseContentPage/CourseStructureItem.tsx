import { faBars, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactElement } from "react";
import { CSS } from  '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable';
interface CourseStructureItemProps {
    id: number,
    title: string
    nVideos?: number,
    nQuizzes?: number,
    nDocuments?: number,
    onClick?: (e: any | undefined) => void,
    onRemove?: (id: number) => void,
    selected?: boolean
}

const defaultProps: CourseStructureItemProps = {
    id: 0,
    title: "Section",
    nVideos: 0,
    nQuizzes: 0,
    nDocuments: 0,
    onClick: (_) => {},
    onRemove: (_) => {},
    selected: false
}

export default function CourseStructureItem(props: CourseStructureItemProps): ReactElement {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({id: props.id});
    const thisProps = {...defaultProps, ...props}
    const dragItemStyle = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.7 : 1,
    }
    
    return (
        // <div key={thisProps.id}>
            <li onClick={thisProps.onClick}
                ref={setNodeRef} {...attributes} style={ dragItemStyle } key={props.id}
                className={`${isDragging? 'z-1000' : 'z-10'} border-l-3 flex flex-row  ${thisProps.selected? 'border-green-900' : 'border-light-green hover:bg-green-200 hover:border-mint'} rounded-xl ${thisProps.selected? 'bg-green-300' : 'bg-tea-green'} w-full p-2 select-none cursor-pointer`}
            >
                <div className="w-full max-w-full text-wrap truncate">
                    <p className="font-bold">
                        {thisProps.title}
                    </p>
                    <p className="text-gray-500 text-sm">
                        {thisProps.nVideos} video{thisProps.nVideos === 1 ? "" : "s"}, {thisProps.nQuizzes} quiz{thisProps.nQuizzes === 1 ? "" : "zes"}, {thisProps.nDocuments} document{thisProps.nDocuments === 1 ? "" : "s"}
                    </p>
                </div>
                <div className="ml-3 flex flex-row gap-x-2 h-fit">
                    <button className="cursor-pointer h-fit w-fit" title="Delete section"
                        onClick={(e) => {
                            e.stopPropagation()
                            thisProps.onRemove? thisProps.onRemove(thisProps.id) : ''
                        }}
                    >
                        <FontAwesomeIcon icon={faTrash} className="text-red-500 hover:text-red-700"/>
                    </button>
                    <button
                        className={`${isDragging? 'cursor-grabbing' : 'cursor-pointer'} h-fit w-fit`} title="Drag section">
                        <FontAwesomeIcon icon={faBars} className="text-gray-500 hover:text-gray-700" {...listeners}/>
                    </button>
                </div>
            </li>
        // </div>
    )
}