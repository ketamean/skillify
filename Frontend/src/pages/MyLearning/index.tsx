import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import { supabase } from "../../supabaseClient";

export default function MyLearning() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortType, setSortType] = useState("recent");

  useEffect(() => {
    const fetchMyCourses = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        console.error("Error getting user:", userError);
        setLoading(false);
        return;
      }

      const userId = userData.user.id;

      const { data: enrolments, error: enrolmentError } = await supabase
        .from("learnerenrolments")
        .select("course_id")
        .eq("learner_id", userId);

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
        .select(`
          id,
          name,
          image_link,
          fee,
          instructors:instructor_id (first_name, last_name)
        `)
        .in("id", courseIds);

      if (courseError || !courseData) {
        console.error("Error fetching course data:", courseError);
        setLoading(false);
        return;
      }

      const formattedCourses = courseData.map((course) => ({
        id: course.id,
        title: course.name,
        imageUrl: course.image_link,
        price: course.fee ? `$${course.fee.toFixed(2)}` : "Free",
        rating: 5,
        ratingCount: 1000,
        level: "Unknown",
        instructorName:
          course.instructors && course.instructors.length > 0
            ? `${course.instructors[0].first_name} ${course.instructors[0].last_name}`
            : "Unknown Instructor",
      }));

      setCourses(formattedCourses);
      setLoading(false);
    };

    fetchMyCourses();
  }, []);

  const sortedCourses = [...courses].sort((a, b) => {
    if (sortType === "recent") return 0;
    if (sortType === "title-asc") return a.title.localeCompare(b.title);
    if (sortType === "title-desc") return b.title.localeCompare(a.title);
    if (sortType === "price") {
      const priceA = a.price === "Free" ? 0 : parseFloat(a.price.replace('$', ''));
      const priceB = b.price === "Free" ? 0 : parseFloat(b.price.replace('$', ''));
      return priceA - priceB;
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-custom-white">
      <NavBar
        user={{
          fname: "Ariana",
          lname: "Grande",
          avatarUrl:
            "https://static.vecteezy.com/system/resources/thumbnails/041/880/991/small_2x/ai-generated-pic-artistic-depiction-of-sunflowers-under-a-vast-cloudy-sky-photo.jpg",
        }}
      />

      <main className="container mx-auto px-[4%] pt-10 pb-20">
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
          <p>Loading courses...</p>
        ) : courses.length === 0 ? (
          <p>You haven't enrolled in any courses yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedCourses.map((course, idx) => (
              <Link to={`/coursecontent/${course.id}`} key={idx}>
                <div className="flex flex-col items-center text-center border p-4 rounded-lg shadow hover:shadow-lg transition cursor-pointer">
                  <img
                    src={course.imageUrl}
                    alt={course.title}
                    className="w-full h-[140px] object-cover rounded-md mb-3"
                  />
                  <h3 className="font-semibold text-deepteal">{course.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
