import { UniqueIdentifier } from "@dnd-kit/core";

export type MaterialType = 'video' | 'document' | 'quiz'

export interface Section {
    id: UniqueIdentifier,
    title: string,
    content: Material[],
    description: string
}

export interface Material {
    id: UniqueIdentifier,
    title: string,
    description: string,
    type: MaterialType
}

export interface Video extends Material {
    type: 'video'
    file: File | null,
    fileType: string,
}

export interface Quiz extends Material {
    type: 'quiz'
}

export interface Document extends Material {
    type: 'document',
    file: File | null,
    fileType: string,
}