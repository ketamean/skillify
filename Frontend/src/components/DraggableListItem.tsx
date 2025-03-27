import { useSortable } from "@dnd-kit/sortable";
import { CSS } from  '@dnd-kit/utilities'
interface DraggableListItemProps {
    className: string,
    item: any
}

export default function DraggableListItem(props: DraggableListItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
      } = useSortable({ id: props.item.id });
    const dragItemStyle = {
        transform: CSS.Transform.toString(transform)
    }
    return (
        <li className={props.className}
            ref={setNodeRef} {...attributes} {...listeners}
            style={dragItemStyle}
        >

        </li>
    )
}