import { useContext, useEffect } from "react";
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
      chat.messages.forEach((mess: Message) => {
        if (mess.user.email == email) return;
        if (!emails.includes(mess.user.email)) {
          emails.push(mess.user.email);
          users.push({
            user: mess.user,
            chatId: mess.chatroomId,
          });
        }
      });

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

  //
  return (
    <div>
      {users.map((user) => (
        <li>
          <button onClick={() => joinChatroom(chats, user)}>
            <p>{user.user.name}</p>
          </button>
        </li>
      ))}
    </div>
  );
}

export default Chatrooms;
