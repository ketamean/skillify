import NavBar from "../../components/NavBar";
import { useEffect, useState } from "react";
import { axiosForm } from "../../config/axios";
import { useLocation } from "react-router-dom";
import { CourseCard } from "../../components/CourseCard";

interface CourseResult {
  id: number;
  name: string;
  short_description: string;
  image_link: string;
  fee: number;
  instructors: {
    first_name: string;
    last_name: string;
  };
  level?: "Beginner" | "Intermediate" | "Advanced";
}

export default function TopicsPage() {
  const [courses, setCourses] = useState<CourseResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [topicName, setTopicName] = useState<string>("");
  const location = useLocation();

  // Extract topic id from URL search params
  const queryParams = new URLSearchParams(location.search);
  const topicId = queryParams.get("id");

  useEffect(() => {
    const fetchCoursesByTopic = async () => {
      if (!topicId) {
        setLoading(false);
        setError("Topic ID is missing");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Fetch courses by topic id
        const response = await axiosForm.get(`/api/search/topic/${topicId}`);
        setCourses(response.data);

        // Get topic name
        if (response.data.length > 0) {
          const topicResponse = await axiosForm.get(
            `/api/search/topic-name/${topicId}`
          );
          if (topicResponse.data && topicResponse.data.name) {
            setTopicName(topicResponse.data.name);
          }
        }
      } catch (err: any) {
        setError(
          err.response?.data?.error || "Failed to fetch courses for this topic"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCoursesByTopic();
  }, [topicId]);

  return (
    <div className="min-h-screen bg-custom-white">
      <NavBar />

      <main className="container mx-auto mt-8 px-[4%] pb-12">
        <div className="mb-8">
          <h1 className="text-deepteal text-3xl font-bold mb-2">
            {topicName ? `Courses on ${topicName}` : "Topic Courses"}
          </h1>
          <p className="text-gray-600 mb-6">{courses.length} courses found</p>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-deepteal"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg">
              {error}
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-2">No courses found</h2>
              <p className="text-gray-600 mb-6">
                There are no courses available for this topic at the moment
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  id={course.id}
                  imageUrl={course.image_link}
                  title={course.name}
                  instructorName={
                    (course.instructors?.first_name ?? "") +
                    " " +
                    (course.instructors?.last_name ?? "")
                  }
                  price={course.fee === 0 ? "Free" : course.fee}
                  level={course.level || "Beginner"}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
