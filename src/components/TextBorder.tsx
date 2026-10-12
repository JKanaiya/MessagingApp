import text from "../styles/textbox.module.css";
const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
function TextBorder({
  alignment,
  position,
  timeSent,
}: {
  alignment: string;
  position: string;
  timeSent: undefined | string;
}) {
  const timeDateSent = new Date(timeSent);

  const bradius = () => {
    if (position == "top") {
      if (alignment == "start") {
        return "0 0 0 20px";
      } else {
        return "0 0 20px 0";
      }
    } else {
      if (alignment == "start") {
        return "20px 0 0 0";
      } else {
        return "0 20px 0 0";
      }
    }
  };

  const borderStyle = {
    borderRadius: bradius(),
    backgroundColor: "oklch(0.1487 0.0227 8.2)",
    justifyContent: alignment == "start" ? "start" : "end",
  };

  return (
    <span style={borderStyle} className={text.border}>
      {timeSent && (
        <p style={{ fontSize: "0.8rem", fontStyle: "italic" }}>
          {timeDateSent.getHours()} : {timeDateSent.getMinutes()}
        </p>
      )}
    </span>
  );
}

export default TextBorder;
