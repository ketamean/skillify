export interface FetchedVideo {
    id: number,
    title: string,
    path: string,
    duration: string,
    description: string,

    isPublic: boolean
}

export interface FetchedSection {
    id: number,
    title: string,
    description: string,
    videos: FetchedVideo[]
}

export interface FetchedQuiz {
    id: number,
    title: string,
    description: string,
    duration: number
    questions: FetchedQuizQuestion[]
}

export interface FetchedQuizQuestion {
    id: number,
    question: string,
    choices: string[],
    answer: number | null
}

export interface FetchedDocument {
    id: number,
    title: string,
    description: string,
    path: string
}

export interface FetchedCourse {
    course_id: string,
    title: string,
    description: string,
    lastUpdated: string,
    rating: number,
    students: number,
    skillLevel: string,
    languages: string,
    captions: string,
    lectures: number,
    sections: FetchedSection[],
    documents: FetchedDocument[],
    quizzes: FetchedQuiz[],
    fee: number,
    status: string,
    image_link: string,
}