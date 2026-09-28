import { useContext, useEffect } from "react";
import chatrooms from "../styles/chatrooms.module.css";
import { supabase } from "../supabase.ts";
import type { Message, Users, User } from "./Home";
import AuthContext from "../AuthContext";
import SelectionContext from "../SelectionContext";
import { socket } from "../socket";

export type ChatRoom = {
  messages: Message[];
  id: number;
  userid: number;
};

function Chatrooms({ chats }) {
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

  const joinChatroom = (chat) => {
    socket.timeout(500).emit("join chat", chat);
    setSelectedChat(chat);
  };

  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, [isLoggedIn]);

  // TODO: Base the mapping here off of the chats array, take the users array per chat and filter out the current user. List the chatrooms using that array, and point to their names
  return (
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
  );
}

export default Chatrooms;
