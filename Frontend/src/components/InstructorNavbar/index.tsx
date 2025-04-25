import { ReactElement } from "react";
import { Link } from "react-router-dom";

interface InstructorNavbarProps {
  activeTab: "courses" | "coupons" | "analytics" | "students";
}

export default function InstructorNavbar({
  activeTab,
}: InstructorNavbarProps): ReactElement {
  return (
    <div className="bg-gray-800 text-white">
      <div className="container mx-auto px-[4%]">
        <div className="flex items-center space-x-6 py-3 overflow-x-auto">
          <Link
            to="/instructor/dashboard"
            className={`py-2 px-1 border-b-2 ${
              activeTab === "courses"
                ? "border-vibrant-green font-medium"
                : "border-transparent hover:border-vibrant-green font-medium"
            }`}
          >
            Courses
          </Link>
          <Link
            to="/instructor/coupons"
            className={`py-2 px-1 border-b-2 ${
              activeTab === "coupons"
                ? "border-vibrant-green font-medium"
                : "border-transparent hover:border-vibrant-green font-medium"
            }`}
          >
            Coupons
          </Link>
          <Link
            to="#"
            className={`py-2 px-1 border-b-2 ${
              activeTab === "analytics"
                ? "border-vibrant-green font-medium"
                : "border-transparent hover:border-vibrant-green font-medium"
            }`}
          >
            Analytics
          </Link>
          <Link
            to="#"
            className={`py-2 px-1 border-b-2 ${
              activeTab === "students"
                ? "border-vibrant-green font-medium"
                : "border-transparent hover:border-vibrant-green font-medium"
            }`}
          >
            Students
          </Link>
        </div>
      </div>
    </div>
  );
}
