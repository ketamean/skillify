import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react"
import { useItemPortalContext } from "./context"
import SectionContentList from "./SectionContentList"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faCheck, faPlus, faTrash, faVideo } from '@fortawesome/free-solid-svg-icons'
import { getItemPositionById, getNewId } from './handlers'
import AIAutoFillButton from './AIAutoFillButton'
import { Quiz, Section, Video, QuizQuestion, Document } from "./types"
import FileDropZone from "./FileDropZone"
import AddFileDialog from './AddFileDialog'
import { DialogClose } from "@/components/ui/dialog"
import Divider from "@/components/Divider"
import { Switch } from "@/components/ui/switch"

// interface CourseEditorMainAreaProps {}

export default function CourseEditorMainArea() { // props: CourseEditorMainAreaProps
    const { currentSelectedItem, setCurrentSelectedItem, sections, setSectionAtIndex, documents, setDocumentAtIndex, quizzes, setQuizAtIndex, tempChangedSelectedItem, setTempChangedSelectedItem,courseDescriptionList, setCourseDescriptionListAtIndex } = useItemPortalContext()

    // for documents
    const [documentFile, setDocumentFile] = useState<File | null>(null)

    const [questions, setQuestions] = useState<QuizQuestion[]>([])
    
    useEffect(() => {
        if (!tempChangedSelectedItem || !currentSelectedItem || currentSelectedItem.type !== 'quiz' || (tempChangedSelectedItem as Quiz).type !== 'quiz') return;
        setQuestions((tempChangedSelectedItem as Quiz).content)
    }, [tempChangedSelectedItem])

    const [itemList, itemSetter] = useMemo(() => {
        if (!currentSelectedItem || !tempChangedSelectedItem) return [null, null]
        switch (currentSelectedItem?.type) {
            case 'section':
                return [sections, setSectionAtIndex]
            case 'document':
                setDocumentFile((tempChangedSelectedItem as Document).file)
                return [documents, setDocumentAtIndex]
            case 'quiz':
                setQuestions((tempChangedSelectedItem as Quiz).content)
                return [quizzes, setQuizAtIndex]
            case 'description':
                return [courseDescriptionList, setCourseDescriptionListAtIndex]
            default:
                return [null, null]
        }
    }, [tempChangedSelectedItem])

    // for the Document part
    useEffect(() => {
        setTempChangedSelectedItem(prev => {
            if (!prev) return null
            return {
                ...prev,
                file: documentFile
            }
        })
    }, [documentFile])

    return (
        <>
            {
                !tempChangedSelectedItem? <></> :
                <div className="w-full h-full p-4 flex flex-col gap-y-4">
                    {/* Header: Go back & Save */}
                    <div className="w-full flex">
                        {/*  Go back */}
                        <button className='cursor-pointer'
                            title="Go back"
                            onClick={() => {
                                setCurrentSelectedItem(null)
                            }}
                        >
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </button>

                        {/* Save */}
                        <button className={`ml-auto p-auto w-12 h-12 rounded-full bg-green-100 text-green-400 hover:bg-green-200 hover:text-green-500 hover:cursor-pointer`}
                            onClick={() => {
                                if (!currentSelectedItem || !itemList || !itemSetter ) return;
                                const idx = getItemPositionById<typeof tempChangedSelectedItem>(currentSelectedItem.id, itemList)
                                itemSetter(tempChangedSelectedItem as never, idx)

                                setCurrentSelectedItem(null)
                            }}
                        >
                            <FontAwesomeIcon icon={faCheck} />
                        </button>
                    </div>

                    {/* Title */}
                    <div className="w-full flex flex-col gap-y-2">
                        <label htmlFor="main-edit-title">Title</label>
                        <input className=" px-2 h-10 border border-gray-300 rounded-sm" type="text" name="main-edit-title" id="main-edit-title"
                            value={tempChangedSelectedItem?.title? tempChangedSelectedItem?.title : ''}
                            onChange={(e) => {
                                if (tempChangedSelectedItem) {
                                    setTempChangedSelectedItem({
                                        ...tempChangedSelectedItem,
                                        title: e.target.value
                                    })
                                }
                            }}
                            maxLength={50}
                        />
                    </div>

                    {/* Description */}
                    <div className="w-full flex flex-col gap-y-1">
                        <div className="flex flex-row items-center">
                            <label htmlFor="main-edit-description">Description</label>
                            <div className="ml-auto">
                                <AIAutoFillButton onClick={() => {}} />
                            </div>
                        </div>
                        <textarea
                            className="px-2 py-1 border border-gray-300 rounded-sm resize-none"
                            name="main-edit-description" id="main-edit-description"
                            onChange={(e) => {
                                if (tempChangedSelectedItem) {
                                    setTempChangedSelectedItem({
                                        ...tempChangedSelectedItem,
                                        description: e.target.value
                                    })
                                }
                            }}
                            value={tempChangedSelectedItem?.description? tempChangedSelectedItem?.description : ''}
                            rows={6}
                            maxLength={500}
                        ></textarea>
                    </div>

                    {/* Duration if is quiz */}
                    {
                        !tempChangedSelectedItem || !currentSelectedItem || currentSelectedItem.type !== 'quiz' || (tempChangedSelectedItem as Quiz).type !== 'quiz' ? <></> :
                        <div className="w-full flex flex-col gap-y-2">
                            <label htmlFor="main-edit-title">Duration</label>
                            <input className=" px-2 h-10 border border-gray-300 rounded-sm" type="text" name="main-edit-title" id="main-edit-title"
                                value={(tempChangedSelectedItem as Quiz).duration as number}
                                onChange={(e) => {
                                    const duration = Number(e.target.value)
                                    if (tempChangedSelectedItem) {
                                        setTempChangedSelectedItem({
                                            ...tempChangedSelectedItem as Quiz,
                                            duration
                                        })
                                    }
                                }}
                                min={0}
                                max={120}
                            />
                        </div>
                    }

                    {/* Add new content to a section */}
                    {
                        !tempChangedSelectedItem || currentSelectedItem?.type !== 'section' || !Object.keys(tempChangedSelectedItem).includes("content") ? <></> :
                            <AddVideoDialog />
                    }

                    {/* Content List: if any */}
                    {
                        !tempChangedSelectedItem || currentSelectedItem?.type !== 'section' || !Object.keys(tempChangedSelectedItem).includes("content") ? <></> :
                        <div className="w-full">
                            <SectionContentList />
                        </div>
                    }

                    {/* Corresponding Single File: if any */}
                    {
                        !tempChangedSelectedItem || currentSelectedItem?.type !== 'document' || !Object.keys(tempChangedSelectedItem).includes("file") ? <></> :
                            <FileDropZone
                                accept=".docx,.pdf"
                                file={documentFile}
                                setFile={setDocumentFile}
                            />
                    }

                    {/* If Quiz: Question List */}
                    {
                        !tempChangedSelectedItem || !currentSelectedItem || currentSelectedItem.type !== 'quiz' || (tempChangedSelectedItem as Quiz).type !== 'quiz' ? <></> :
                            <div className="w-full flex flex-col gap-y-2">
                                <QuizQuestionList
                                    questions={questions}
                                    setQuestions={setQuestions}
                                />
                            </div>
                    }
                </div>
            }
        </>
    )
}

