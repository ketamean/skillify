import { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import NavBar from "../../components/NavBar";
import CourseEditHeader from "./CourseEditHeader";
import CourseEditSideBar from "./CourseEditSideBar";
import { Quiz, Section, Video, Document, SendAPICourse } from "./types";
import ItemPortalProvider, { CurrentSelectedItem } from "./context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import CourseEditorMainArea from "./CourseEditorMainArea";
import { axiosForm } from "@/config/axios";
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
import { supabase } from "@/supabaseClient";

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
  const [courseFee, setCourseFee] = useState<number>(0);
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
  const [errorMsg, setErrorMsg] = useState<string>("");
  const { course_id } = useParams();

  useEffect(() => {
    if (isError) setIsLoading(false);
  }, [isError]);

  useEffect(() => {
    console.log(errorMsg);
  }, [errorMsg]);

  // fetch data
  useEffect(() => {
    axiosForm
      .get(`/api/courses/${course_id}`)
      .then((res) => {
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
        setCourseFee(course.fee);
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
                    isPublic: video.isPublic,
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
              duration: quiz.duration,
              content: quiz.questions.map((question: FetchedQuizQuestion) => {
                return {
                  id: question.id,
                  question: question.question,
                  answers: question.choices,
                  key: question.answer,
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
  }, [course_id]);

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
    <>
      <NavBar />
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

          courseFee,
          setCourseFee,
        }}
      >
        {isError ? (
          <p className="text-red-600 p-4 text-2xl">
            {errorMsg ? errorMsg : "Error"}
          </p>
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
              onClick={async () => {
                if (isError) return;
                setIsLoading(true);
                // validate videos
                sections.forEach((section) => {
                  section.content.forEach((video) => {
                    if (!video.file) {
                      setErrorMsg("Please refresh and upload video file");
                      setIsError(true);
                      return;
                    }
                    if (!video.title) {
                      setErrorMsg("Please enter video title");
                      setIsError(true);
                      return;
                    }
                  });
                });

                if (isError) return;

                // validate documents
                documents.forEach((document) => {
                  if (!document.file) {
                    setErrorMsg("Please refresh and upload document file");
                    setIsError(true);
                    return;
                  }
                });

                if (isError) return;

                // validates metadata
                if (!courseName) {
                  setErrorMsg("Please enter course name");
                  setIsError(true);
                  return;
                }
                if (!courseDescription) {
                  setErrorMsg("Please enter course description");
                  setIsError(true);
                  return;
                }
                if (courseFee < 0) {
                  setErrorMsg("Please enter course fee");
                  setIsError(true);
                  return;
                }
                if (isError) return;
                // upload files
                const videoPublicBucket = "coursevideospublic";
                const videoPrivateBucket = "coursevideosprivate";

                const newSections = await Promise.all(
                  sections.map(async (section) => {
                    return {
                      ...section,
                      content: await Promise.all(
                        section.content.map(async (video) => {
                          const filePath = `${Date.now()}-${video.title}`;
                          let bucketName = "";
                          if (video.isPublic) {
                            bucketName = videoPublicBucket;
                          } else {
                            bucketName = videoPrivateBucket;
                          }
                          const { data, error } = await supabase.storage
                            .from(bucketName)
                            .upload(filePath, video.file as File, {
                              cacheControl: "3600",
                              upsert: true,
                            });
                          if (error) {
                            toast.message(error.message);
                          }
                          return {
                            ...video,
                            link: data ? data.path : "",
                          };
                        })
                      ),
                    };
                  })
                );

                const newDocuments = await Promise.all(
                  documents.map(async (document) => {
                    const filePath = `${Date.now()}-${document.title}`;
                    const { data, error } = await supabase.storage
                      .from("coursedocuments")
                      .upload(filePath, document.file as File, {
                        cacheControl: "3600",
                        upsert: true,
                      });
                    if (error) {
                      toast.message(error.message);
                    }
                    return {
                      ...document,
                      link: data ? data.path : "",
                    };
                  })
                );

                console.log(newSections, newDocuments);

                // set up sent data
                const course: SendAPICourse = {
                  course_id: Number(course_id),
                  fee: courseFee,
                  title: courseName,
                  short_description: courseDescription,
                  sections: newSections.map((sec) => {
                    return {
                      title: sec.title,
                      videos: sec.content.map((video) => {
                        return {
                          title: video.title,
                          duration: "1", //video.duration,
                          description: video.description,
                          link: video.link,
                          isPublic: video.isPublic,
                        };
                      }),
                    };
                  }),
                  documents: newDocuments,
                  quizzes: quizzes.map((quiz) => {
                    return {
                      title: quiz.title,
                      description: quiz.description,
                      duration: quiz.duration,
                      questions: quiz.content.map((question) => {
                        return {
                          question: question.question,
                          choices: question.answers,
                          answer: question.key,
                        };
                      }),
                    };
                  }),
                };
                axiosForm
                  .put(`/api/courses/${course_id}`, course)
                  .then(() => {
                    toast.message("Course updated successfully!");
                    setIsLoading(false);
                  })
                  .catch((err) => {
                    err.response.data.error &&
                      setErrorMsg(err.response.data.error);
                    toast.message(err.response.data.error);
                    setIsError(true);
                  });
              }}
              disabled={isLoading}
            >
              <FontAwesomeIcon icon={faCheck} /> Save
            </button>
          </div>
        )}
      </ItemPortalProvider>
      <Footer />
    </>
  );
}
