import { socket } from "../socket.ts";
import { useState } from "react";

function Chat() {
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

    socket.timeout(500).emit(
      "message",
      {
        token: localStorage.getItem("token"),
        email: localStorage.getItem("messaging_app_email"),
        text: value,
        // TODO: add chatroom id here when implementing for this component to "live" in a chatroom
      },
      () => {
        setIsLoading(false);
      },
    );
  }
  return (
    <div>
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
