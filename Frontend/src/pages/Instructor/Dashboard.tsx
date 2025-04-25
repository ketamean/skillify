import { ReactElement, useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabaseClient";
import { CourseCard } from "../../components";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";

interface Course {
  id: number;
  name: string;
  description: string;
  fee: number;
  image_link?: string;
  created_at: string;
  updated_at: string;
  instructor_id: number;
  average_rating?: number;
  total_students?: number;
}

export default function InstructorDashboard(): ReactElement {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();
  useEffect(() => {
    const fetchInstructorCourses = async () => {
      if (!user || !user.id) return;

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("courses")
          .select("*")
          .eq("instructor_id", user.id);

        if (error) {
          throw error;
        }

        setCourses(data || []);
      } catch (error) {
        console.error("Error fetching instructor courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructorCourses();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <NavBar />

      {/* Instructor Dashboard Navigation */}
      <div className="bg-gray-800 text-white">
        <div className="container mx-auto px-[4%]">
          <div className="flex items-center space-x-6 py-3 overflow-x-auto">
            <a
              href="/instructor/dashboard"
              className="py-2 px-1 border-b-2 border-vibrant-green font-medium"
            >
              Courses
            </a>
            <a
              href="/instructor/coupons"
              className="py-2 px-1 border-b-2 border-transparent hover:border-vibrant-green font-medium"
            >
              Coupons
            </a>
            <a
              href="#"
              className="py-2 px-1 border-b-2 border-transparent hover:border-vibrant-green font-medium"
            >
              Analytics
            </a>
            <a
              href="#"
              className="py-2 px-1 border-b-2 border-transparent hover:border-vibrant-green font-medium"
            >
              Students
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-[4%] py-8 flex-grow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-deepteal">My Courses</h1>
          <Link
            to={'/instructor/upload'}
          >
            <button className="bg-deepteal hover:bg-green-400 hover:text-black cursor-pointer font-bold text-white py-2 px-4 rounded-lg transition">
              Create New Course
            </button>
          </Link>

        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-500">Loading your courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              You haven't created any courses yet
            </h3>
            <p className="text-gray-500 mb-6">
              Start creating your first course and share your knowledge with
              students around the world.
            </p>
            <button className="bg-deepteal hover:bg-blurple text-white py-2 px-6 rounded-lg transition">
              Create Your First Course
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                id={course.id}
                title={course.name}
                imageUrl={
                  course.image_link ||
                  'https://placehold.co/300x200?text=Thumbnail'
                }
                price={course.fee}
                instructorName={user.fname + " " + user.lname}
                is_Instructor={true}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
