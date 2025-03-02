import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import CourseContentPage from "./pages/CourseContent"
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
    path: "/coursecontent",
    element: <CourseContentPage />
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );

}

export default App;
