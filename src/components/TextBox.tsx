import type { User } from "@supabase/supabase-js";
import type { Message } from "./Home";
import text from "../styles/textbox.module.css";
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
  const specEmail = localStorage.getItem("messaging_app_spec_email");

  const mc = selectedChat.users.find(
    (mess) => mess.email == "bla1@fakemail.com",
  );
  const alignment = specEmail
    ? mc.id == message.userId
      ? "end"
      : "start"
    : user.id == message.userId
      ? "end"
      : "start";

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
            ? "linear-gradient(90deg,  oklch(0.2601 0 0) 70%, oklch(0.1589 0.0785 12.71) 15%) "
            : "linear-gradient(90deg,  oklch(0.1589 0.0785 12.71) 15%, oklch(0.2601 0 0) 70%) ",
      }}
    >
      {message.topBorder && (
        <TextBorder alignment={alignment} position={"top"} />
      )}
      <div className={text.container}>
        <p className={text.text}>{message.text}</p>
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
