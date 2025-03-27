import React, { useState, useSyncExternalStore } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  SensorDescriptor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { Material } from "../pages/UploadCourseContentPage/types"
import DraggableListItem from './DraggableListItem'
interface DraggableListProps {
    // sensors: SensorDescriptor<any>[],
    // // children: React.ReactNode | React.ReactNode[],
    items: Material[],
    children: React.ReactNode | React.ReactNode[],
    // draggable?: boolean,
    itemClassName: string,
}

export default function DraggableList(props: DraggableListProps) {
    const [items, setItems] = useState<Material[]>(props.items? props.items : []);

    const sensors = [
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5
            }
        }),

        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        }),

        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 250,
                tolerance: 5
            }
        })
    ]

    const [activeId, setActiveId] = useState<number | null>(null);

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as number);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        
        if (over && active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                
                return arrayMove(items, oldIndex, newIndex);
            });
        }
        
        setActiveId(null);
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
        >
            <ol className="flex flex-col gap-y-2">
                <SortableContext>
                    {
                        items.map((item) => (
                            <DraggableListItem className={itemClassName} key={item.id} id={item.id} activeId={activeId}>
                                {props.children}
                            </DraggableListItem>   
                        ))
                    }
                </SortableContext>
            </ol>
        </DndContext>

    )
}