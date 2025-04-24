export interface IVideo {
    title: string;
    duration: string;
    description: string | null;
    link: string,
    isPublic: boolean
}
export interface ISection {
    title: string;
    videos: IVideo[]
}
export interface IDocument {
    title: string;
    description: string | null;
    link: string;
}

export interface IQuizQuestion {
    question: string;
    choices: string[];
    answer: number | null;
}
export interface IQuiz {
    title: string;
    description: string | null;
    questions: IQuizQuestion[]
    duration: number
}

export interface ICourse {
    course_id: number;
    title: string;
    short_description: string;
    // descriptions: string;
    sections: ISection[];
    documents: IDocument[]
    quizzes: IQuiz[],
    fee: number,
}