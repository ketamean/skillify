import { DragEndEvent, UniqueIdentifier } from "@dnd-kit/core";
import { Material, Section } from './types'
import { arrayMove } from "@dnd-kit/sortable";
export function getDragItemPosition(itemId: UniqueIdentifier, items: Material[] | Section[]) {
    return items.findIndex((item) => item.id === itemId)
}

export function handleDragEnd(e: DragEndEvent, items: any[], setItems: (items: any[]) => void, draggable: boolean = true) {
    if (!draggable) {
        // e.preventDefault();
        return
    }
    const { active, over } = e
    if (!active || !over || active.id === over.id) return

    const oldIndex = getDragItemPosition(active.id, items)
    const newIndex = getDragItemPosition(over.id, items)
    setItems( arrayMove(items, oldIndex, newIndex) )
}