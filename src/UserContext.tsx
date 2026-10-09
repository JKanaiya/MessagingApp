import type { User } from "@supabase/supabase-js";
import { createContext } from "react";

export type UserContext = {
  user: User | null;
  upsertUser: (user: User) => void;
};

const UserContext = createContext<UserContext>({
  user: null,
  upsertUser: (user: User) => {},
});

export default UserContext;
