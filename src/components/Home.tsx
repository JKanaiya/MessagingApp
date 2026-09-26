import Chat from "../components/Chat.tsx";
import axios from "axios";
import useSWR from "swr";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../AuthContext";
import Login from "./Login.tsx";
import Profile from "./Profile.tsx";
import Chatrooms from "./Chatrooms.tsx";
import SelectionContext from "../SelectionContext.tsx";
import { socket } from "../socket.ts";

export type User = {
  email: string;
  id: number;
  name: string;
  profileImageUrl: string;
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
  timeSent: Date;
  timeUpdated: Date | null;
  userId: number;
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

  // const users = data.map((chat) => {
  //   return {
  //     chatId: chat.messages.chatroomId,
  //     user: chat.messages.user,
  //   };
  // });
  // //
  // console.log(users);

  const email = localStorage.getItem("messaging_app_email");
  const user =
    data && data[0].messages.find((mess) => mess.user.email == email);

  return (
    <>
      <div>
        {isLoggedIn ? !loading && <Chatrooms chats={data} /> : <Login />}
        <button onClick={() => setProfileOpen(!profileOpen)}>Profile</button>
      </div>
      <div>
        {selectedChat && data != undefined && (
          <Chat
            data={data.filter((chat) => chat.id == selectedChat.id)[0]}
            mutate={mutate}
          />
        )}
      </div>
      {data && profileOpen && <Profile user={user} />}
    </>
  );
}

export default Home;
