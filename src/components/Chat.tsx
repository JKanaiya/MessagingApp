import ApiCall from "../apiCalls.ts";
import { socket } from "../socket.ts";
import { useState, useEffect, useReducer } from "react";

function Chat({ data, mutate }) {
  console.log(data);
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  function onSubmit(event) {
    event.preventDefault();
    // setIsLoading(true);
    //
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

  useEffect(() => {}, []);

  return (
    <div>
      {data && data.messages.map((mess) => <p>{mess.text}</p>)}
      <form onSubmit={onSubmit}>
        <input onChange={(e) => setValue(e.target.value)} />

        <button type="submit" disabled={isLoading}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default Chat;
