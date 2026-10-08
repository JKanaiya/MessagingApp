import { useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import AuthContext from "../AuthContext";
import ApiCall from "../apiCalls";
import { mutate } from "swr";

function GuestLogin() {
  const { login } = useContext(AuthContext);

  const token = localStorage.getItem("token");

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const getChatrooms = async (url: string) => {
    console.log(token);

    const chats = await axios.get(url, config).catch(function (err) {
      if (401 == err.response.status) {
        console.log("bla");
      }
      return err.response;
    });
    return chats.data;
  };
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
      await getChatrooms(import.meta.env.VITE_BACKEND_URL + "chatrooms")
        .then((val) => val)
        .then((val) => {
          const chatrooms = val.chatrooms;
          console.log(val);
          mutate({ ...chatrooms, users: [val.users] });
        })
        .then(() => login(specEmail))
        .then(() => nav("/"))
        .catch((err) => false);
    }
  };

  return <button onClick={guestLogin}>Guest Login</button>;
}

export default GuestLogin;
