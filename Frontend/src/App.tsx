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
import InstructorCouponPage from "./pages/InstructorCouponPage";

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
    path: "/course/:courseId",
    element: <CoursePage />,
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [{ path: "/coursecontent/:course_id", element: <CourseContentPage /> }],
  },
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
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
