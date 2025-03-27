import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import SectionContentListItem from "./SectionContentListItem"
import { Material } from "./types"
import {closestCorners, DndContext, PointerSensor, useSensor} from "@dnd-kit/core"
import {SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { faBars } from "@fortawesome/free-solid-svg-icons"
import { handleDragEnd } from "./handlers"
// import { useState } from "react"
interface SectionContentListProps {
    contentList: Material[],
    setContentList: (materials: Material[]) => void,
    currentMaterial: Material | null,
    setCurrentMaterial: (material: Material | null) => void
}

export default function SectionContentList(props: SectionContentListProps) {
    const pointerSensor = useSensor(PointerSensor, {
        activationConstraint: {distance: 5}
    })
    const onRemoveItem = (id: number) => {
        const newMaterials = props.contentList.filter((mat) => mat.id !== id)
        props.setContentList(newMaterials)
    }
    return (
        <DndContext sensors={[pointerSensor]} collisionDetection={closestCorners} onDragEnd={(e) => handleDragEnd(e, props.contentList, props.setContentList) } modifiers={[restrictToVerticalAxis]}>
            <ol className="flex flex-col gap-y-2" id="section-content-list">
                <SortableContext items={props.contentList.map((material) => material.id)} strategy={verticalListSortingStrategy}>
                    {
                        props.contentList? (
                            <>
                                <p className="ml-auto text-sm text-gray-400">Drag <FontAwesomeIcon icon={faBars}/> to change its order in the section</p>
                                {
                                    props.contentList.map((material) => (
                                        <div onClick={() => {
                                            props.setCurrentMaterial(material)
                                        }} key={material.id}>
                                            <SectionContentListItem onRemove={onRemoveItem} material={material} selected={material.id === props.currentMaterial?.id}/>
                                        </div>
                                    ))
                                }
                            </>
                        ) : <></>
                    }
                </SortableContext>
            </ol>
        </DndContext>
    )
}

