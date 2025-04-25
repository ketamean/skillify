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
  CourseTopic,
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
  const [courseTopics, setCourseTopics] = useState<CourseTopic[]>([]);
  const [coursePicture, setCoursePicture] = useState<File | null>(null);
  const { course_id } = useParams();
  const [allTopicList, setAllTopicList] = useState<CourseTopic[]>([]);
  const [courseStatus, setCourseStatus] = useState("");

  useEffect(() => {
    if (isError) setIsLoading(false);
  }, [isError]);

  // fetch data
  useEffect(() => {
    // fetch description list
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
    ///////////////////////////////////////////
    ///////////////////////////////////////////
    // fetch topic list
    supabase
      .from("topics")
      .select("id, name")
      .then((res) => {
        if (res.error) {
          throw {
            error: "Cannot get course description list",
          };
        }
        const _allTopics = res.data;
        setAllTopicList(_allTopics);

        // fetch related topics
        supabase
          .from("courserelatedtopics")
          .select("topic_id")
          .eq("course_id", course_id)
          .then((res) => {
            if (res.error) {
              throw {
                error: "Cannot get course description list",
              };
            }
            const newCourseTopics = res.data.map((item) =>
              _allTopics.find((it) => item.topic_id === it.id)
            );
            setCourseTopics(
              newCourseTopics.filter((item) => item !== undefined)
            );
          });
      });

    ///////////////////////////////////////////
    ///////////////////////////////////////////
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
        setCourseStatus(course.status || "");

        // get course picture
        console.log(course.image_link);
        if (course.image_link) {
          fetch(course.image_link).then((response) => {
            if (!response.ok) {
              setCoursePicture(null);
            } else {
              response.blob().then((blob) => {
                setCoursePicture(
                  new File([blob], "Your course thumbnail", {
                    type: blob.type || "image/*",
                    lastModified: Date.now(),
                  })
                );
              });
            }
          });
        } else {
          setCoursePicture(null);
        }

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

          courseStatus,
          setCourseStatus,

          courseDescription,
          setCourseDescription,

          coursePicture,
          setCoursePicture,

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

          courseTopics,
          setCourseTopics,
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
            <CourseEditHeader
              allTopics={allTopicList}
              courseTopics={courseTopics}
              setCourseTopics={setCourseTopics}
            />

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

                  let coursePictureLink = "";
                  if (coursePicture) {
                    const filePath = `${Date.now()}-${coursePicture.name}`;
                    const { error: pictureUploadError } = await supabase.storage
                      .from("courseimages")
                      .upload(filePath, coursePicture as File, {
                        cacheControl: "3600",
                        upsert: true,
                      });
                    if (pictureUploadError) {
                      throw {
                        error: pictureUploadError.message,
                      };
                    }

                    const { data: urlData } = supabase.storage
                      .from("courseimages")
                      .getPublicUrl(filePath);
                    coursePictureLink = urlData.publicUrl;
                  }

                  // set up sent data
                  const course: SendAPICourse = {
                    course_id: Number(course_id),
                    fee: courseFee,
                    title: courseName,
                    image_link: coursePictureLink,
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
                    topics: courseTopics.map((tp) => ({ id: tp.id })),
                  };
                  axiosForm
                    .put(`/api/courses/`, course)
                    .then(() => {
                      toast.message("Course updated successfully!");
                      window.location.href =
                        "http://localhost:5173/instructor/dashboard";
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
    </>
  );
}
