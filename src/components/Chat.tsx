import SelectionContext from "../SelectionContext.tsx";
import UserContext from "../UserContext.tsx";
import chatrooms from "../styles/chatrooms.module.css";
import { supabase } from "../supabase.ts";
import { RiCloseFill } from "react-icons/ri";
import { RiSendPlane2Line } from "react-icons/ri";
import chat from "../styles/chat.module.css";
import { socket } from "../socket.ts";
import { useState, useReducer, useContext } from "react";
import TextBox from "./TextBox.tsx";
import type { Message } from "./Home.tsx";
import type { User } from "@supabase/supabase-js";

export type Chat = {
  id: number;
  lastMessage: Message | null;
  userId: number;
  users: User[];
  messages: Message[];
};

function Chat({
  mutate,
  selectedChat,
}: {
  selectedChat: Chat;
  mutate: () => {};
}) {
  const { setSelectedChat } = useContext(SelectionContext);
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  let filtered: User[] = [];
  const { user } = useContext(UserContext);

  const email = localStorage.getItem("messaging_app_email");

  if (selectedChat) {
    filtered = selectedChat.users.filter(
      (user) => user.email != email && user.spectator != true,
    );
    if (filtered.length < 1) {
      filtered = selectedChat.users;
    }

    filtered.map((user: User) => {
      const userImg = supabase.storage
        .from("Profiles")
        .getPublicUrl(user.email + "/" + user.profileImageUrl!);

      user.profileImage = userImg.data.publicUrl;
    });
  }

  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  function onSubmit(event: any) {
    event.preventDefault();
    // setIsLoading(true);
    if (selectedChat) {
      socket.timeout(500).emit(
        "message",
        {
          token: localStorage.getItem("token"),
          email: localStorage.getItem("messaging_app_email"),
          chatroomId: selectedChat.id,
          text: value,
        },
        () => {
          setIsLoading(false);
        },
      );
      mutate();
      forceUpdate();
    }
  }

  return (
    <div
      className={chat.container}
      style={{
        display: window.innerWidth < 800 && !selectedChat ? "none" : "flex",
      }}
    >
      {selectedChat ? (
        <div className={chat.panel}>
          <div className={chat.convo}>
            <button
              onClick={() => setSelectedChat(null)}
              className={chat.close}
            >
              <RiCloseFill />
            </button>
            {filtered.map((user) => (
              <h4 className={chat.convee}>
                <img src={user.profileImage} className={chatrooms.profileImg} />
                <p>{user.name}</p>
              </h4>
            ))}
          </div>
          <div className={chat.box}>
            {selectedChat.messages.map((mess: Message) => (
              <TextBox message={mess} selectedChat={selectedChat} user={user} />
            ))}
          </div>
          {!user.spectator || selectedChat.users.length <= 2 ? (
            <form onSubmit={onSubmit} className={chat.form}>
              <input
                onChange={(e) => setValue(e.target.value)}
                className={chat.input}
                placeholder="Send Message..."
              />

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  // transform: "translate(24px, 0)",
                  borderRadius: "50% 0 0 50%",
                }}
                className={chat.send}
              >
                <RiSendPlane2Line />
              </button>
            </form>
          ) : (
            <h3>Spectating</h3>
          )}
        </div>
      ) : (
        <h1 className={chat.heading}>Select a Chat</h1>
      )}
    </div>
  );
}

export default Chat;
