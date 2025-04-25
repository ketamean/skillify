import { UniqueIdentifier } from "@dnd-kit/core";

export type MaterialType = 'video' | 'document' | 'quiz'

export interface Course {
    id: UniqueIdentifier,  // the REAL key stored in the db
    title: string,
    short_description: string,
    sections: Section[],
    image: File | null,
    status: string,
    topics: CourseTopic[]
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

export interface CourseDescription {
    id: number
    title: string,
    description: string
}

export interface Video extends Material {
    type: 'video'
    file: File | null
    duration: string

    isPublic: boolean
}

export interface Quiz extends Material {
    type: 'quiz'
    content: QuizQuestion[]
    duration: number
}

export interface Document extends Material {
    type: 'document',
    file: File | null
}

export interface CourseTopic {
    id: number,
    name: string
}

export interface QuizQuestion {
    id: number,
    question: string,
    answers: string[],
    key: number | null
}

export interface SendAPIVideo {
    title: string;
    duration: string;
    link: string,
    description: string | null;
    isPublic: boolean;
}
export interface SendAPISection {
    title: string;
    videos: SendAPIVideo[]
}
export interface SendAPIDocument {
    title: string;
    description: string | null;
    link: string
}

export interface SendAPIQuizQuestion {
    question: string;
    choices: string[];
    answer: number | null;
}
export interface SendAPIQuiz {
    title: string;
    description: string | null;
    questions: SendAPIQuizQuestion[],
    duration: number
}

export interface SendCourseDescription {
    header: string,
    content: string
}
export interface SendAPICourse {
    course_id: number;
    title: string;
    short_description: string;
    descriptions: SendCourseDescription[];
    sections: SendAPISection[];
    documents: SendAPIDocument[]
    quizzes: SendAPIQuiz[]
    fee: number,
    topics: {id: number}[],
    image_link: string
}