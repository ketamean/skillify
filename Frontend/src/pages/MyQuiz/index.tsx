import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import { supabase } from "../../supabaseClient";
import axios from 'axios';

export default function MyQuiz() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortType, setSortType] = useState("recent");

  interface QuizData {
    id: string;
    title: string;
    description: string;
    duration: number;
    course_id: string;
  }
  
  useEffect(() => {
    const fetchMyQuizzes = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        console.error("Error getting user:", userError);
        setLoading(false);
        return;
      }
  
      const userId = userData.user.id;

      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;
    
      if (!token) {
        console.error("Không có token Supabase");
        setLoading(false);
        return;
      }
      
      if (!token) {
        console.error("Access token is missing");
        setLoading(false);
        return;
      }
      
      const { data: courses, error: courseError } = await supabase
        .from("courses")
        .select("id, name")
        .eq("instructor_id", userId);
  
      if (courseError || !courses || courses.length === 0) {
        console.error("Error fetching courses:", courseError);
        setLoading(false);
        return;
      }
  
      const courseIds = courses.map((c) => c.id);
  
      let formattedQuizzes = [];
      try {
        const response = await axios.get(`http://localhost:3000/api/quizzes/myquiz/${userId}`, {
          params: { courseIds },  
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
      
        const quizzesData = response.data.quizzes;
        formattedQuizzes = (quizzesData as QuizData[]).map((quiz) => {
          const course = courses.find((c) => c.id === quiz.course_id);
          return {
            id: quiz.id,
            title: quiz.title,
            description: quiz.description,
            duration: quiz.duration,
            courseTitle: course?.name || "Unknown Course",
          };
        });
        
      } catch (err) {
        console.error("Error fetching quizzes:", err);
        setLoading(false);
        return;
      }
  
      setQuizzes(formattedQuizzes);
      setLoading(false);
    };
  
    fetchMyQuizzes();
  }, []);
  
  

  const sortedQuizzes = [...quizzes].sort((a, b) => {
    if (sortType === "recent") return 0;
    if (sortType === "title-asc") return a.title.localeCompare(b.title);
    if (sortType === "title-desc") return b.title.localeCompare(a.title);
    if (sortType === "duration") return a.duration - b.duration;
    return 0;
  });

  return (
    <div className="min-h-screen bg-custom-white">
      <NavBar />

      <main className="container mx-auto px-[4%] pt-10 pb-20">
        <h1 className="text-3xl font-bold text-deepteal mb-6">My Quizzes</h1>

        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-4">
            <label className="text-deepteal font-medium">Sort by:</label>
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            >
              <option value="recent">Recently Created</option>
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
              <option value="duration">Duration (Short to Long)</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p>Loading quizzes...</p>
        ) : quizzes.length === 0 ? (
          <p>You haven't created any quizzes yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedQuizzes.map((quiz, idx) => (
              <Link to={`/instructor/quizzes/${quiz.id}`} key={idx}>
                <div className="flex flex-col items-start border p-4 rounded-lg shadow hover:shadow-lg transition cursor-pointer">
                  <h3 className="font-semibold text-deepteal mb-1">
                    {quiz.title}
                  </h3>
                  <p className="text-sm text-gray-700 mb-1">
                    {quiz.description}
                  </p>
                  <p className="text-sm text-gray-600 italic mb-1">
                    {quiz.courseTitle}
                  </p>
                  <p className="text-sm text-gray-500">{quiz.duration} mins</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
