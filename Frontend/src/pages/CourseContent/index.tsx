import { useEffect, useState } from "react";
import { FaXTwitter, FaFacebook, FaLinkedin, FaLink } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import axios from "axios";
import NavBar from "@/components/NavBar";
import { axiosForm } from "@/config/axios";

export default function CourseContentPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [expandedSections, setExpandedSections] = useState<{
    [key: number]: boolean;
  }>({});
  const [selectedQuizIndex, setSelectedQuizIndex] = useState<number | null>(
    null
  );
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<{
    [key: number]: boolean;
  }>({});
  const [currentVideoIndex, setCurrentVideoIndex] = useState(-1);
  const { course_id } = useParams();
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  type VideoComment = {
    id: number;
    user: string;
    text: string;
    time: string;
    material_id: number;
    avatar?: string | null;
  };
  const [comments, setComments] = useState<VideoComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [currentVideoId, setCurrentVideoId] = useState<number | null>(null);
  const [avatarCache, setAvatarCache] = useState<Record<string, string>>({});
  const videoComments = comments.filter(
    (c) => c.material_id === currentVideoId
  );
  const [quizStartedAt, setQuizStartedAt] = useState<{ [key: number]: Date }>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user_id, setUserId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  interface CourseData {
    course_id: number;
    title: string;
    description: string;
    lastUpdated: string;
    sections: {
      id: number;
      title: string;
      order: number;
      videos: {
        id: number;
        title: string;
        link: string;
        signedUrl: string;
        duration: number;
        isPublic: boolean;
      }[];
    }[];
    documents: {
      id: number;
      title: string;
      description: string;
      link: string;
    }[];
    quizzes: {
      id: number;
      title: string;
      duration: number;
      description: string;
      questions: {
        id: number;
        question: string;
        type: string;
        choices: string[];
        answer: number;
      }[];
    }[];
    quizResults: {
      quiz_id: number;
      score: string;
    }[];
    comments: {
      id: number;
      text: string;
      time: string;
      material_id: number;
      user: string;
      avatar?: string | null;
    }[];
  }
  const getAvatarUrl = async (
    avatarPath: string | null | undefined
  ): Promise<string> => {
    if (!avatarPath) {
      return "https://ui-avatars.com/api/?name=User";
    }

    if (avatarPath.startsWith("http") || avatarPath.startsWith("https")) {
      return avatarPath;
    }

    const { data, error } = await supabase.storage
      .from("useravatars")
      .download(avatarPath);

    if (error || !data) {
      console.error("Failed to download avatar:", error.message);
      return "https://ui-avatars.com/api/?name=User";
    }

    return URL.createObjectURL(data);
  };

  useEffect(() => {
    const fetchCourseData = async () => {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError || !userData?.user) {
        console.error("Error getting user:", userError);
        setLoading(false);
        return;
      }
      setUserId(userData.user.id);

      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        console.error("Không có token Supabase");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:3000/api/courses/${course_id}`,
          {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
            params: {
              user_id: userData.user.id,
            },
          }
        );

        const data = response.data;
        setCourseData(data);
        setComments(data.comments || []);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu khóa học:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [course_id]);

  useEffect(() => {
    const loadAvatars = async () => {
      const pathsToLoad = comments
        .map((c) => c.avatar)
        .filter(
          (path): path is string =>
            typeof path === "string" && !avatarCache[path]
        );

      for (const path of pathsToLoad) {
        const url = await getAvatarUrl(path);
        setAvatarCache((prev) => ({ ...prev, [path]: url }));
      }
    };

    loadAvatars();
  }, [comments, avatarCache]);

  useEffect(() => {
    if (selectedQuizIndex === null) return;

    const timerId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerId);
          handleSubmitQuiz(selectedQuizIndex);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [selectedQuizIndex]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-deepteal"></div>
      </div>
    );
  if (!courseData) return <p>Không tìm thấy khóa học!</p>;

  const videoIdToNumber: { [key: number]: number } = {};
  let counter = 1;
  courseData.sections.forEach((section) => {
    section.videos.forEach((video) => {
      videoIdToNumber[video.id] = counter++;
    });
  });

  const toggleSection = (id: number) => {
    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleAnswerSelect = (
    quizIndex: number,
    questionIndex: number,
    answerIndex: number
  ) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [`${quizIndex}-${questionIndex}`]: answerIndex,
    }));
  };

  const getQuizScore = (quizIndex: number) => {
    return `${courseData.quizResults[quizIndex].score}`;
  };

  const handlePrevVideo = () => {
    if (currentVideoIndex > 0) {
      const newIndex = currentVideoIndex - 1;
      setCurrentVideoIndex(newIndex);
      setCurrentVideoId(videos[newIndex].id);
    }
  };

  const handleNextVideo = () => {
    if (currentVideoIndex >= 0 && currentVideoIndex < videos.length - 1) {
      const newIndex = currentVideoIndex + 1;
      setCurrentVideoIndex(newIndex);
      setCurrentVideoId(videos[newIndex].id);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !currentVideoId || !course_id) return;

    try {
      const response = await axiosForm.post(
        `/api/courses/${course_id}/materials/${currentVideoId}/comments`,
        {
          content: newComment,
          user_id: user_id,
        }
      );

      setComments((prev) => [
        {
          id: response.data.comment.id,
          text: response.data.comment.text,
          time: response.data.comment.time,
          user: response.data.comment.user,
          avatar: response.data.comment.avatar,
          material_id: currentVideoId,
        },
        ...prev,
      ]);
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
      alert("Failed to post comment. Please try again.");
    }
  };

  const hasSubmitted = (quizIndex: number) => {
    const quizId = courseData?.quizzes[quizIndex]?.id;
    return courseData?.quizResults?.some((r) => r.quiz_id === quizId);
  };

  const handleSubmitQuiz = async (quizIndex: number) => {
    setIsSubmitting(true);
    try {
      const quiz = courseData.quizzes[quizIndex];
      let correctCount = 0;
      type AnswerPayload = {
        question_id: number;
        provided_key: number | undefined;
        answer_text: string;
        is_correct: boolean;
      };

      const answers: AnswerPayload[] = [];
      const startedAt = quizStartedAt[quizIndex] || new Date();
      const submittedAt = new Date();

      quiz.questions.forEach((q, qIndex) => {
        const userAnswer = quizAnswers[`${quizIndex}-${qIndex}`];
        const isCorrect = userAnswer === q.answer;
        if (isCorrect) correctCount++;

        answers.push({
          question_id: q.id,
          provided_key: userAnswer,
          answer_text: q.choices?.[userAnswer] || "",
          is_correct: isCorrect,
        });
      });

      const score = correctCount;
      const scoreString = `${correctCount}/${quiz.questions.length}`;
      const existingIndex = courseData.quizResults.findIndex(
        (r) => r.quiz_id === quiz.id
      );

      if (existingIndex !== -1) {
        courseData.quizResults[existingIndex].score = scoreString;
      } else {
        courseData.quizResults.push({ quiz_id: quiz.id, score: scoreString });
      }

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const token = session?.access_token;

        if (!token) {
          console.error("Không có token Supabase");
          setLoading(false);
          return;
        }
        const payload = {
          user_id,
          quiz_id: quiz.id,
          started_at: startedAt.toISOString(),
          submitted_at: submittedAt.toISOString(),
          score,
          answers,
        };

        const res = await axios.post(
          `http://localhost:3000/api/quizzes/${quiz.id}`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.access_token}`,
            },
          }
        );

        const data = res.data;
        console.log("Gửi bài thành công:", data);
      } catch (error) {
        console.error("Gửi bài thất bại:", error);
      }

      setQuizSubmitted((prev) => ({
        ...prev,
        [quizIndex]: true,
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const videos =
    courseData?.sections.flatMap((section) => section.videos) || [];

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-100 text-black">
      <NavBar />

      {/* Main Content */}
      <div className="flex flex-col md:flex-row w-full">
        <div className="md:w-2/3 p-6 text-black">
          <div className="relative w-full aspect-video flex items-center justify-center bg-black text-white">
            {currentVideoIndex >= 0 &&
            videos[currentVideoIndex] &&
            videos[currentVideoIndex].link ? (
              <>
                <button
                  className="absolute left-0 bg-gray-700 text-white px-3 py-2 rounded-l disabled:opacity-50"
                  onClick={handlePrevVideo}
                  disabled={currentVideoIndex === 0}
                >
                  ❮ Prev
                </button>

                <video
                  className="w-full h-full"
                  controls
                  src={
                    !videos[currentVideoIndex]?.isPublic
                      ? videos[currentVideoIndex]?.signedUrl
                      : videos[currentVideoIndex]?.link
                  }
                />
                <button
                  className="absolute right-0 bg-gray-700 text-white px-3 py-2 rounded-r disabled:opacity-50"
                  onClick={handleNextVideo}
                  disabled={currentVideoIndex === videos.length - 1}
                >
                  Next ❯
                </button>
              </>
            ) : (
              <p className="text-gray-400 text-sm">
                🎬 Select a lesson to begin watching
              </p>
            )}
          </div>
          {/* Navigation Tabs */}
          <div className="flex items-center justify-around mt-4 border-b text-black">
            <button className="px-4 py-2 text-deepteal hover:text-vibrant-green">
              <FaSearch />
            </button>
            {["Overview", "Documents", "Quizzes", "Q&A"].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 ${
                  activeTab === tab
                    ? "text-deepteal font-bold"
                    : "text-deepteal hover:text-vibrant-green"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <h3 className="mt-2 text-black">{courseData.title}</h3>
          <div className="flex items-center mt-2 text-sm text-deepteal border-b pb-4">
            Last updated: {courseData.lastUpdated}
          </div>

          {/* Additional Course Details */}
          {activeTab === "Overview" && (
            <div className="mt-4">
              <div className="grid grid-cols-3 gap-4 mt-4 pb-4 text-sm text-gray-600 border-b">
                <h3 className="text-lg font-semibold mt-2 col-span-1 text-black">
                  Description
                </h3>
                <p
                  className="text-sm text-gray-600 mt-2 col-span-2"
                  dangerouslySetInnerHTML={{
                    __html: courseData.description.replace(/\n/g, "<br/>"),
                  }}
                ></p>
              </div>
            </div>
          )}

          {activeTab === "Documents" && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Documents</h3>
              {courseData.documents.map((doc, index) => (
                <div key={index} className="mt-2 border rounded-lg p-4">
                  <h3 className="font-medium">{doc.title}</h3>
                  <p className="text-sm text-gray-600">{doc.description}</p>
                  <a
                    href={doc.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 underline"
                  >
                    Link
                  </a>
                </div>
              ))}
            </div>
          )}

          {activeTab === "Quizzes" && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Quizzes</h3>

              {courseData.quizzes.map((quiz, quizIndex) => (
                <div
                  key={quizIndex}
                  className="mt-4 p-4 border rounded-lg bg-white"
                >
                  <h3 className="font-medium">
                    {quiz.title} ({quiz.duration} mins)
                  </h3>

                  {hasSubmitted(quizIndex) ? (
                    <p className="mt-2 text-green-600 font-medium">
                      You already completed this quiz! ✅<br />
                      Score: {getQuizScore(quizIndex)}
                    </p>
                  ) : selectedQuizIndex === quizIndex ? (
                    <>
                      {!quizSubmitted[quizIndex] && (
                        <div className="mb-2 text-red-600 font-semibold">
                          Thời gian còn lại: {Math.floor(timeLeft / 60)}:
                          {String(timeLeft % 60).padStart(2, "0")}
                        </div>
                      )}
                      {quiz.questions.map((q, qIndex) => (
                        <div key={qIndex} className="mt-2">
                          <p className="font-medium">
                            {qIndex + 1}. {q.question}
                          </p>
                          {q.choices.map((choice, choiceIndex) => (
                            <label
                              key={choiceIndex}
                              className="flex items-center mt-1"
                            >
                              <input
                                type="radio"
                                name={`quiz-${quizIndex}-question-${qIndex}`}
                                disabled={quizSubmitted[quizIndex]}
                                checked={
                                  quizAnswers[`${quizIndex}-${qIndex}`] ===
                                  choiceIndex
                                }
                                onChange={() =>
                                  handleAnswerSelect(
                                    quizIndex,
                                    qIndex,
                                    choiceIndex
                                  )
                                }
                              />
                              <span className="ml-2">{choice}</span>
                            </label>
                          ))}
                          {quizSubmitted[quizIndex] && (
                            <p
                              className={`text-sm mt-1 ${
                                quizAnswers[`${quizIndex}-${qIndex}`] ===
                                q.answer
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {quizAnswers[`${quizIndex}-${qIndex}`] ===
                              q.answer
                                ? "✅ Correct"
                                : "❌ Incorrect"}
                            </p>
                          )}
                        </div>
                      ))}

                      {!quizSubmitted[quizIndex] ? (
                        <button
                          onClick={() => handleSubmitQuiz(quizIndex)}
                          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Đang gửi..." : "Submit"}
                        </button>
                      ) : (
                        <p className="mt-2 text-green-600 font-medium">
                          Quiz Submitted! 🎉 Score: {getQuizScore(quizIndex)}
                        </p>
                      )}
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        const durationInSeconds = quiz.duration * 60;
                        setTimeLeft(durationInSeconds);
                        setQuizStartedAt((prev) => ({
                          ...prev,
                          [quizIndex]: new Date(),
                        }));
                        setSelectedQuizIndex(quizIndex);
                      }}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
                    >
                      Làm bài
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === "Q&A" && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2 text-black">
                Q&A / Discussion
              </h3>

              {!currentVideoId ? (
                <p className="text-sm text-gray-500 italic">
                  🎬 Click on a video to leave comments or ask questions
                </p>
              ) : (
                <>
                  <div className="mb-4">
                    <textarea
                      className="w-full p-2 border rounded-md text-black"
                      placeholder="Ask a question or leave a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                    />
                    <button
                      onClick={handleAddComment}
                      className="mt-2 px-4 py-2 bg-vibrant-green text-white rounded hover:bg-deepteal"
                    >
                      Post Comment
                    </button>
                  </div>

                  {videoComments.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No comments for this video yet.
                    </p>
                  ) : (
                    <ul className="space-y-4">
                      {videoComments.map((comment) => (
                        <li
                          key={comment.id}
                          className="border p-3 rounded bg-white flex items-start space-x-3"
                        >
                          <img
                            src={
                              comment.avatar
                                ? avatarCache[comment.avatar] ||
                                  "https://ui-avatars.com/api/?name=" +
                                    encodeURIComponent(comment.user)
                                : "https://ui-avatars.com/api/?name=" +
                                  encodeURIComponent(comment.user)
                            }
                            alt={comment.user}
                            className="w-10 h-10 rounded-full border border-gray-300 object-cover"
                          />
                          <div>
                            <div className="text-sm font-semibold">
                              {comment.user}
                            </div>
                            <div className="text-gray-700">{comment.text}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {comment.time}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>
          )}
        </div>
        <div className="md:w-1/3 p-4 text-black sticky top-0 self-start border-l h-screen overflow-y-auto">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="text-lg font-semibold">Course content</h3>
          </div>
          {courseData.sections.map((section) => (
            <div key={section.id} className="mt-2 border-b pb-2">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection(section.id)}
              >
                <h3 className="font-medium">
                  Section {section.order + 1}: {section.title}
                </h3>
                <button className="text-xl">
                  {expandedSections[section.id] ? "▲" : "▼"}
                </button>
              </div>

              {expandedSections[section.id] && (
                <div className="mt-2 pl-4">
                  {section.videos.map((video) => (
                    <div key={video.id} className="mt-1 flex items-center">
                      <button
                        onClick={() => {
                          const index = videos.findIndex(
                            (v) => v.id === video.id
                          );
                          setCurrentVideoIndex(index);
                          setCurrentVideoId(video.id);
                        }}
                        className="text-purple-600 underline text-left w-full"
                      >
                        {videoIdToNumber[video.id]}. {video.title}
                      </button>
                      <span className="ml-auto text-gray-500 whitespace-nowrap">
                        {video.duration} min
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
