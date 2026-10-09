import { useContext, useEffect, useState } from "react";
import axios from "axios";
import useSWR from "swr";
import UserContext from "../UserContext.tsx";
import Profile from "./Profile.tsx";
import chatrooms from "../styles/chatrooms.module.css";
import { supabase } from "../supabase.ts";
import type { Message, User } from "./Home";
import AuthContext from "../AuthContext";
import SelectionContext from "../SelectionContext";
import { socket } from "../socket";
import type { Chat } from "./Chat.tsx";
import ApiCall from "../apiCalls.ts";

export type ChatRoom = {
  messages: Message[];
  id: number;
  userid: number;
};

function Chatrooms({
  chats,
  profileOpen,
  toggleProfileOpen,
}: {
  chats: Chat[];
  profileOpen: boolean;
  toggleProfileOpen: () => void;
}) {
  // in the case of a specatator, they would be added to the relevant spectating chatrooms. In those, the new spectator ( == user), would be appended to the subusers array
  // within the spectating chatroom, hopefully causing a mutate? should be more straightforward given the swr data is in this component
  const { isLoggedIn } = useContext(AuthContext);
  const { user } = useContext(UserContext);
  const { setSelectedChat } = useContext(SelectionContext);
  const [userListOpen, setUserListOpen] = useState(false);

  const email = localStorage.getItem("messaging_app_email");
  const specEmail = localStorage.getItem("messaging_app_spec_email");
  const token = localStorage.getItem("token");
  // TODO: Socket listener for new user added to the users list. mutate users on newUser listener

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const getUsers = async (url: string) => {
    const chats = await axios.get(url, config).catch(function (err) {
      if (401 == err.response.status) {
        console.error("Unauthorized");
      }
      return err.response;
    });
    return chats.data;
  };

  const {
    data: users,
    error,
    mutate,
    isLoading: loading,
  } = useSWR(import.meta.env.VITE_BACKEND_URL + "users", getUsers);

  if (chats != undefined) {
    chats.forEach((chat) => {
      chat.users.map((user) => {
        const userImg = supabase.storage
          .from("Profiles")
          .getPublicUrl(user.email + "/" + user.profileImageUrl!);

        user.profileImage = userImg.data.publicUrl;
      });

      chat.lastMessage =
        chat.messages.length != 0
          ? chat.messages[chat.messages.length - 1].text
          : "";
    });
  }

  const chatWithUser = async (user2: User) => {
    try {
      const response = await ApiCall.createChatroom(user2);

      if (response.status != 200) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      } else {
        mutate(import.meta.env.VITE_BACKEND_URL + "chatrooms", true);
      }
    } catch (e) {
      console.log(`Error creating chatroom: ${e}`);
    }
  };

  const joinChatroom = (chat: Chat) => {
    socket.timeout(500).emit("join chat", chat);
    setSelectedChat(chat);
  };

  // Return earlier in the case of loading

  const userImg = supabase.storage
    .from("Profiles")
    .getPublicUrl(email + "/" + user?.profileImageUrl!);

  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, [isLoggedIn]);

  return (
    <div className={chatrooms.panel}>
      <div className={chatrooms.rooms}>
        {chats.map((chat) => (
          <li className={chatrooms.chat} onClick={() => joinChatroom(chat)}>
            <img
              src={
                chat.users.filter((user) => user.email != email)[0].profileImage
              }
            />
            <p>{chat.users.filter((user) => user.email != email)[0].name}</p>
            <p>{chat.lastMessage}</p>
          </li>
        ))}
      </div>
      <button onClick={() => setUserListOpen(!userListOpen)}>Find User</button>
      {userListOpen &&
        !loading &&
        users.map(
          (user: User) =>
            user.email != email &&
            user.email != specEmail && (
              <li onClick={() => chatWithUser(user)}>{user.email}</li>
            ),
        )}
      <div className={chatrooms.profileBar}>
        <h4>{user?.name}</h4>
        <img
          src={userImg.data.publicUrl}
          className={chatrooms.profileImg}
          onClick={() => toggleProfileOpen()}
        />
      </div>
      {profileOpen && <Profile />}
    </div>
  );
}

export default Chatrooms;
