import SignUp from "./components/SignUp";
import Home from "./components/Home";
import Auth from "./components/Auth.tsx";
import Login from "./components/Login";
import { createBrowserRouter } from "react-router";
import ErrorPage from "./components/ErrorPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "auth",
    element: <Auth />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "sign-up",
        element: <SignUp />,
      },
      {
        path: "log-in",
        element: <Login />,
      },
    ],
  },
]);

export default router;
