import { useItemPortalContext } from "./context"
import { Section, Video } from "./types"
import Divider from "../../components/Divider"
import SectionContentItem from './SectionContentItem'
import {closestCorners, DndContext, PointerSensor, useSensor} from "@dnd-kit/core"
import {SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable"
import { useSortable } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { CSS } from  '@dnd-kit/utilities'
import { handleDragEnd } from "./handlers"

interface SortableItemProps {
    content: Video,
    handleSaveContent: (title: string, description: string, file: File | null) => void
    index: number | null
}

function SortableItem(props: SortableItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({id: props.content.id});
    const dragItemStyle = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.7 : 1,
    }
    return (
        <div ref={setNodeRef} {...attributes} style={ dragItemStyle } key={props.content.id}>
            <SectionContentItem
                key={props.content.id}
                content={props.content}
                index={props.index}
                handleSaveContent={props.handleSaveContent}
                listeners={listeners}
            />
        </div>

    )
}

export default function SectionContentList() {
    const { tempChangedSelectedItem, setTempChangedSelectedItem } = useItemPortalContext()
    const pointerSensor = useSensor(PointerSensor, {
        // activationConstraint: {distance: 5}
    })

    return (
        <>
            {
                !tempChangedSelectedItem || !Object.keys(tempChangedSelectedItem).includes("content") ? <></> :
                <DndContext sensors={[pointerSensor]} collisionDetection={closestCorners}
                    onDragEnd={(e) => {
                        handleDragEnd(
                            e,
                            (tempChangedSelectedItem as Section).content,
                            (newContentList: Video[]) => {
                                setTempChangedSelectedItem(prev => {
                                    if (!prev) return null
                                    return {
                                        ...prev,
                                        content: newContentList
                                    }
                                })
                            }
                        )
                    } }
                    modifiers={[restrictToVerticalAxis]}
                >
                    <SortableContext
                        items={ (tempChangedSelectedItem as Section).content.map((_, index) => index) }
                        strategy={verticalListSortingStrategy}
                    >
                        <ul>
                            {
                                (tempChangedSelectedItem as Section).content.map((item, index) => (
                                    <>
                                        <SortableItem
                                            key={`section${tempChangedSelectedItem.id}-${item.id}`}
                                            content={item}
                                            index={index}
                                            handleSaveContent={(title: string, description: string, file: File | null) => {
                                                setTempChangedSelectedItem(prev => {
                                                    if (!prev) return null
                                                    const newContentList = (prev as Section).content.map(
                                                        (item, idx) => idx !== index ? item :
                                                            {
                                                                ...item,
                                                                title,
                                                                description,
                                                                file
                                                            }
                                                    )
                                                    return {
                                                        ...prev,
                                                        content: newContentList
                                                    }
                                                })
                                            }}
                                        />
                                        {
                                            index < (tempChangedSelectedItem as Section).content.length - 1 ? <Divider className="h-[1px] bg-zinc-300" /> : <></>
                                        }
                                    </>
                                ))
                            }
                        </ul>
                    </SortableContext>
                </DndContext>
            }
        </>
    )
}