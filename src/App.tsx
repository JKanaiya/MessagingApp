import "./App.css";
import { socket } from "./socket";
import { useEffect, useState } from "react";
import router from "./routes.jsx";
import Home from "./components/Home";
import AuthContext from "./AuthContext";
import { RouterProvider } from "react-router";
import "./styles/reset.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [isLoggedIn]);

  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const email = localStorage.getItem("messaging_app_email");
    if (email) {
      login(email);
    }
  }, []);

  const login = (email: string) => {
    setIsLoggedIn(true);
    setEmail(email);
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("user");
    localStorage.removeItem("messaging_app_email");
    setEmail(null);
  };

  return (
    <AuthContext value={{ isLoggedIn, email, login, logout }}>
      <RouterProvider router={router} />
    </AuthContext>
  );
}

export default App;
