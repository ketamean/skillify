import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import CoursePage from "./pages/CoursePage";
import CourseContentPage from "./pages/CourseContent";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfilePage from "./pages/Profile";
import MyLearningPage from "./pages/MyLearning";
import SearchPage from "./pages/SearchPage";

import ChatBot from "./components/ChatBot";
import InstructorCouponPage from "./pages/InstructorCouponPage";
import CourseEdit from "./pages/CourseEdit";

import { Toaster } from "@/components/ui/sonner"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/course/:course_id",
    element: <CoursePage />,
  },
  {
    path: "/search",
    element: <SearchPage />,
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      { path: "/coursecontent/:course_id", element: <CourseContentPage /> },
    ],
  },
  { path: "/course/:course_id/upload", element: <CourseEdit /> },
  {
    path: "/profile",
    element: <ProfilePage />,
  },
  {
    path: "/mylearning",
    element: <MyLearningPage />,
  },
  {
    path: "/instructor/coupons",
    element: <InstructorCouponPage />,
  }
]);

function App() {
  return (
    <AuthProvider>
      <>
        <RouterProvider router={router} />
        <ChatBot />
        <Toaster />
      </>
    </AuthProvider>
  );
}

export default App;
