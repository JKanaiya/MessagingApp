import Chat from "../components/Chat.tsx";
import axios from "axios";
import useSWR from "swr";
import { useContext, useEffect } from "react";
import AuthContext from "../AuthContext";
import Login from "./Login.tsx";

function Home() {
  const { isLoggedIn } = useContext(AuthContext);

  const token = localStorage.getItem("token");

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const getChatrooms = async (url: string) => {
    const chats = await axios
      .get(url + "chatrooms", config)
      .catch(function (err) {
        if (401 == err.response.status) {
          console.log("bla");
        }
        return err.response;
      });
    return chats.data;
  };

  const {
    data,
    error,
    mutate,
    isLoading: loading,
  } = useSWR(import.meta.env.VITE_BACKEND_URL, getChatrooms, {
    revalidateOnMount: true,
  });

  useEffect(() => {
    console.log(error);
    console.log(data);

    return () => {
      return;
    };
  }, [error, data]);

  console.log(data);

  return <div>{isLoggedIn ? <Chat /> : <Login />}</div>;
}

export default Home;
