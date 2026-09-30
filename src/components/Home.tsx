import Chat from "../components/Chat.tsx";
import axios from "axios";
import useSWR from "swr";
import home from "../styles/home.module.css";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../AuthContext";
import Chatrooms from "./Chatrooms.tsx";
import SelectionContext from "../SelectionContext.tsx";
import { socket } from "../socket.ts";

export type User = {
  email: string;
  id: number;
  name: string;
  profileImageUrl: string;
  profileImage: string | undefined;
  lastMessage: string | undefined;
};

export type Users = {
  user: User;
  profileImage: string | null;
  chatId: number;
};

export type Message = {
  id: number;
  user: User;
  chatroomId: number;
  text: string;
  timeSent: string;
  timeUpdated: string | null;
  userId: number;
  topBorder: boolean | undefined;
  bottomBorder: boolean | undefined;
};

function Home() {
  const { isLoggedIn } = useContext(AuthContext);

  const { selectedChat, setSelectedChat } = useContext(SelectionContext);

  const [profileOpen, setProfileOpen] = useState(false);

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
  // debugger;

  // useEffect(() => {
  //   console.log(error);
  //   console.log(data);
  //
  //   return () => {
  //     return;
  //   };
  // }, [error, data]);

  socket.on("receive-message", () => {
    mutate();
  });

  const email = localStorage.getItem("messaging_app_email");
  const user =
    Array.isArray(data) &&
    data[0].users.find((user: User) => user.email == email);

  return (
    <>
      {data && (
        <div className={home.home}>
          {!loading && (
            <Chatrooms
              chats={data}
              user={user}
              profileOpen={profileOpen}
              setProfileOpen={setProfileOpen}
            />
          )}
          {<Chat user={user} mutate={mutate} selectedChat={selectedChat} />}
        </div>
      )}
    </>
  );
}

export default Home;
