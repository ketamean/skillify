import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

export function getItemPositionById<T extends { id: number }>(itemId: number, items: T[]) {
    return items.findIndex((item) => item.id === itemId)
}

export function handleDragEnd<T extends { id: number }>(e: DragEndEvent, items: T[], setItems: (items: T[]) => void) {
    const { active, over } = e
    if (!active || !over || active.id === over.id) return

    const oldIndex = getItemPositionById(active.id as number, items)
    const newIndex = getItemPositionById(over.id as number, items)
    setItems( arrayMove(items, oldIndex, newIndex) )
}

export function getNewId<T extends { id: number }>(items: T[]) {
    if (items.length === 0) return 1
    return Math.max( ...(items.map(item => item.id)) ) + 1
}

export function isEqualObjects(obj1: {[key: string]: any} | null, obj2: {[key: string]: any} | null) {
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return false
    if (obj1 === null && obj2 === null) return true
    if (!obj1 || !obj2) return false

    const keys1 = Object.keys(obj1)
    const keys2 = Object.keys(obj2)

    if (keys1.length !== keys2.length) return false
    
    // check whether there is any key in obj1 that is not in obj2
    for (const key of keys1) if (!keys2.includes(key)) return false

    for (const key of keys1) {
        if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
            if (!isEqualObjects(obj1[key], obj2[key])) return false;
        } else if (obj1[key] !== obj2[key]) return false;
    }

    return true
}

export function formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.round((seconds - Math.floor(seconds)) * 1000); // Milliseconds

    const paddedHours = hours.toString().padStart(2, '0');
    const paddedMinutes = minutes.toString().padStart(2, '0');
    const paddedSecs = secs.toString().padStart(2, '0');
    // const paddedMs = ms.toString().padStart(3, '0');

    let timeString = `${paddedMinutes}:${paddedSecs}`;
    if (hours > 0) {
        timeString = `${paddedHours}:${timeString}`;
    }
    return timeString;
}

export function getVideoDuration(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const videoElement = document.createElement('video');
        videoElement.preload = 'metadata';
        const objectURL = URL.createObjectURL(file);

        videoElement.onloadedmetadata = () => {
            URL.revokeObjectURL(objectURL); // Free up memory
            const duration = videoElement.duration;
            resolve(formatDuration(duration));
        };

        videoElement.onerror = () => {
            URL.revokeObjectURL(objectURL); // Free up memory
            reject(new Error('Failed to load video metadata'));
        };

        videoElement.src = objectURL;
    });
}