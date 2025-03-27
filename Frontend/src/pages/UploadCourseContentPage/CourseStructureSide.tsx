import { ReactElement } from "react";
import { Section } from './types'
import CourseStructureItem from "./CourseStructureItem";
import {closestCorners, DndContext, PointerSensor, useSensor} from "@dnd-kit/core"
import {SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable"
import { handleDragEnd } from "./handlers"
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
interface CourseStructureSideProps {
    sections: Section[],
    setSections: (sections: Section[]) => void,
    currentSection: Section | null,
    setCurrentSection: (section: Section | null) => void
}

const defaultProps: CourseStructureSideProps = {
    sections: [],
    setSections: (_: Section[]) => {},
    currentSection: null,
    setCurrentSection: (_: Section | null) => {}
}

export default function CourseStructureSide(props: CourseStructureSideProps): ReactElement{
    const thisProps = {...defaultProps, ...props}
    const pointerSensor = useSensor(PointerSensor, {
        // activationConstraint: {distance: 5}
    })

    const onRemoveItem = (id: number) => {
        // console.log("Removing item with id ", id)
        const newSections = thisProps.sections.filter((sec) => sec.id !== id)
        thisProps.setSections(newSections)
        if (thisProps.currentSection?.id === id) {
            thisProps.setCurrentSection(null)
        }
    }

    return (
        <div className="bg-zinc-50 border-1 border-zinc-50 pt-4 pb-2 px-3 rounded-xl w-full h-full">
            <h3 className="mb-2">
                Course Structure
            </h3>
            <DndContext sensors={[pointerSensor]} collisionDetection={closestCorners} onDragEnd={(e) => handleDragEnd(e, thisProps.sections, thisProps.setSections) } modifiers={[restrictToVerticalAxis]}>
                <ol className="flex flex-col gap-y-2">
                    <SortableContext items={thisProps.sections.map((sec) => sec.id)} strategy={verticalListSortingStrategy}>
                        {
                            thisProps.sections?.map((element, index) => {
                                const nVideos = element.content.filter((mat) => mat.type === 'video').length
                                const nQuizzes = element.content.filter((mat) => mat.type === 'quiz').length
                                const nDocuments = element.content.filter((mat) => mat.type === 'document').length
                                return (
                                    <CourseStructureItem
                                        key={index}
                                        id={element.id as number} title={element.title} nVideos={nVideos} nQuizzes={nQuizzes} nDocuments={nDocuments}
                                        selected={element.id === thisProps.currentSection?.id}
                                        onClick={() => {
                                            // console.log("Clicked on section ", element)
                                            thisProps.setCurrentSection(element)
                                        }}
                                        onRemove={() => onRemoveItem(element.id as number)}
                                    />
                                )
                            })
                        }
                    </SortableContext>
                </ol>
            </DndContext>
        </div>
    )
}