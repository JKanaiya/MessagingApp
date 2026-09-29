import ApiCall from "../apiCalls.ts";

import chat from "../styles/chat.module.css";
import { socket } from "../socket.ts";
import { useState, useEffect, useReducer } from "react";
import TextBox from "./TextBox.tsx";

function Chat({ data, mutate, selectedChat, user }) {
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  function onSubmit(event) {
    event.preventDefault();
    // setIsLoading(true);
    //
    if (selectedChat) {
      socket.timeout(500).emit(
        "message",
        {
          token: localStorage.getItem("token"),
          email: localStorage.getItem("messaging_app_email"),
          chatroomId: data.id,
          text: value,
          // TODO: add chatroom id here when implementing for this component to "live" in a chatroom
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
    <div className={chat.container}>
      {selectedChat ? (
        <div className={chat.box}>
          {data &&
            data.messages.map((mess) => (
              <TextBox message={mess} selectedChat={selectedChat} user={user} />
            ))}
          <form onSubmit={onSubmit}>
            <input onChange={(e) => setValue(e.target.value)} />

            <button type="submit" disabled={isLoading}>
              Submit
            </button>
          </form>
        </div>
      ) : (
        <h1 className={chat.heading}>Select a Chat</h1>
      )}
    </div>
  );
}

export default Chat;
