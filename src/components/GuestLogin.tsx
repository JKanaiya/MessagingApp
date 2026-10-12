import { useContext } from "react";
import UserContext from "../UserContext.tsx";
import { useNavigate } from "react-router";
import AuthContext from "../AuthContext";
import ApiCall from "../apiCalls";

function GuestLogin() {
  const { login } = useContext(AuthContext);
  const { upsertUser } = useContext(UserContext);
  const nav = useNavigate();

  const specEmail = localStorage.getItem("messaging_app_spec_email");

  const guestLogin = async () => {
    const res =
      specEmail == null
        ? await ApiCall.spectatorSignUp().then(() => ApiCall.spectatorLogin())
        : await ApiCall.spectatorLogin();
    if (res.status != 200) {
      throw new Error(`HTTP Error! Status: ${res.status}`);
    } else {
      upsertUser(res.data.user);
      await login(specEmail!);
      await nav("/");
    }
  };

  return (
    <button onClick={guestLogin} style={{ borderRadius: "5px" }}>
      Guest Login
    </button>
  );
}

export default GuestLogin;
