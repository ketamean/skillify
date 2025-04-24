import { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import NavBar from "../../components/NavBar";
import CourseEditHeader from "./CourseEditHeader";
import CourseEditSideBar from "./CourseEditSideBar";
import { Quiz, Section, Video, Document } from "./types";
import ItemPortalProvider, { CurrentSelectedItem } from "./context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import CourseEditorMainArea from "./CourseEditorMainArea";
import { axiosForm, axiosFile } from "@/config/axios";
import {
  FetchedVideo,
  FetchedSection,
  FetchedQuiz,
  FetchedDocument,
  FetchedCourse,
  FetchedQuizQuestion,
} from "./fetchedDataTypes";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const sampleMaterials: Video[] = [
  {
    id: 1,
    title:
      "bitchessss ssssssssssssssssssssssssssssssssssssssssssssssssbitchessssssssssssssssssssssssssssssssssssssssssssssssssbitchessssssssssssssssssssssssssssssssssssssssssssssssssbitchesssssssssssssssssssss sssssssssssssssssssssssssssss",
    description:
      "bitches sssssssssssssssssssssss sssssssssssss sssssssssssssbitches ssssssssss sssssssss ssssssss ssssssssss ssssssssssssbitchessssssssssssssssssssssssssssssssssssssssssss ssssssbitchessssssssssssssssss ssssssssssssssssssssssssssssssss",
    type: "video",
    duration: "100:00",
  } as Video,
  {
    id: 2,
    title: "hello3",
    description: "hello",
    type: "video",
    duration: "9:00",
  } as Video,
  {
    id: 3,
    title: "hello4",
    description: "hello",
    type: "video",
    duration: "7:00",
  } as Video,
];

const sampleQuizzes = [
  {
    id: 1,
    title: "hello5",
    description: "hello",
    type: "quiz",
    content: [
      {
        id: 1,
        question: "hello",
        answers: ["hello1", "hello2", "hello3", "hello4"],
        key: 1,
      },
      {
        id: 2,
        question: "hehehe",
        answers: ["hello5", "hello6", "hello7", "hello8"],
        key: 0,
      },
      {
        id: 3,
        question: "hihihi",
        answers: ["hello9", "hello10", "hello11", "hello12"],
        key: 1,
      },
      {
        id: 4,
        question: "huhuhu",
        answers: ["hello13", "hello14", "hello15", "hello16"],
        key: 3,
      },
    ],
  } as Quiz,
];

const sampleDocuments = [
  {
    id: 1,
    title: "hello2",
    description: "hello",
    type: "document",
    file: null,
  } as Document,
];

const sampleSections: Section[] = [
  {
    title: "How to know",
    content: sampleMaterials,
    description: "Hihi ne ne",
    id: 1,
  },
  {
    title:
      "bitchessssssssssssssssssssssssssssssssssssssssssssssssss no please stoppppppppppppppppppppppppppppppp",
    content: [],
    description: "ua alo",
    id: 2,
  },
  {
    title: "Random text hehe hihi haha huhu",
    content: [],
    description: "jztr",
    id: 3,
  },
];

export default function CourseEdit() {
  const [courseName, setCourseName] = useState<string>("");
  const [courseDescription, setCourseDescription] = useState<string>("");
  const [sections, setSections] = useState<Section[]>(sampleSections);
  const [documents, setDocuments] = useState<Document[]>(sampleDocuments);
  const [quizzes, setQuizzes] = useState<Quiz[]>(sampleQuizzes);
  const [currentSelectedItem, setCurrentSelectedItem] =
    useState<CurrentSelectedItem | null>(null);
  const [hasChanged, setHasChanged] = useState<boolean>(false);
  const [tempChangedSelectedItem, setTempChangedSelectedItem] = useState<
    Section | Document | Quiz | null
  >(null);
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { course_id } = useParams();

  useEffect(() => {
    if (isError) setIsLoading(false);
  }, [isError]);
  // fetch data
  useEffect(() => {
    axiosForm
      .get(`/api/courses/${course_id}`)
      .then((res) => {
        console.log(res);
        if (!res.data) {
          toast.message(`Cannot find course ${course_id}`);
          setIsError(true);
          return;
        }

        setIsLoading(false);
        const data = res.data as FetchedCourse;
        const course = data;

        setCourseName(course.title);
        setCourseDescription(course.description);
        setSections(
          course.sections.map((section: FetchedSection) => {
            return {
              id: section.id,
              title: section.title,
              description: section.description,
              content: section.videos.map(
                (video: FetchedVideo, vidIndex: number) => {
                  return {
                    id: vidIndex,
                    title: video.title,
                    description: video.description,
                    type: "video",
                    duration: video.duration,
                    // file:
                  } as Video;
                }
              ),
            } as Section;
          })
        );

        setDocuments(
          course.documents.map(
            (document: FetchedDocument, docIndex: number) => {
              return {
                id: docIndex,
                title: document.title,
                description: document.description,
                type: "document",
                // file: null
              } as Document;
            }
          )
        );

        setQuizzes(
          course.quizzes.map((quiz: FetchedQuiz) => {
            return {
              id: quiz.id,
              title: quiz.title,
              description: quiz.description,
              type: "quiz",
              content: quiz.questions.map((question: FetchedQuizQuestion) => {
                return {
                  id: question.id,
                  question: question.question,
                  answers: question.answers,
                  key: question.key,
                };
              }),
            } as Quiz;
          })
        );
      })
      .catch((err) => {
        console.log(err);
        setIsError(true);
      });
  });

  useEffect(() => {
    // console.log('currentSelectedItem type: ', currentSelectedItem?.type)
    if (!currentSelectedItem) {
      setTempChangedSelectedItem(null);
    } else {
      switch (currentSelectedItem.type) {
        case "section":
          const section = sections.find(
            (section) => section.id === currentSelectedItem.id
          );
          if (section) setTempChangedSelectedItem(section);
          else setTempChangedSelectedItem(null);
          break;
        case "document":
          const document = documents.find(
            (document) => document.id === currentSelectedItem.id
          );
          if (document) setTempChangedSelectedItem(document);
          else setTempChangedSelectedItem(null);
          break;
        case "quiz":
          const quiz = quizzes.find(
            (quiz) => quiz.id === currentSelectedItem.id
          );
          if (quiz) setTempChangedSelectedItem(quiz);
          else setTempChangedSelectedItem(null);
          break;
      }
    }
  }, [currentSelectedItem]);

  return (
    <ItemPortalProvider
      value={{
        courseName,
        setCourseName,

        courseDescription,
        setCourseDescription,

        sections,
        setSections,
        setSectionAtIndex: (newSection: Section, atIndex: number) => {
          const newSections = [...sections];
          newSections[atIndex] = newSection;
          setSections(newSections);
        },

        documents,
        setDocuments,
        setDocumentAtIndex: (newDocument: Document, atIndex: number) => {
          const newDocuments = [...documents];
          newDocuments[atIndex] = newDocument;
          setDocuments(newDocuments);
        },

        quizzes,
        setQuizzes,
        setQuizAtIndex: (newQuiz: Quiz, atIndex: number) => {
          const newQuizzes = [...quizzes];
          newQuizzes[atIndex] = newQuiz;
          setQuizzes(newQuizzes);
        },

        currentSelectedItem,
        setCurrentSelectedItem,

        hasChanged,
        setHasChanged,

        tempChangedSelectedItem,
        setTempChangedSelectedItem,
      }}
    >
      <NavBar />

      {isError ? (
        <p className="text-red-600 p-4 text-2xl">Course not found.</p>
      ) : isLoading ? (
        <p className="text-blue-500 p-4 text-xl">Loading...</p>
      ) : (
        <div className="max-w-full flex flex-col text-black w-full lg:px-40 px-4 py-8 gap-y-4">
          {/* header */}
          <CourseEditHeader />

          {/* body */}
          <div className="flex flex-row gap-x-4 w-full">
            {/* Side bar */}
            <div className="w-1/4 min-w-60">
              <CourseEditSideBar />
            </div>

            {/* Main content */}
            <div className="w-3/4">
              <CourseEditorMainArea />
            </div>
          </div>

          {/* "Save" button */}
          <button
            className="ml-auto bg-light-green flex-none font-semibold rounded-md w-fit px-2 hover:bg-mint p-2 flex flex-row items-center gap-x-2 cursor-pointer"
            onClick={() => {}}
          >
            <FontAwesomeIcon icon={faCheck} /> Save
          </button>
        </div>
      )}

      <Footer />
    </ItemPortalProvider>
  );
}
