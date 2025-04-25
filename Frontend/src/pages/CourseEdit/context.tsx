import React, { ReactNode, useContext } from "react"
import { CourseDescription, CourseTopic, Document, Quiz, Section } from "./types"

interface ItemPortalProviderProps {
    children: ReactNode
    value: ItemPortalContext
}

export interface CurrentSelectedItem {
    type: 'section' | 'document' | 'quiz' | 'description'
    id: number
}

interface ItemPortalContext {
    courseName: string,
    setCourseName: (name: string) => void

    courseStatus: string
    setCourseStatus: (s: string) => void,

    coursePicture: File | null
    setCoursePicture: React.Dispatch<React.SetStateAction<File | null>>

    courseDescription: string
    setCourseDescription: (description: string) => void

    sections: Section[]
    setSections: ( newSections: Section[] ) => void
    setSectionAtIndex: (newSection: Section, atIndex: number) => void,

    documents: Document[],
    setDocuments: (newDocuments: Document[]) => void
    setDocumentAtIndex: (newDocument: Document, atIndex: number) => void,

    quizzes: Quiz[],
    setQuizzes: (newQuizzes: Quiz[]) => void
    setQuizAtIndex: (newQuiz: Quiz, atIndex: number) => void,

    currentSelectedItem: CurrentSelectedItem | null,
    setCurrentSelectedItem: (item: CurrentSelectedItem | null) => void

    hasChanged: boolean
    setHasChanged: (hasChanged: boolean) => void

    tempChangedSelectedItem: Section | Document | Quiz | CourseDescription | null
    setTempChangedSelectedItem: React.Dispatch<React.SetStateAction<Section | Document | Quiz | CourseDescription | null>> //(item: Section | Document | Quiz | null) => void

    courseFee: number,
    setCourseFee: React.Dispatch<React.SetStateAction<number>> //(fee: number) => void

    courseDescriptionList: CourseDescription[],
    setCourseDescriptionList: React.Dispatch<React.SetStateAction<CourseDescription[]>>
    setCourseDescriptionListAtIndex: (newQuiz: CourseDescription, atIndex: number) => void,

    courseTopics: CourseTopic[],
    setCourseTopics: React.Dispatch<React.SetStateAction<CourseTopic[]>>;

    // tempCurrentVideo: Video | null
    // setTempCurrentVideo: (video: Video | null) => void

    // tempCurrentDocument: Document | null
    // setTempCurrentDocument: (document: Document | null) => void

    // tempCurrentQuiz: Quiz | null
    // setTempCurrentQuiz: (quiz: Quiz | null) => void
}

const ItemPortal = React.createContext<ItemPortalContext>({
    courseName: '',
    setCourseName: () => {},
    courseStatus: '',
    setCourseStatus: () => {},

    courseDescription: '',
    setCourseDescription: () => {},

    coursePicture: null,
    setCoursePicture: () => {},

    sections: [],
    setSections: () => {},
    setSectionAtIndex: () => {},

    documents: [],
    setDocuments: () => {},
    setDocumentAtIndex: () => {},

    quizzes: [],
    setQuizzes: () => {},
    setQuizAtIndex: () => {},

    currentSelectedItem: null,
    setCurrentSelectedItem: () => {},

    hasChanged: false,
    setHasChanged: () => {},

    tempChangedSelectedItem: null,
    setTempChangedSelectedItem: () => {},

    courseFee: 0,
    setCourseFee: () => {},

    courseDescriptionList: [],
    setCourseDescriptionList: () => {},
    setCourseDescriptionListAtIndex: () => {},

    courseTopics: [],
    setCourseTopics: () => {},
})

export default function ItemPortalProvider(props: ItemPortalProviderProps) {
    return <ItemPortal.Provider value={props.value}>{props.children}</ItemPortal.Provider>
}

export function useItemPortalContext() {
    return useContext(ItemPortal)
}