import "./App.css";
import { useEffect, useState } from "react";
import router from "./routes.jsx";
import AuthContext from "./AuthContext";
import { RouterProvider } from "react-router";
import "./styles/reset.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const email = localStorage.getItem("email");
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
    localStorage.removeItem("email");
    setEmail(null);
  };

  return (
    <AuthContext value={{ isLoggedIn, email, login, logout }}>
      <RouterProvider router={router} />
    </AuthContext>
  );
}

export default App;
