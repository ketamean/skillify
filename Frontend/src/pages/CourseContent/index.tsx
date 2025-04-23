import { useEffect, useState } from "react";
import { FaXTwitter, FaFacebook, FaLinkedin, FaLink } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";

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
  let lessonCounter = 0;
  const [quizStartedAt, setQuizStartedAt] = useState<{ [key: number]: Date }>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user_id, setUserId] = useState<string | null>(null);

  interface CourseData {
    course_id: number;
    title: string;
    description: string;
    lastUpdated: string;
    rating: number;
    students: number;
    skillLevel: string;
    languages: string;
    captions: string;
    lectures: number;
    fullDescription: string;
    sections: {
      id: number;
      title: string;
      order: number;
      videos: {
        id: number;
        title: string;
        link: string;
        duration: number;
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

      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3000/api/courses/${course_id}?user_id=${userData.user.id}`
        );
        if (!response.ok) throw new Error("Failed to fetch course data");
        const data = await response.json();
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

  if (loading) return <p>Đang tải...</p>;
  if (!courseData) return <p>Không tìm thấy khóa học!</p>;

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
    const quiz = courseData.quizzes[quizIndex];
    let correctCount = 0;

    quiz.questions.forEach((q, qIndex) => {
      if (quizAnswers[`${quizIndex}-${qIndex}`] === q.answer) {
        correctCount++;
      }
    });

    return `${correctCount} / ${quiz.questions.length}`;
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

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      alert("Please log in to post a comment.");
      return;
    }

    const response = await fetch(
      `http://localhost:3000/api/courses/${course_id}/materials/${currentVideoId}/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newComment,
          user_id: user.id,
        }),
      }
    );

    const result = await response.json();
    if (response.ok) {
      setComments((prev) => [
        {
          id: result.comment.id,
          text: result.comment.text,
          time: result.comment.time,
          user: result.comment.user,
          avatar: result.comment.avatar,
          material_id: currentVideoId,
        },
        ...prev,
      ]);
      setNewComment("");
    } else {
      console.error("Error posting comment:", result.error);
      alert("Failed to post comment. Please try again.");
    }
  };

  const hasSubmitted = (quizIndex: number) => {
    const quizId = courseData?.quizzes[quizIndex]?.id;
    return courseData?.quizResults?.some((r) => r.quiz_id === quizId);
  };

  const getSavedScore = (quizIndex: number) => {
    const quizId = courseData?.quizzes[quizIndex]?.id;
    const result = courseData?.quizResults?.find((r) => r.quiz_id === quizId);
    return result?.score || "";
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
        const payload = {
          user_id,
          quiz_id: quiz.id,
          started_at: startedAt.toISOString(),
          submitted_at: submittedAt.toISOString(),
          score,
          answers,
        };

        const res = await fetch(
          `http://localhost:3000/api/quizzes/${quiz.id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        if (!res.ok) throw new Error("Lỗi khi gửi bài");
        const data = await res.json();
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

  const toEmbedUrl = (url: string | null | undefined): string | undefined => {
    if (!url) return undefined;

    try {
      const parsed = new URL(url);

      if (
        parsed.hostname.includes("youtube.com") &&
        parsed.pathname === "/watch"
      ) {
        const videoId = parsed.searchParams.get("v");
        return videoId ? `https://www.youtube.com/embed/${videoId}` : undefined;
      }

      if (parsed.hostname === "youtu.be") {
        const videoId = parsed.pathname.slice(1); // remove leading '/'
        return videoId ? `https://www.youtube.com/embed/${videoId}` : undefined;
      }

      return undefined;
    } catch {
      return undefined;
    }
  };

  const videos =
    courseData?.sections.flatMap((section) => section.videos) || [];

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-100 text-black">
      {/* Header */}
      <header className="flex items-center justify-between bg-deepteal text-white p-4">
        <div className="flex items-center space-x-4">
          <span className="text-xl font-bold text-white">Skillify</span>
          <span className="text-sm">{courseData.title}</span>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-sm">Leave a rating</button>
          <div className="w-6 h-6 border rounded-full border-gray-400"></div>
          <button className="text-sm">Your progress ▼</button>
          <button className="bg-gray-700 px-3 py-1 rounded">Share</button>
          <button className="text-lg">⋮</button>
        </div>
      </header>

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

                <iframe
                  className="w-full h-full"
                  src={toEmbedUrl(videos[currentVideoIndex]?.link)}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>

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
          <h3 className="mt-2 text-black">{courseData.description}</h3>
          <div className="flex items-center mt-2 text-sm text-deepteal border-b pb-4">
            ⭐ {courseData.rating} ({courseData.students} students) | Last
            updated: {courseData.lastUpdated}
          </div>

          {/* Additional Course Details */}
          {activeTab === "Overview" && (
            <div className="mt-4">
              <div className="mt-2 pt-2 pb-2 text-black border-b">
                <div className="grid grid-cols-3 gap-4 mt-2 text-sm text-gray-600">
                  <h3 className="text-lg font-semibold text-black">
                    By the numbers
                  </h3>
                  <div>
                    <p>
                      <strong>Skill level:</strong> {courseData.skillLevel}
                    </p>
                    <p>
                      <strong>Students:</strong> {courseData.students}
                    </p>
                    <p>
                      <strong>Languages:</strong> {courseData.languages}
                    </p>
                    <p>
                      <strong>Captions:</strong> {courseData.captions}
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong>Lectures:</strong> {courseData.lectures}
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4 pb-4 text-sm text-gray-600  border-b">
                <h3 className="text-lg font-semibold mt-2">Features</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Available on iOS and Android
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4 pb-4 text-sm text-gray-600 border-b">
                <h3 className="text-lg font-semibold mt-2 col-span-1 text-black">
                  Description
                </h3>
                <p
                  className="text-sm text-gray-600 mt-2 col-span-2"
                  dangerouslySetInnerHTML={{
                    __html: courseData.fullDescription.replace(/\n/g, "<br/>"),
                  }}
                ></p>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4 pb-4 text-sm text-gray-600">
                <h3 className="text-lg font-semibold mt-4">Instructor</h3>
                <div>
                  <button className="text-sm text-gray-600">
                    Udemy Instructor Team - Official Udemy Instructor Account
                  </button>
                  <div className="flex space-x-4 mt-2">
                    <button className="text-gray-600">
                      <FaXTwitter size={20} />
                    </button>
                    <button className="text-gray-600">
                      <FaFacebook size={20} />
                    </button>
                    <button className="text-gray-600">
                      <FaLinkedin size={20} />
                    </button>
                    <button className="text-gray-600">
                      <FaLink size={20} />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">
                    The Udemy Instructor Team has one passion: Udemy's
                    instructors! We'll work with you to help you create an
                    online course—along the way, we'll also help you become an
                    integral member of the Udemy community, a promotional whiz,
                    a teaching star, and an all-around amazing instructor. We're
                    excited to help you succeed on Udemy!
                  </p>
                </div>
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
        <div className="md:w-1/3 p-4 text-black sticky top-0 self-start border-l h-screen">
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
                  {section.videos.map((video, idx) => {
                    lessonCounter++;
                    return (
                      <div key={idx} className="mt-1 flex items-center">
                        <input type="checkbox" className="mr-2" />
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
                          {lessonCounter}. {video.title}
                        </button>
                        <span className="ml-auto text-gray-500">3min</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
