import Chat from "../components/Chat.tsx";
import axios from "axios";
import useSWR from "swr";
import { useContext, useEffect } from "react";
import AuthContext from "../AuthContext";
import SignUp from "./SignUp.tsx";
import Login from "./Login.tsx";
import Chatrooms from "./Chatrooms.tsx";
import SelectionContext from "../SelectionContext.tsx";

export type User = {
  email: string;
  id: number;
  name: string;
  profileImageUrl: string;
};

export type Users = {
  user: User;
  chatId: number;
};

export type Message = {
  id: number;
  user: User;
  chatroomId: number;
  text: string;
  timeSent: Date;
  timeUpdated: Date | null;
  userId: number;
};

function Home() {
  const { isLoggedIn } = useContext(AuthContext);

  const { selectedChat } = useContext(SelectionContext);

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
    // revalidateOnMount: true,
  });
  // debugger;

  // useEffect(() => {
  //   console.log(error);
  //   console.log(data);
  //
  //   return () => {
  //     return;
  //   };
  // }, [error, data]);

  // console.log(data.includes(2));

  // const users = data.map((chat) => {
  //   return {
  //     chatId: chat.messages.chatroomId,
  //     user: chat.messages.user,
  //   };
  // });
  // //
  // console.log(users);

  return (
    <>
      <div>{isLoggedIn ? data && <Chatrooms chats={data} /> : <Login />}</div>
      <div>{selectedChat && <Chat data={selectedChat} />}</div>
    </>
  );
}

export default Home;
