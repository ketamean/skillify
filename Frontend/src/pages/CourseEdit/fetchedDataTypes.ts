export interface FetchedVideo {
    id: number,
    title: string,
    link: string,
    duration: string,
    description: string
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
    answers: string[],
    key: number | null
}

export interface FetchedDocument {
    id: number,
    title: string,
    description: string,
    link: string
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
    quizzes: FetchedQuiz[]
}