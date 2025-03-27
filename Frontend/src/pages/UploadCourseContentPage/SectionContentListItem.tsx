import { faBars, faFilePdf, faQuestion, faTrash, faVideo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Material } from './types'
import { CSS } from  '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable';
import { toast } from "sonner"
interface SectionContentListItemProps {
    material: Material
    onRemove: (id: number) => void
    selected: boolean
}

export default function SectionContentListItem(props: SectionContentListItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({id: props.material.id});
    const material = props.material
    const dragItemStyle = {
        transform: CSS.Transform.toString(transform),
        transition
    }
    return (
        <li ref={setNodeRef} {...attributes} style={ dragItemStyle } key={material.id}
            className={`${props.selected? 'bg-zinc-200' : ''} select-none cursor-pointer border border-gray-300 py-2 px-4 rounded-lg ${props.selected? '' : 'hover:bg-gray-100'} flex flex-row gap-x-2`}
        >
            {/* icon */}
            <div className='w-5 justify-end text-gray-400'>
                {
                    (() => {
                        switch (material.type) {
                            case 'video':       return (<FontAwesomeIcon title='Video' icon={faVideo}/>)
                            case 'quiz':        return (<FontAwesomeIcon title='Question' icon={faQuestion}/>)
                            case 'document':    return (<FontAwesomeIcon title='Document' icon={faFilePdf}/>)
                            default:            return (<></>)
                        }
                    })()
                }
            </div>

            {/* title */}
            <div>
                {material.title}
            </div>

            {/* delete icon */}
            <div className='ml-auto'>
                <button className='cursor-pointer' onClick={(e) => {
                    props.onRemove? props.onRemove(material.id as number) : ''
                    
                    e.stopPropagation()
                }}>
                    <FontAwesomeIcon icon={faTrash} title="Delete content" className='text-gray-400 hover:text-zinc-500'/>
                </button>
            </div>

            {/* drag icon */}
            <div className='cursor-grabbing'>
                <FontAwesomeIcon className='text-gray-400 hover:text-gray-500' title="Drag to change the content's order" icon={faBars} {...listeners}/>
            </div>
        </li>
    )
}