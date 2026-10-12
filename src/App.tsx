// import "./App.css";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Auth from "./components/Auth.tsx";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import Home from "./components/Home";
import AuthContext from "./AuthContext";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import "./styles/reset.css";
import ApiCall from "./apiCalls.js";
import type { ChatRoom } from "./components/Chatrooms.js";
import SelectionContext from "./SelectionContext.js";
import ErrorPage from "./components/ErrorPage.js";
import axios from "axios";
import UserContext from "./UserContext.tsx";
import type { User } from "@supabase/supabase-js";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedChat, setSelectedChat] = useState<ChatRoom | null>();
  const [user, setUser] = useState<User | null>(null);

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
  // const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const email = localStorage.getItem("messaging_app_email");
    const specEmail = localStorage.getItem("messaging_app_spec_email");
    if (specEmail) {
    } else {
      login(email);
    }
  }, [isLoggedIn]);

  const upsertUser = (user: User | null) => {
    setUser(user);
  };

  const authCheck = async function () {
    const token = localStorage.getItem("token");
    const result = await axios
      .get("auth-check", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch(function (err) {
        return err.response;
      });
    return result;
  };

  const login = async (email: string) => {
    const res = await authCheck();
    if (res.status == 200 || res == "authed") {
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
    localStorage.clear();
    upsertUser(null);
    setEmail(null);
  };

  return (
    <AuthContext value={{ isLoggedIn, email, login, logout }}>
      <SelectionContext value={{ selectedChat, setSelectedChat }}>
        <UserContext value={{ upsertUser, user }}>
          <Router>
            <Routes>
              <Route
                path="/"
                element={
                  isLoggedIn ? (
                    <Home />
                  ) : (
                    <Navigate replace to={"/auth/log-in"} />
                  )
                }
                errorElement=<ErrorPage />
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
              <Route path="error" element=<ErrorPage />></Route>
            </Routes>
          </Router>
        </UserContext>
      </SelectionContext>
    </AuthContext>
  );
}

export default App;
