import { UniqueIdentifier } from "@dnd-kit/core";

export type MaterialType = 'video' | 'document' | 'quiz'

export interface Course {
    id: UniqueIdentifier,  // the REAL key stored in the db
    title: string,
    short_description: string,
    sections: Section[],
    image: File | null,
    status: string,
}

export interface Section {
    id: number, // the FAKE key defined by the front end
    title: string,
    content: Video[],
    description: string
}

export interface Material {
    id: number, // the FAKE key defined by the front end
    title: string,
    description: string,
    type: MaterialType
}

export interface Video extends Material {
    type: 'video'
    file: File | null
    duration: string
}

export interface Quiz extends Material {
    type: 'quiz'
    content: QuizQuestion[]
}

export interface Document extends Material {
    type: 'document',
    file: File | null
}

export interface QuizQuestion {
    id: number,
    question: string,
    answers: string[],
    key: number | null
}