import { useContext, useEffect, useState } from "react";
import Profile from "./Profile.tsx";
import chatrooms from "../styles/chatrooms.module.css";
import { supabase } from "../supabase.ts";
import type { Message, Users, User, UserProfileImages } from "./Home";
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
  mutate,
  user,
  users,
  profileOpen,
  setProfileOpen,
}: {
  chats: Chat[];
  user: User;
  mutate: () => {};
  users: User[];
  profileOpen: boolean;
  setProfileOpen: (arg0: boolean) => {};
  setUserProfileImages: ([]) => {};
}) {
  const email = localStorage.getItem("messaging_app_email");
  const specEmail = localStorage.getItem("messaging_app_spec_email");
  const { isLoggedIn } = useContext(AuthContext);
  const { setSelectedChat, selectedChat } = useContext(SelectionContext);
  const [userListOpen, setUserListOpen] = useState(false);

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
        mutate();
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
      <button onClick={() => setUserListOpen(!userListOpen)}>Find User</button>
      {userListOpen &&
        users.map(
          (user: User) =>
            user.email != email &&
            user.email != specEmail && (
              <li onClick={() => chatWithUser(user)}>{user.email}</li>
            ),
        )}
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
