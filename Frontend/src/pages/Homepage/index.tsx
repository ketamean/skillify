import { CourseCard } from "../../components";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
export default function Homepage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase.from("courses").select(`
          id,
          name,
          image_link,
          fee,
          instructor:instructor_id (first_name, last_name)
        `);

      if (error) {
        console.error("Error fetching courses:", error);
      } else {
        const formattedCourses = data.map((course) => ({
          id: course.id,
          title: course.name,
          imageUrl: course.image_link,
          price: course.fee,
          level: "Beginner",
          instructorName:
            course.instructor.first_name ??
            "" + " " + course.instructor.last_name ??
            "",
        }));

        setCourses(formattedCourses);
      }
      setLoading(false);
    };

    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-custom-white">
      <NavBar />

      {/* Banner Section */}
      <div className="relative h-[400px] mx-auto container flex justify-center pt-4 px-[4%]">
        <div className="relative w-full h-full">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop')",
              backgroundBlendMode: "overlay",
              borderRadius: "1rem",
            }}
          >
            <div className="absolute inset-0 bg-deepteal/70 rounded-xl"></div>
            <div className="relative h-full container mx-auto px-[4%] flex flex-col justify-center">
              <h1 className="text-5xl font-bold text-white mb-6">
                Learn Without Limits
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-2xl">
                Start, switch, or advance your career with thousands of courses
                from world-class universities and companies.
              </p>
              <button className="bg-vibrant-green text-deepteal font-bold py-3 px-8 rounded-lg w-fit hover:bg-opacity-90 transition-colors">
                Explore Courses
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Contents */}
      <main className="container mx-auto mt-6 px-[4%]">
        <div className="mb-8">
          <h2 className="text-deepteal text-2xl font-extrabold mb-4">
            Featured Courses
          </h2>

          {loading ? (
            <p>Loading courses...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {courses.map((course, index) => (
                <CourseCard key={index} {...course} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
