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
  const users: Users[] = [];
  const email = localStorage.getItem("messaging_app_email");
  const { isLoggedIn } = useContext(AuthContext);
  const emails: string[] = [];
  const { setSelectedChat, selectedChat } = useContext(SelectionContext);

  if (chats != undefined) {
    chats.forEach((chat) => {
      chat.messages.forEach(async (mess: Message) => {
        if (mess.user.email == email) return;
        if (!emails.includes(mess.user.email)) {
          emails.push(mess.user.email);

          const userImg = supabase.storage
            .from("Profiles")
            .getPublicUrl(mess.user.profileImageUrl!);

          debugger;
          users.push({
            user: mess.user,
            profileImage: userImg.data.publicUrl,
            chatId: mess.chatroomId,
            // lastMessage: chat.mes
          });
        }
      });
      const lastMessage = chat.messages[chat.messages.length - 1].text;

      return {
        chatId: chat.messages.chatroomId,
        user: chat.messages.user,
      };
    });
  }

  const joinChatroom = (chats, user: User) => {
    const chat = chats.filter((chat) => chat.id == user.chatId)[0];
    console.log(chat);
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
      {users.map((user) => (
        <li
          className={chatrooms.chat}
          onClick={() => joinChatroom(chats, user)}
        >
          <img src={user.profileImage} />
          <p>{user.user.name}</p>
        </li>
      ))}
    </div>
  );
}

export default Chatrooms;
