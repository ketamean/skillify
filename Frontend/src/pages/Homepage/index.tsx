import { CourseCard } from "../../components";

export default function Homepage() {
  const courses = [
    {
      imageUrl:
        "https://vinhphamthanh.dev/posts/switch-lite-review/featured.jpg",
      title: "The Complete Web Development Bootcamp 2024",
      instructorName: "Dr. Angela Yu",
      rating: 4.8,
      ratingCount: 1200,
      price: 19.99 as const,
      level: "Beginner" as const,
    },
    {
      imageUrl: "https://via.placeholder.com/300x200",
      title: "Mastering React with Hooks and Context API",
      instructorName: "John Doe",
      rating: 4.6,
      ratingCount: 850,
      price: "Free" as const,
      level: "Intermediate" as const,
    },
    {
      imageUrl: "https://via.placeholder.com/300x200",
      title: "Advanced TypeScript Programming",
      instructorName: "Jane Smith",
      rating: 4.9,
      ratingCount: 650,
      price: 29.99 as const,
      level: "Advanced" as const,
    },
    {
      imageUrl: "https://via.placeholder.com/300x200",
      title: "UI/UX Design Fundamentals",
      instructorName: "Mike Johnson",
      rating: 4.7,
      ratingCount: 920,
      price: 24.99 as const,
      level: "Beginner" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-custom-white">
      {/* Banner Section */}
      <div className="relative h-[400px] mx-auto container flex justify-center">
        <div className="relative w-[92%] h-full">
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
            <div className="relative h-full container mx-auto px-4 flex flex-col justify-center">
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
      <main className="container mx-auto">
        <div className="mb-8">
          <h2 className="text-deepteal text-2xl font-extrabold mb-4">
            Featured Courses
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course, index) => (
              <CourseCard key={index} {...course} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
