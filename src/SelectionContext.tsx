import { createContext } from "react";
import type { Chat } from "./components/Chat";

export type SelectionContext = {
  selectedChat: Chat | null;
  setSelectedChat: (chat: Chat) => void;
};

const SelectionContext = createContext<SelectionContext>({
  selectedChat: null,
  setSelectedChat: (chat: Chat) => {},
});

export default SelectionContext;
