import React, { ReactNode, useContext } from "react"
import { Document, Quiz, Section } from "./types"

interface ItemPortalProviderProps {
    children: ReactNode
    value: ItemPortalContext
}

export interface CurrentSelectedItem {
    type: 'section' | 'document' | 'quiz'
    id: number
}

interface ItemPortalContext {
    courseName: string,
    setCourseName: (name: string) => void

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

    tempChangedSelectedItem: Section | Document | Quiz | null
    setTempChangedSelectedItem: React.Dispatch<React.SetStateAction<Section | Document | Quiz | null>> //(item: Section | Document | Quiz | null) => void

    courseFee: number,
    setCourseFee: React.Dispatch<React.SetStateAction<number>> //(fee: number) => void


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

    courseDescription: '',
    setCourseDescription: () => {},

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
})

export default function ItemPortalProvider(props: ItemPortalProviderProps) {
    return <ItemPortal.Provider value={props.value}>{props.children}</ItemPortal.Provider>
}

export function useItemPortalContext() {
    return useContext(ItemPortal)
}