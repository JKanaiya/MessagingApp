import { createContext } from "react";

export type Auth = {
  isLoggedIn: boolean;
  email: string | null;
  login: (email: string) => void;
  logout: () => void;
};

const AuthContext = createContext<Auth>({
  isLoggedIn: false,
  email: "",
  logout: () => {},
  login: () => {},
});

export default AuthContext;
