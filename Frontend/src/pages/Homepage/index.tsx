import { CourseCard } from "../../components";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { axiosForm } from "@/config/axios";

export default function Homepage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Add category-specific state variables
  const [mathCourses, setMathCourses] = useState<any[]>([]);
  const [mathLoading, setMathLoading] = useState(true);

  const [techCourses, setTechCourses] = useState<any[]>([]);
  const [techLoading, setTechLoading] = useState(true);

  const [artCourses, setArtCourses] = useState<any[]>([]);
  const [artLoading, setArtLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase
        .from("courses")
        .select(
          `
          id,
          name,
          image_link,
          fee,
          instructor:instructor_id (first_name, last_name)
        `
        )
        .eq("status", "Published")
        .limit(20);

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
            (course.instructor.first_name ?? "") +
            " " +
            (course.instructor.last_name ?? ""),
        }));

        setCourses(formattedCourses);
      }
      setLoading(false);
    };

    const fetchMathCourses = async () => {
      setMathLoading(true);
      try {
        const response = await axiosForm.post("/api/search", {
          query: "mathematics science calculus physics chemistry biology",
        });

        const formattedCourses = response.data.map((course: any) => ({
          id: course.id,
          title: course.name,
          imageUrl: course.image_link,
          price: course.fee,
          level: "Beginner",
          instructorName: course.instructor_name || "Instructor",
        }));

        setMathCourses(formattedCourses);
      } catch (error) {
        console.error("Error fetching math courses:", error);
      } finally {
        setMathLoading(false);
      }
    };

    const fetchTechCourses = async () => {
      setTechLoading(true);
      try {
        const response = await axiosForm.post("/api/search", {
          query: "programming coding development software engineering web app",
        });

        const formattedCourses = response.data.map((course: any) => ({
          id: course.id,
          title: course.name,
          imageUrl: course.image_link,
          price: course.fee,
          level: "Beginner",
          instructorName: course.instructor_name || "Instructor",
        }));

        setTechCourses(formattedCourses);
      } catch (error) {
        console.error("Error fetching tech courses:", error);
      } finally {
        setTechLoading(false);
      }
    };

    const fetchArtCourses = async () => {
      setArtLoading(true);
      try {
        const response = await axiosForm.post("/api/search", {
          query:
            "art drawing painting design illustration creative photography",
        });

        const formattedCourses = response.data.map((course: any) => ({
          id: course.id,
          title: course.name,
          imageUrl: course.image_link,
          price: course.fee,
          level: "Beginner",
          instructorName: course.instructor_name || "Instructor",
        }));

        setArtCourses(formattedCourses);
      } catch (error) {
        console.error("Error fetching art courses:", error);
      } finally {
        setArtLoading(false);
      }
    };

    fetchCourses();
    fetchMathCourses();
    fetchTechCourses();
    fetchArtCourses();
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
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-deepteal"></div>
            </div>
          ) : (
            <div className="flex overflow-x-auto pb-4 gap-4 snap-x">
              {courses.map((course, index) => (
                <div key={index} className="min-w-[280px] snap-start">
                  <CourseCard {...course} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-8">
          <h2 className="text-deepteal text-2xl font-extrabold mb-4">
            Maths & Science
          </h2>

          {mathLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-deepteal"></div>
            </div>
          ) : (
            <div className="flex overflow-x-auto pb-4 gap-4 snap-x">
              {mathCourses.map((course, index) => (
                <div key={index} className="min-w-[280px] snap-start">
                  <CourseCard {...course} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-8">
          <h2 className="text-deepteal text-2xl font-extrabold mb-4">
            Programming & Tech
          </h2>

          {techLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-deepteal"></div>
            </div>
          ) : (
            <div className="flex overflow-x-auto pb-4 gap-4 snap-x">
              {techCourses.map((course, index) => (
                <div key={index} className="min-w-[280px] snap-start">
                  <CourseCard {...course} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-8">
          <h2 className="text-deepteal text-2xl font-extrabold mb-4">Arts</h2>

          {artLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-deepteal"></div>
            </div>
          ) : (
            <div className="flex overflow-x-auto pb-4 gap-4 snap-x">
              {artCourses.map((course, index) => (
                <div key={index} className="min-w-[280px] snap-start">
                  <CourseCard {...course} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
