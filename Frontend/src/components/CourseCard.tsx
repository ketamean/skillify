import { Link } from "react-router-dom";

interface CourseCardProps {
  id: string;
  imageUrl: string;
  title: string;
  instructorName: string;
  rating?: number;
  ratingCount?: number;
  price: number | "Free";
  level?: "Beginner" | "Intermediate" | "Advanced";
}

export function CourseCard({
  id,
  imageUrl,
  title,
  instructorName,
  rating,
  ratingCount,
  price,
  level,
}: CourseCardProps) {
  return (
    <Link to={`/course/${id}`} className="block">
      <div className="bg-custom-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full hover:transform hover:scale-[1.02] transition-all">
        <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
        <div className="p-4">
          <h3 className="text-deepteal font-bold text-xl mb-2 line-clamp-2">
            {title}
          </h3>
          <p className="text-gray-500 text-sm mb-2">{instructorName}</p>
          {rating && ratingCount && (
            <div className="flex items-center mb-2">
              <span className=" font-bold">{rating}</span>
              <div className="flex text-sunbeam ml-1">
                {"★".repeat(Math.floor(rating))}
                {"☆".repeat(5 - Math.floor(rating))}
              </div>
              <span className="text-gray-500 text-sm ml-1">
                ({ratingCount})
              </span>
            </div>
          )}
          <div className="flex justify-between items-center mt-4">
            <span className="text-deepteal font-bold text-lg">
              {price === "Free" ? "Free" : `$${price}`}
            </span>
            {level && (
              <span className="bg-vibrant-green text-deepteal text-sm font-extrabold px-2 py-1 rounded">
                {level}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
