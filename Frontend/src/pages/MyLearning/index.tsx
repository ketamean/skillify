import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { CourseCard } from "../../components";

export default function MyLearning() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortType, setSortType] = useState("recent");
  const { user } = useAuth();

  useEffect(() => {
    const fetchMyCourses = async () => {
      if (!user || !user.id) {
        setLoading(false);
        return;
      }

      const { data: enrolments, error: enrolmentError } = await supabase
        .from("learnerenrolments")
        .select("course_id")
        .eq("learner_id", user.id);

      console.log("Enrolments:", enrolments);

      if (enrolmentError || !enrolments) {
        console.error("Error fetching enrolments:", enrolmentError);
        setLoading(false);
        return;
      }

      const courseIds = enrolments.map((e) => e.course_id);
      if (courseIds.length === 0) {
        setCourses([]);
        setLoading(false);
        return;
      }

      const { data: courseData, error: courseError } = await supabase
        .from("courses")
        .select(
          `
          id,
          name,
          short_description,
          image_link,
          fee,
          instructors:instructor_id (first_name, last_name)`
        )
        .in("id", courseIds);
      console.log("Course Data:", courseData);

      if (courseError || !courseData) {
        console.error("Error fetching course data:", courseError);
        setLoading(false);
        return;
      }

      const formattedCourses = courseData.map((course) => {
        const instructor =
          course.instructors && course.instructors.length > 0
            ? course.instructors[0]
            : null;
        return {
          id: course.id,
          title: course.name,
          description: course.short_description || "",
          imageUrl: course.image_link,
          price: course.fee || 0,
          instructorName: instructor
            ? `${instructor.first_name ?? ""} ${instructor.last_name ?? ""}`
            : "Unknown Instructor",
        };
      });

      setCourses(formattedCourses);
      setLoading(false);
    };

    fetchMyCourses();
  }, [user]);

  const sortedCourses = [...courses].sort((a, b) => {
    if (sortType === "recent") return 0;
    if (sortType === "title-asc") return a.title.localeCompare(b.title);
    if (sortType === "title-desc") return b.title.localeCompare(a.title);
    if (sortType === "price") return a.price - b.price;
    return 0;
  });

  return (
    <div className="min-h-screen bg-custom-white flex flex-col">
      <NavBar
        user={{
          fname: user?.fname || "",
          lname: user?.lname || "",
          email: user?.email,
          avatarUrl: user?.avatar_url,
        }}
      />

      <main className="container mx-auto px-[4%] pt-10 pb-20 flex-grow">
        <h1 className="text-3xl font-bold text-deepteal mb-6">My Learning</h1>

        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-4">
            <label className="text-deepteal font-medium">Sort by:</label>
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            >
              <option value="recent">Recently Enrolled</option>
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
              <option value="price">Price (Low to High)</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-500">Loading your courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              You haven't enrolled in any courses yet
            </h3>
            <p className="text-gray-500 mb-6">
              Explore our course catalog to find courses that interest you.
            </p>
            <Link
              to="/"
              className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-6 rounded-lg transition"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedCourses.map((course) => (
              <CourseCard
                key={course.id}
                id={course.id}
                title={course.title}
                imageUrl={
                  course.imageUrl ||
                  "https://via.placeholder.com/300x200?text=Course+Thumbnail"
                }
                price={course.price}
                rating={course.rating}
                instructorName={course.instructorName ?? ""}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
