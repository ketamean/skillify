import { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import NavBar from "../../components/NavBar";
import CourseEditHeader from "./CourseEditHeader";
import CourseEditSideBar from "./CourseEditSideBar";
import {
  Quiz,
  Section,
  Video,
  Document,
  SendAPICourse,
  CourseDescription,
} from "./types";
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

export default function CourseEdit() {
  const [courseName, setCourseName] = useState<string>("");
  const [courseDescription, setCourseDescription] = useState<string>("");
  const [courseFee, setCourseFee] = useState<number>(0);
  const [sections, setSections] = useState<Section[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [currentSelectedItem, setCurrentSelectedItem] =
    useState<CurrentSelectedItem | null>(null);
  const [hasChanged, setHasChanged] = useState<boolean>(false);
  const [tempChangedSelectedItem, setTempChangedSelectedItem] = useState<
    Section | Document | Quiz | CourseDescription | null
  >(null);
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [courseDescriptionList, setCourseDescriptionList] = useState<
    CourseDescription[]
  >([]);
  const { course_id } = useParams();

  useEffect(() => {
    if (isError) setIsLoading(false);
  }, [isError]);

  // fetch data
  useEffect(() => {
    supabase
      .from("coursedescriptions")
      .select("header, content")
      .eq("course_id", course_id)
      .order("order", { ascending: true })
      .then((res) => {
        if (res.error) {
          throw {
            error: "Cannot get course description list",
          };
        }
        setCourseDescriptionList(
          res.data.map((item, index) => ({
            id: index,
            title: item.header as string,
            description: item.content as string,
          }))
        );
      });
    axiosForm
      .get(`/api/courses/${course_id}/instructor`)
      .then((res) => {
        if (!res.data) {
          throw {
            error: `Cannot find course ${course_id}`,
          };
        }

        setIsLoading(false);
        const data = res.data as FetchedCourse;
        const course = data;

        setCourseName(course.title);
        setCourseDescription(course.description);
        setCourseFee(course.fee);

        Promise.all(
          course.sections.map(async (section: FetchedSection) => {
            return {
              id: section.id,
              title: section.title,
              description: section.description,
              content: await Promise.all(
                section.videos.map(
                  async (video: FetchedVideo, vidIndex: number) => {
                    let bucketName = "";
                    if (video.isPublic) {
                      bucketName = "coursevideospublic";
                    } else {
                      bucketName = "coursevideosprivate";
                    }
                    const { data: fileData, error: videoFileError } =
                      await supabase.storage
                        .from(bucketName)
                        .download(video.link);
                    let file: File | null = null;
                    if (videoFileError) {
                      throw {
                        error: videoFileError,
                      };
                    }
                    if (fileData) {
                      const filename = video.link.substring(
                        video.link.indexOf("-") + 1
                      );
                      file = new File([fileData], filename, {
                        type: fileData.type,
                        lastModified: Date.now(),
                      });
                    }
                    return {
                      id: vidIndex,
                      title: video.title,
                      description: video.description,
                      type: "video",
                      duration: video.duration,
                      isPublic: video.isPublic,
                      file,
                    } as Video;
                  }
                )
              ),
            } as Section;
          })
        ).then((newSections) => {
          setSections(newSections);
        });

        Promise.all(
          course.documents.map(
            async (document: FetchedDocument, docIndex: number) => {
              const { data: documentFile } = await supabase.storage
                .from("coursedocuments")
                .download(document.link);
              let file: File | null = null;
              if (documentFile) {
                const filename = document.link.substring(
                  document.link.indexOf("-") + 1
                );
                file = new File([documentFile], filename, {
                  type: documentFile.type,
                  lastModified: Date.now(),
                });
              }
              return {
                id: docIndex,
                title: document.title,
                description: document.description,
                type: "document",
                file,
              } as Document;
            }
          )
        ).then((newDocuments) => {
          setDocuments(newDocuments);
        });

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
        const { error } = err as { error: string };
        setErrorMsg(error);
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
        case "description":
          const descr = courseDescriptionList.find(
            (d) => d.id === currentSelectedItem.id
          );
          if (descr) setTempChangedSelectedItem(descr);
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

          courseDescriptionList,
          setCourseDescriptionList,
          setCourseDescriptionListAtIndex: (
            newItem: CourseDescription,
            atIndex: number
          ) => {
            const newCourseDescriptionList = [...courseDescriptionList];
            newCourseDescriptionList[atIndex] = newItem;
            setCourseDescriptionList(newCourseDescriptionList);
          },
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
                setIsLoading(true);
                try {
                  if (isError) {
                    throw {
                      error: "Error. Please try again",
                    };
                  }
                  // validate videos
                  sections.forEach((section) => {
                    section.content.forEach((video) => {
                      if (!video.file) {
                        throw {
                          error: "Please refresh and upload video file",
                        };
                      }
                      if (!video.title) {
                        throw {
                          error: "Please enter video title",
                        };
                      }
                    });
                  });

                  // validate documents
                  documents.forEach((document) => {
                    if (!document.file) {
                      throw {
                        error: "Please refresh and upload document file",
                      };
                    }
                  });

                  if (isError) return;

                  // validates metadata
                  if (!courseName) {
                    throw {
                      error: "Please enter course name",
                    };
                  }
                  if (!courseDescription) {
                    throw {
                      error: "Please enter course description",
                    };
                  }
                  if (courseFee < 0) {
                    throw {
                      error: "Please enter course fee",
                    };
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
                            const filePath = `${Date.now()}-${
                              video.file?.name
                            }`;
                            let bucketName = "";
                            if (video.isPublic) {
                              bucketName = videoPublicBucket;
                            } else {
                              bucketName = videoPrivateBucket;
                            }
                            const { data, error: fileError } =
                              await supabase.storage
                                .from(bucketName)
                                .upload(filePath, video.file as File, {
                                  cacheControl: "3600",
                                  upsert: true,
                                });
                            if (fileError) {
                              throw {
                                error: fileError.message,
                              };
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
                      const filePath = `${Date.now()}-${document.file?.name}`;
                      const {
                        data: documentUploadData,
                        error: documentUploadError,
                      } = await supabase.storage
                        .from("coursedocuments")
                        .upload(filePath, document.file as File, {
                          cacheControl: "3600",
                          upsert: true,
                        });
                      if (documentUploadError) {
                        throw {
                          error: documentUploadError.message,
                        };
                      }
                      return {
                        ...document,
                        link: documentUploadData ? documentUploadData.path : "",
                      };
                    })
                  );

                  // set up sent data
                  const course: SendAPICourse = {
                    course_id: Number(course_id),
                    fee: courseFee,
                    title: courseName,
                    short_description: courseDescription,
                    descriptions: courseDescriptionList.map((item) => ({
                      header: item.title,
                      content: item.description,
                    })),
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
                      window.location.reload();
                    })
                    .catch((err) => {
                      if (err?.response?.data?.error) {
                        throw {
                          error: err.response.data.error,
                        };
                      }
                      if (err?.request?.data?.error) {
                        throw {
                          error: err.request.data.error,
                        };
                      }
                    });
                } catch (err) {
                  console.log("I was here");
                  const { error } = err as { error: string };
                  setErrorMsg(error);
                  setIsError(true);
                }
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
