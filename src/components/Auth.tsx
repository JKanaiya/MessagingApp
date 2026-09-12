import { useContext } from "react";
import { Outlet } from "react-router";
import AuthContext from "../AuthContext";

export default function Auths() {
  const { login } = useContext(AuthContext);
  return <Outlet context={[login]} />;
}
