import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { IoMdAddCircleOutline } from "react-icons/io";
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
  selectedChat,
  toggleProfileOpen,
}: {
  chats: Chat[];
  selectedChat: boolean | Chat;
  profileOpen: boolean;
  toggleProfileOpen: () => void;
}) {
  // in the case of a specatator, they would be added to the relevant spectating chatrooms. In those, the new spectator ( == user), would be appended to the subusers array
  // within the spectating chatroom, hopefully causing a mutate? should be more straightforward given the swr data is in this component
  const { isLoggedIn, logout } = useContext(AuthContext);
  const { user } = useContext(UserContext);
  const { setSelectedChat } = useContext(SelectionContext);
  const [userListOpen, setUserListOpen] = useState(false);

  const email = localStorage.getItem("messaging_app_email");
  const nav = useNavigate();
  const specEmail = localStorage.getItem("messaging_app_spec_email");
  const token = localStorage.getItem("token");
  // TODO: Socket listener for new user added to the users list. mutate users on newUser listener

  const logOut = () => {
    logout();
    nav("/");
  };

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

  console.log(users);

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
  console.log(window.innerWidth);

  return (
    <div
      className={chatrooms.panel}
      style={{
        display: window.innerWidth < 800 && selectedChat ? "none" : "flex",
      }}
    >
      <div className={chatrooms.rooms}>
        {chats.map((chat) => (
          <li className={chatrooms.chat} onClick={() => joinChatroom(chat)}>
            <img
              src={
                chat.users.filter((user) => user.email != email)[0].profileImage
              }
            />
            <div>
              <p style={{ fontSize: "1.2rem" }}>
                {chat.users.filter((user) => user.email != email)[0].name}
              </p>
              <p style={{ color: "oklch(0.9 0 0)" }}>{chat.lastMessage}</p>
            </div>
          </li>
        ))}
      </div>
      <button
        onClick={() => setUserListOpen(!userListOpen)}
        className={chatrooms.addChatroom}
      >
        <IoMdAddCircleOutline />
      </button>
      {Array.isArray(users) && userListOpen && !loading && (
        <div className={chatrooms.users}>
          {users.map(
            (user: User) =>
              user.email != email &&
              user.email != specEmail && (
                <li onClick={() => chatWithUser(user)}>{user.email}</li>
              ),
          )}
        </div>
      )}
      <div className={chatrooms.profileBar}>
        <div>
          <img
            src={userImg.data.publicUrl}
            className={chatrooms.profileImg}
            onClick={() => toggleProfileOpen()}
          />
          <h4
            style={{
              color: "white",
              maxWidth: "150px",
              maxHeight: "20px",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {user?.name}
          </h4>
        </div>
        <button onClick={logOut} className={chatrooms.logout}>
          LogOut
        </button>
      </div>
      {profileOpen && <Profile toggleProfileOpen={toggleProfileOpen} />}
    </div>
  );
}

export default Chatrooms;
