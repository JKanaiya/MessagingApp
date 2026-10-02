import type { User } from "@supabase/supabase-js";
import type { Message } from "./Home";
import TextBorder from "./TextBorder";
import type { Chat } from "./Chat";

function TextBox({
  message,
  selectedChat,
  user,
}: {
  message: Message;
  selectedChat: Chat;
  user: User;
}) {
  const messMatch = selectedChat.messages.find((mess) => mess.id == message.id);
  const messIndex = selectedChat.messages.indexOf(messMatch);
  // TODO: Add condition here that checks if the current account is in the "spectators array".
  // smth like, if (chat.users.find((specs) => specs.email == user.email && specs.spectator == true))
  // alignment = mc.id == messsage.userId? "end" : "start"
  // if so, compare the emails in the messages with the "mc" of the messages in the first 2 chatrooms
  // if not, carry on with this logic
  const alignment = user.id == message.userId ? "end" : "start";

  const priorMessage = selectedChat.messages[messIndex - 1];
  if (
    priorMessage != undefined &&
    priorMessage.userId == message.userId &&
    compareDates30mins(priorMessage.timeSent, message.timeSent)
  ) {
    message.topBorder = false;
  } else {
    message.topBorder = true;
  }
  if (selectedChat.messages.length > messIndex) {
    const latterMessage = selectedChat.messages[messIndex + 1];
    if (latterMessage == undefined) {
      message.bottomBorder = true;
    } else {
      if (
        latterMessage.userId == message.userId &&
        compareDates30mins(latterMessage.timeSent, message.timeSent)
      ) {
        message.bottomBorder = false;
      } else {
        message.bottomBorder = true;
      }
    }
  }

  return (
    <div
      style={{
        alignSelf: alignment,
        width: "max(auto, 40%)",
        textAlign: "center",
        textWrap: "pretty",
        display: "flex",
        maxWidth: "70dvw",
        flexDirection: "column",
        background:
          alignment == "start"
            ? "linear-gradient(90deg,  white 70%, green 15%) "
            : "linear-gradient(90deg,  green 15%, white 70%) ",
      }}
    >
      {message.topBorder && (
        <TextBorder alignment={alignment} position={"top"} />
      )}
      <div
        style={{
          padding: "3%",
          paddingLeft: "5%",
          backgroundColor: "white",
          borderRadius: "9px",
          minWidth: "9dvw",
          textWrap: "wrap",
          maxWidth: "40dvw",
        }}
      >
        <p>{message.text}</p>
      </div>
      {message.bottomBorder && (
        <TextBorder
          alignment={alignment}
          position={"bottom"}
          timeSent={message.timeSent}
        />
      )}
    </div>
  );
}

export default TextBox;

const compareDates30mins = (a: string, b: string) => {
  const dateA = new Date(a);
  const dateB = new Date(b);
  // date differential in minutes
  const diff = Math.abs(dateA - dateB) / 60 / 1000;
  return diff <= 30 ? true : false;
};
