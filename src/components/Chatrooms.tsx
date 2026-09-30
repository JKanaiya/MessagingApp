import { useContext, useEffect } from "react";
import Profile from "./Profile.tsx";
import chatrooms from "../styles/chatrooms.module.css";
import { supabase } from "../supabase.ts";
import type { Message, Users, User, UserProfileImages } from "./Home";
import AuthContext from "../AuthContext";
import SelectionContext from "../SelectionContext";
import { socket } from "../socket";
import type { Chat } from "./Chat.tsx";

export type ChatRoom = {
  messages: Message[];
  id: number;
  userid: number;
};

function Chatrooms({
  chats,
  user,
  profileOpen,
  setProfileOpen,
}: {
  chats: Chat[];
  user: User;
  profileOpen: boolean;
  setProfileOpen: (arg0: boolean) => {};
  setUserProfileImages: ([]) => {};
}) {
  const email = localStorage.getItem("messaging_app_email");
  const { isLoggedIn } = useContext(AuthContext);
  const { setSelectedChat, selectedChat } = useContext(SelectionContext);

  if (chats != undefined) {
    chats.forEach((chat) => {
      chat.users.map((user) => {
        const userImg = supabase.storage
          .from("Profiles")
          .getPublicUrl(user.email + "/" + user.profileImageUrl!);

        user.profileImage = userImg.data.publicUrl;
      });

      chat.lastMessage = chat.messages[chat.messages.length - 1].text;
    });
  }

  const joinChatroom = (chat: Chat) => {
    socket.timeout(500).emit("join chat", chat);
    setSelectedChat(chat);
  };

  const userImg = supabase.storage
    .from("Profiles")
    .getPublicUrl(email + "/" + user.profileImageUrl!);

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
      <div className={chatrooms.profileBar}>
        <h4>{user.name}</h4>
        <img
          src={userImg.data.publicUrl}
          className={chatrooms.profileImg}
          onClick={() => setProfileOpen(!profileOpen)}
        />
      </div>
      {profileOpen && <Profile user={user} />}
    </div>
  );
}

export default Chatrooms;
