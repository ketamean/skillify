import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import CoursePage from "./pages/CoursePage";
import UploadCourseContentPage from "./pages/CourseEdit";
import CourseContentPage from "./pages/CourseContent"
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "@/components/ui/sonner"
const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />,
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/course",
    element: <CoursePage id={3}/>
  },
  {
    path: "/course/upload",
    element: <UploadCourseContentPage />
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      { path: "/coursecontent", element: <CourseContentPage /> },
    ],
  },
]);

function App() {

  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <RouterProvider router={router} />
        <Toaster />
      </div>
    </AuthProvider>
  );

}

export default App;
