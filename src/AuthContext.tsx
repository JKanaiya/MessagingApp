import { createContext } from "react";

type Auth = {
  isLoggedIn: boolean;
  email: string | null;
  login: (email: string) => void;
  logout: () => void;
};

const AuthContext = createContext<Auth | null>(null);

export default AuthContext;
