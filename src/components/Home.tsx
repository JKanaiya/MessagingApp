import Chat from "../components/Chat.tsx";
import axios from "axios";
import useSWR from "swr";
import home from "../styles/home.module.css";
import { useContext, useEffect, useState } from "react";
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
  spectator: boolean | undefined;
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
  const { selectedChat } = useContext(SelectionContext);
  const [profileOpen, setProfileOpen] = useState(true);

  const token = localStorage.getItem("token");

  const toggleProfileOpen = () => {
    setProfileOpen(!profileOpen);
  };

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const getChatrooms = async (url: string) => {
    const chats = await axios.get(url, config).catch(function (err) {
      if (401 == err.response.status) {
        console.error("Unauthorized");
      }
      return err.response;
    });
    return chats.data;
  };

  const {
    data: chatrooms,
    error,
    mutate,
    isLoading: loading,
  } = useSWR(import.meta.env.VITE_BACKEND_URL + "chatrooms", getChatrooms);

  // useEffect(() => {
  //   console.log(error);
  //   console.log(data);
  //
  //   return () => {
  //     return;
  //   };
  // }, [error, data]);
  if (error) {
    console.log(error);
  }

  socket.on("receive-message", () => {
    mutate();
  });

  // if (loading) return <h2>Loading</h2>;
  // if (error) return <h2>Error</h2>;
  return (
    <>
      {!loading && chatrooms && (
        <div className={home.home}>
          {
            <Chatrooms
              chats={chatrooms}
              profileOpen={profileOpen}
              toggleProfileOpen={toggleProfileOpen}
            />
          }
          {
            <Chat
              mutate={mutate}
              selectedChat={
                selectedChat
                  ? chatrooms.find((chat) => chat.id == selectedChat.id)
                  : selectedChat
              }
            />
          }
        </div>
      )}
    </>
  );
}

export default Home;
