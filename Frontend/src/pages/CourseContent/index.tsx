import {useEffect, useState } from "react";
import { FaPlay, FaXTwitter, FaFacebook, FaLinkedin, FaLink, FaDownload } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { useParams } from "react-router-dom"; 
import { supabase } from "../../supabaseClient";


export default function CourseContentPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [expandedSections, setExpandedSections] = useState<{ [key: number]: boolean }>({});
  const [currentVideo, setCurrentVideo] = useState<string>("");
  const [selectedQuizIndex, setSelectedQuizIndex] = useState<number | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<{ [key: number]: boolean }>({});
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const { course_id } = useParams(); 
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);

  let lessonCounter = 0; 

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
  }
  console.log(course_id);
  useEffect(() => {
    const fetchCourseData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:3000/api/courses/${course_id}`);
        if (!response.ok) throw new Error("Failed to fetch course data");
        const data = await response.json();
        setCourseData(data);
        console.log(1);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu khóa học:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [course_id]);

  if (loading) return <p>Đang tải...</p>;
  if (!courseData) return <p>Không tìm thấy khóa học!</p>;

const toggleSection = (id: number) => {
  setExpandedSections((prev) => ({
    ...prev,
    [id]: !prev[id],
  }));
};

const handleAnswerSelect = (quizIndex: number, questionIndex: number, answerIndex: number) => {
  setQuizAnswers((prev) => ({
    ...prev,
    [`${quizIndex}-${questionIndex}`]: answerIndex,
  }));
};

const handleSubmitQuiz = (quizIndex: number) => {
  setQuizSubmitted((prev) => ({
    ...prev,
    [quizIndex]: true,
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
    setCurrentVideoIndex(currentVideoIndex - 1);
  }
};

const handleNextVideo = () => {
  if (currentVideoIndex < videos.length - 1) {
    setCurrentVideoIndex(currentVideoIndex + 1);
  }
};

  // const courseData = {
  //   course_id:6,
  //   title: "How to Create an Online Course: The Official Udemy Course",
  //   description:
  //     "rickrolled",
  //   rating: 4.6,
  //   students: 227156,
  //   duration: "1.5 hours",
  //   lastUpdated: "January 2022",
  //   skillLevel: "Beginner Level",
  //   languages: "English",
  //   captions: "Yes",
  //   lectures: 32,
  //   fullDescription:"bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla",
  //   sections: [
  //     {
  //       id: 1,
  //       title: "Introduction",
  //       lessons: 4,
  //       videos: [
  //         { title: "Welcome", link: "https://www.youtube.com/watch?v=OTmJmteT7hw" },
  //         { title: "Course Overview", link: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  //       ],
  //     },
  //     {
  //       id: 2,
  //       title: "Getting Started",
  //       lessons: 3,
  //       videos: [
  //         { title: "Setting Up", link: "https://www.youtube.com/watch?v=OTmJmteT7hw" },
  //         { title: "Choosing Your Topic", link: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  //       ],
  //     },
  //     {
  //       id: 3,
  //       title: "Structure Your Course",
  //       lessons: 7,
  //       videos: [
  //         { title: "Course Structure Basics", link: "https://www.youtube.com/watch?v=OTmJmteT7hw" },
  //       ],
  //     },
  //   ],
  //   documents: [
  //     {title:"The whole book", description:"This is the pdf file of the whole book we provide to you", link:"https://nibmehub.com/opac-service/pdf/read/The%20Subtle%20Art%20of%20Not%20Giving%20a%20Fck%20A%20Counterintuitive%20Approach%20to%20Living%20a%20Good%20Life%20by%20Mark%20Manson%20(z-lib.org).pdf"},
  //     {title:"The whole book", description:"This is the pdf file of the whole book we provide to you", link:"https://nibmehub.com/opac-service/pdf/read/The%20Subtle%20Art%20of%20Not%20Giving%20a%20Fck%20A%20Counterintuitive%20Approach%20to%20Living%20a%20Good%20Life%20by%20Mark%20Manson%20(z-lib.org).pdf"},

  //   ],

  //   quizzes: [
  //     {
  //       title: "Revision #1",
  //       duration: "40",
  //       question: [
  //         {
  //           title: "Thế nào là ma trận khả nghịch?",
  //           choice: ["1", "2", "3", "Cái này là đáp án"],
  //           answer: 3,
  //         },
  //         {
  //           title: "Định lý nào sau đây là đúng?",
  //           choice: ["A", "B", "C", "Đây là đáp án"],
  //           answer: 3,
  //         },
  //       ],
  //     },
  //     {
  //       title: "Revision #2",
  //       duration: "30",
  //       question: [
  //         {
  //           title: "Biến nào trong JS là immutable?",
  //           choice: ["var", "let", "const", "Không có cái nào"],
  //           answer: 2,
  //         },
  //       ],
  //     },
  //   ],
  // };

  const videos = courseData.sections.flatMap(section => section.videos);

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-100 text-black">
      {/* Header */}
      <header className="flex items-center justify-between bg-gray-900 text-white p-4">
        <div className="flex items-center space-x-4">
          <span className="text-xl font-bold text-purple-400">Skillify</span>
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
          <div className="relative w-full aspect-video flex items-center">
            <button 
              className="absolute left-0 bg-gray-700 text-white px-3 py-2 rounded-l disabled:opacity-50"
              onClick={handlePrevVideo}
              disabled={currentVideoIndex === 0}
            >
              ❮ Prev
            </button>            
            <iframe
              className="w-full h-full"
              src={videos[currentVideoIndex].link.replace("watch?v=", "embed/")}
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
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex items-center justify-around mt-4 border-b text-black">
            <button className="px-4 py-2 text-gray-700 hover:text-purple-600"><FaSearch /></button>
            {["Overview", "Documents", "Quizzes"].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 ${activeTab === tab ? 'text-purple-600 font-bold' : 'text-gray-700 hover:text-purple-600'}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>            ))}
          </div>
          <h3 className="mt-2 text-black">{courseData.description}</h3>
          <div className="flex items-center mt-2 text-sm text-gray-700 text-black border-b pb-4">
            ⭐ {courseData.rating} ({courseData.students} students) | Last updated: {courseData.lastUpdated}
          </div>

          {/* Additional Course Details */}
          {activeTab === "Overview" && (
          <div className="mt-4">
            <div className="mt-2 pt-2 pb-2 text-black border-b">
              <div className="grid grid-cols-3 gap-4 mt-2 text-sm text-gray-600 text-black">
              <h3 className="text-lg font-semibold text-black">By the numbers</h3>
                <div>
                  <p><strong>Skill level:</strong> {courseData.skillLevel}</p>
                  <p><strong>Students:</strong> {courseData.students}</p>
                  <p><strong>Languages:</strong> {courseData.languages}</p>
                  <p><strong>Captions:</strong> {courseData.captions}</p>
                </div>
                <div>
                  <p><strong>Lectures:</strong> {courseData.lectures}</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4 pb-4 text-sm text-gray-600 text-black border-b">
              <h3 className="text-lg font-semibold mt-2 text-black">Features</h3>
              <p className="text-sm text-gray-600 mt-2 text-black">Available on iOS and Android</p>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4 pb-4 text-sm text-gray-600 text-black border-b">
              <h3 className="text-lg font-semibold mt-2 col-span-1 text-black">Description</h3>
              <p className="text-sm text-gray-600 mt-2 text-black col-span-2" dangerouslySetInnerHTML={{ __html: courseData.fullDescription.replace(/\n/g, '<br/>') }}></p>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4 pb-4 text-sm text-gray-600 text-black">
              <h3 className="text-lg font-semibold mt-4">Instructor</h3>
              <div>
              <button className="text-sm text-gray-600 text-black ">Udemy Instructor Team - Official Udemy Instructor Account</button>
              <div className="flex space-x-4 mt-2">
                <button className="text-gray-600"><FaXTwitter size={20} /></button>
                <button className="text-gray-600"><FaFacebook size={20} /></button>
                <button className="text-gray-600"><FaLinkedin size={20} /></button>
                <button className="text-gray-600"><FaLink size={20} /></button>
              </div>
              <p className="text-sm text-gray-600 text-black">The Udemy Instructor Team has one passion: Udemy's instructors! We'll work with you to help you create an online course—along the way, we'll also help you become an integral member of the Udemy community, a promotional whiz, a teaching star, and an all-around amazing instructor. We're excited to help you succeed on Udemy!</p>
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
                  <a href={doc.link} target="_blank" rel="noopener noreferrer" className="text-purple-600 underline">
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
                <div key={quizIndex} className="mt-4 p-4 border rounded-lg bg-white">
                  <h3 className="font-medium">{quiz.title} ({quiz.duration} mins)</h3>

                  {selectedQuizIndex === quizIndex ? (
                    <>
                      {quiz.questions.map((q, qIndex) => (
                        <div key={qIndex} className="mt-2">
                          <p className="font-medium">{qIndex + 1}. {q.question}</p>
                          {q.choices.map((choice, choiceIndex) => (
                            <label key={choiceIndex} className="flex items-center mt-1">
                              <input
                                type="radio"
                                name={`quiz-${quizIndex}-question-${qIndex}`}
                                disabled={quizSubmitted[quizIndex]}
                                checked={quizAnswers[`${quizIndex}-${qIndex}`] === choiceIndex}
                                onChange={() => handleAnswerSelect(quizIndex, qIndex, choiceIndex)}
                              />
                              <span className="ml-2">{choice}</span>
                            </label>
                          ))}
                          {quizSubmitted[quizIndex] && (
                            <p className={`text-sm mt-1 ${quizAnswers[`${quizIndex}-${qIndex}`] === q.answer ? 'text-green-600' : 'text-red-600'}`}>
                              {quizAnswers[`${quizIndex}-${qIndex}`] === q.answer ? "✅ Correct" : "❌ Incorrect"}
                            </p>
                          )}
                        </div>
                      ))}

                      {!quizSubmitted[quizIndex] ? (
                        <button onClick={() => handleSubmitQuiz(quizIndex)} className="mt-4 px-4 py-2 bg-purple-600 text-white rounded">
                          Submit
                        </button>
                      ) : (
                        <p className="mt-2 text-green-600 font-medium">
                          Quiz Submitted! 🎉 Score: {getQuizScore(quizIndex)}
                        </p>
                      )}
                    </>
                  ) : (
                    <button 
                      onClick={() => setSelectedQuizIndex(quizIndex)}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
                    >
                      Làm bài
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}




        </div>
        <div className="md:w-1/3 p-4 text-black sticky top-0 self-start border-l h-screen">
        <div className="flex justify-between items-center border-b pb-2">
            <h3 className="text-lg font-semibold">Course content</h3>
          </div>
          {courseData.sections.map((section) => (
            <div key={section.id} className="mt-2 border-b pb-2">
              <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleSection(section.id)}>
                <h3 className="font-medium">Section {section.order+1}: {section.title}</h3>
                <button className="text-xl">{expandedSections[section.id] ? "▲" : "▼"}</button>
              </div>

              {expandedSections[section.id] && (
                <div className="mt-2 pl-4">
                  {section.videos.map((video, idx) => {
                    lessonCounter++; 
                    return (
                      <div key={idx} className="mt-1 flex items-center">
                        <input type="checkbox" className="mr-2"/>
                        <button
                          onClick={() => setCurrentVideo(video.link.replace("watch?v=", "embed/"))}
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