interface QuizQuestionItemProps {
    content: QuizQuestion;
    index: number;
    onUpdate?: (updatedQuestion: QuizQuestion) => void;
    onRemove: () => void;
}

function QuizQuestionItem(props: QuizQuestionItemProps) {
    const [answers, setAnswers] = useState<string[]>(props.content.answers || []);
    const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number | null>(props.content.key);

    useEffect(() => {
        setAnswers(props.content.answers || []);
        setCorrectAnswerIndex(props.content.key);
    }, [props.content])

    // Update parent component when answers or correct answer change
    useEffect(() => {
        props.onUpdate?.({
            ...props.content,
            answers,
            key: correctAnswerIndex
        });
    }, [answers, correctAnswerIndex]);


    const handleAddAnswer = () => {
        setAnswers([...answers, ""]);
    };

    const handleRemoveAnswer = (indexToRemove: number) => {
        setAnswers(answers.filter((_, index) => index !== indexToRemove));
        
        // Adjust correct answer index if needed
        if (correctAnswerIndex === indexToRemove) {
            setCorrectAnswerIndex(null);
        } else if (correctAnswerIndex !== null && correctAnswerIndex > indexToRemove) {
            setCorrectAnswerIndex(correctAnswerIndex - 1);
        }
    };

    const handleAnswerChange = (index: number, value: string) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);
    };

    return (
        <li className="w-full p-4 border rounded-lg bg-white shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-lg text-zinc-700">Question {props.index + 1}</h3>
                <button 
                    onClick={props.onRemove}
                    className="text-red-500 hover:text-red-700 p-1 rounded-full cursor-pointer hover:bg-red-50"
                    aria-label="Remove question"
                >
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            </div>

            {/* Question input */}
            <div className="flex flex-col gap-y-2 mb-6">
                <label htmlFor={`quiz-question-${props.content.id}`} className="font-medium text-zinc-600">
                    Question
                </label>
                <input 
                    className="px-3 py-2 h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    type="text" 
                    name={`quiz-question-${props.content.id}`} 
                    id={`quiz-question-${props.content.id}`}
                    value={props.content.question}
                    onChange={(e) => {
                        props.onUpdate?.({
                            ...props.content,
                            question: e.target.value
                        });
                    }}
                    placeholder="Enter your question here"
                />
            </div>

            {/* Answers section */}
            <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                    <label className="font-medium text-zinc-600">Answer Options</label>
                    <span className="text-sm text-zinc-500">Select the correct answer</span>
                </div>
                
                {answers.length === 0 ? (
                    <div className="text-center py-4 text-zinc-500 italic">
                        No answers yet. Add some options below.
                    </div>
                ) : (
                    <ul className="space-y-2">
                        {answers.map((answer, index) => (
                            <li key={index} className="flex items-center gap-x-2">
                                <input
                                    type="radio"
                                    id={`answer-${props.content.id}-${index}`}
                                    name={`correct-answer-${props.content.id}`}
                                    checked={correctAnswerIndex === index}
                                    onChange={() => setCorrectAnswerIndex(index)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                />
                                <input
                                    type="text"
                                    value={answer}
                                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder={`Option ${index + 1}`}
                                />
                                <button
                                    onClick={() => handleRemoveAnswer(index)}
                                    className="text-zinc-400 hover:text-red-500 p-1"
                                    aria-label="Remove answer"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Add answer button */}
            <button
                onClick={handleAddAnswer}
                className="flex items-center gap-x-1 text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add Answer Option
            </button>
        </li>
    );
}

interface QuizQuestionListProps {
    questions: QuizQuestion[]
    setQuestions: Dispatch<SetStateAction<QuizQuestion[]>>
}

function QuizQuestionList(props: QuizQuestionListProps) {
    const { tempChangedSelectedItem, setTempChangedSelectedItem, currentSelectedItem } = useItemPortalContext()

    useEffect(() => {
        const newQuiz = {
            ...tempChangedSelectedItem,
            content: props.questions
        } as Quiz
        setTempChangedSelectedItem(newQuiz)
    }, [props.questions])

    const handleUpdateQuestion = (index: number, updatedQuestion: QuizQuestion) => {
        const newQuestions = [...props.questions];
        newQuestions[index] = updatedQuestion;
        props.setQuestions(newQuestions);
    };

    const handleRemoveQuestion = (indexToRemove: number) => {
        props.setQuestions(props.questions.filter((_, index) => index !== indexToRemove));
    };

    const handleAddQuestion = () => {
        props.setQuestions([
            ...props.questions,
            {
                id: getNewId(props.questions),
                question: "",
                answers: [],
                key: null
            } as QuizQuestion
        ]);
    };

    return (
        !tempChangedSelectedItem || currentSelectedItem?.type !== 'quiz' || (tempChangedSelectedItem as Quiz).type !== 'quiz' ? <></> :
            <div className="flex flex-col gap-y-2 border rounded-lg p-2">
                <ul className="flex flex-col gap-y-2">
                    {
                        (tempChangedSelectedItem as Quiz).content.length > 0 ?
                        (tempChangedSelectedItem as Quiz).content.map((question, index) => (
                            <>
                                <QuizQuestionItem
                                    key={index}
                                    content={question}
                                    index={index}
                                    onUpdate={(updatedQuestion) => handleUpdateQuestion(index, updatedQuestion)}
                                    onRemove={() => handleRemoveQuestion(index)}
                                />
                                {
                                    index < (tempChangedSelectedItem as Quiz).content.length - 1 ? <Divider className="h-[1px] bg-zinc-300" /> : <></>
                                }
                            </>
                        )) : <p className="text-center">No questions added</p>
                    }
                </ul>
                <button className="ml-auto flex items-center justify-center cursor-pointer aspect-square w-8 p-2 bg-green-200 hover:bg-green-300 rounded-lg"
                    onClick={() => handleAddQuestion()}
                >
                    <FontAwesomeIcon icon={faPlus}/>
                </button>
            </div>
    )
}

function AddVideoDialog() {
    const { tempChangedSelectedItem, setTempChangedSelectedItem } = useItemPortalContext()
    const [tempNewContent, setTempNewContent] = useState<Video | null>(null)

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [file, setFile] = useState<File | null>(null)
    const [isPublic, setIsPublic] = useState(false)

    const [flagChanged, setFlagChanged] = useState(false)

    useEffect(() => {
        if ( title === '' || description === '' || file === null ) {
            setFlagChanged(false)
        }

        setFlagChanged(true)

        setTempNewContent(prev => {
            if (!prev) return {
                isPublic,
                title,
                description,
                file,
                id: getNewId((tempChangedSelectedItem as Section).content),
                duration: '',
                type: 'video',
            }
            return {
                ...prev,
                title,
                description,
                file,
                isPublic
            }
        })
    }, [title, description, file])

    function handleOnCancel() {
        setTitle('')
        setDescription('')
        setFile(null)
    }

    return (
        <AddFileDialog
            trigger={
                <div className="ml-auto text-green-700 bg-green-100 hover:bg-green-200 flex items-center p-2 gap-x-2 rounded-lg cursor-pointer">
                    <FontAwesomeIcon icon={faVideo}/> Add video
                </div>
            }

            onCancel={() => handleOnCancel()}

            okButton={
                <DialogClose className={`w-20 text-white font-bold px-auto py-2 rounded-lg ${flagChanged ? 'cursor-pointer bg-green-400' : 'cursor-not-allowed bg-zinc-400'}`}
                    onClick={() => {
                        setTempChangedSelectedItem(prev => {
                            if (!prev) return null
                            if (!tempNewContent) return prev
                            return {
                                ...prev,
                                content: [...(prev as Section).content, tempNewContent]
                            }
                        })

                        handleOnCancel()
                    }}
                >
                    OK
                </DialogClose>
            }

            additionalBody={
                <div className="flex flex-row items-center gap-x-2">
                    <Switch
                        // id="isPublic"
                        checked={isPublic}
                        onCheckedChange={setIsPublic}
                        className="h-6"
                    />
                    <span>Is public</span>
                </div>
            }

            onClickAIAutoFill={() => {}}

            fileAcceptType="video/*"

            title={title}
            setTitle={setTitle}

            description={description}
            setDescription={setDescription}

            file={file}
            setFile={setFile}
        />
    )
}