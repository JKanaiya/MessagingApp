import { useContext } from "react";
import { Outlet, useOutletContext } from "react-router";
import AuthContext from "../AuthContext";

export type AuthContextType = {
  login: (email: string) => void;
};

export default function Auths() {
  const { login } = useContext(AuthContext);

  return <Outlet context={{ login } satisfies AuthContextType} />;
}

export function loginUser() {
  return useOutletContext<AuthContextType>();
}
