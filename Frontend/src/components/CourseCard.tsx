import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

interface CourseCardProps {
  id: number;
  imageUrl: string;
  title: string;
  instructorName: string;
  rating?: number;
  ratingCount?: number;
  price: number | "Free";
  level?: "Beginner" | "Intermediate" | "Advanced";
  is_Instructor?: boolean;
  studentCount?: number;
}

export function CourseCard({
  id,
  imageUrl,
  title,
  instructorName,
  price,
  level,
  is_Instructor = false,
}: CourseCardProps) {
  return (
    <Link
      to={is_Instructor ? `/course/${id}/upload` : `/course/${id}`}
      className="block"
    >
      <div className="bg-custom-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full hover:transform hover:scale-[1.02] transition-all">
        <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
        <div className="p-4">
          <h3 className="text-deepteal font-bold text-xl mb-2 line-clamp-2">
            {title}
          </h3>
          <p className="text-gray-500 text-sm mb-2">{instructorName}</p>
          <div className="flex justify-between items-center mt-4">
            <span className="text-deepteal font-bold text-lg">
              {price === "Free" || price === 0
                ? "Free"
                : `${price.toLocaleString()}₫`}
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
