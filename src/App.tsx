import "./App.css";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Auth from "./components/Auth.tsx";
import { socket } from "./socket";
import { Children, useEffect, useState } from "react";
import router from "./routes.jsx";
import Home from "./components/Home";
import AuthContext from "./AuthContext";
import {
  RouterProvider,
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router";
import "./styles/reset.css";
import ApiCall from "./apiCalls.js";
import type { ChatRoom } from "./components/Chatrooms.js";
import SelectionContext from "./SelectionContext.js";
import ErrorPage from "./components/ErrorPage.js";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedChat, setSelectedChat] = useState<ChatRoom | null>();

  // useEffect(() => {
  //   function onConnect() {
  //     setIsConnected(true);
  //   }
  //
  //   function onDisconnect() {
  //     setIsConnected(false);
  //   }
  //
  //   socket.on("connect", onConnect);
  //   socket.on("disconnect", onDisconnect);
  //
  //   return () => {
  //     socket.off("connect", onConnect);
  //     socket.off("disconnect", onDisconnect);
  //   };
  // }, [isLoggedIn]);

  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const email = localStorage.getItem("messaging_app_email");
    if (email) {
      login(email);
    }
  }, []);

  const login = async (email: string) => {
    const res = await ApiCall.authCheck();
    console.log(res);
    if (res.status == 200) {
      setEmail(email);
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      localStorage.removeItem("user");
      localStorage.removeItem("messaging_app_email");
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("messaging_app_email");
    setEmail(null);
  };

  return (
    <AuthContext value={{ isLoggedIn, email, login, logout }}>
      <SelectionContext value={{ selectedChat, setSelectedChat }}>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                isLoggedIn ? <Home /> : <Navigate replace to={"/auth/log-in"} />
              }
            />
            <Route path="auth" element=<Auth /> errorElement=<ErrorPage />>
              <Route
                path="sign-up"
                element=<SignUp />
                errorElement=<ErrorPage />
              />
              <Route
                path="log-in"
                element=<Login />
                errorElement=<ErrorPage />
              />
            </Route>
          </Routes>
        </Router>
      </SelectionContext>
    </AuthContext>
  );
}

export default App;
