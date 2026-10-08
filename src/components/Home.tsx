import Chat from "../components/Chat.tsx";
import axios from "axios";
import useSWR from "swr";
import home from "../styles/home.module.css";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../AuthContext";
import Chatrooms from "./Chatrooms.tsx";
import SelectionContext from "../SelectionContext.tsx";
import { socket } from "../socket.ts";

export type User = {
  email: string;
  id: number;
  name: string;
  profileImageUrl: string;
  profileImage: string | undefined;
  lastMessage: string | undefined;
  spectator: boolean | undefined;
};

export type Users = {
  user: User;
  profileImage: string | null;
  chatId: number;
};

export type Message = {
  id: number;
  user: User;
  chatroomId: number;
  text: string;
  timeSent: string;
  timeUpdated: string | null;
  userId: number;
  topBorder: boolean | undefined;
  bottomBorder: boolean | undefined;
};

function Home() {
  const { isLoggedIn } = useContext(AuthContext);

  const { selectedChat, setSelectedChat } = useContext(SelectionContext);

  const [profileOpen, setProfileOpen] = useState(true);

  const token = localStorage.getItem("token");

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const getChatrooms = async (url: string) => {
    console.log(token);

    const chats = await axios.get(url, config).catch(function (err) {
      if (401 == err.response.status) {
        console.log("bla");
      }
      return err.response;
    });
    return chats.data;
  };

  // const getChatrooms = async (url: string) => {
  //   fetch(url + "chatrooms", {
  //     method: "GET",
  //     headers: new Headers({ Authorization: `Bearer ${token}` }),
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log(data);
  //       return data;
  //     })
  //     .catch((err) => console.error(err));
  // };

  const {
    data,
    error,
    mutate,
    isLoading: loading,
  } = useSWR(import.meta.env.VITE_BACKEND_URL + "chatrooms", getChatrooms);

  // useEffect(() => {
  //   console.log(error);
  //   console.log(data);
  //
  //   return () => {
  //     return;
  //   };
  // }, [error, data]);
  if (error) {
    console.log(error);
  }

  socket.on("receive-message", () => {
    mutate();
  });

  // if (loading) return <h2>Loading</h2>;
  // if (error) return <h2>Error</h2>;

  const email = localStorage.getItem("messaging_app_email");
  const specEmail = localStorage.getItem("messaging_app_spec_email");

  // const obtainUser = async () => {
  //   let user;
  //   // mutate();
  //   if (!loading && data != undefined && Array.isArray(data.users)) {
  //     if (specEmail) {
  //       user = data.users.find((user: User) => user.email == specEmail);
  //     } else {
  //       user = data.users.find((user: User) => user.email == email);
  //     }
  //   }
  //   if (user == undefined) {
  //     await mutate()
  //       .then((val) => val)
  //       .then((val) => {
  //         user = val.users;
  //         debugger;
  //         console.log(user);
  //         return user;
  //       })
  //       .catch((err) => false);
  //   }
  //   return user;
  // };

  // const user = obtainUser();
  const findUser = () => {
    let b;

    if (data) {
      b = specEmail
        ? data.users.find((user: User) => user.email == specEmail)
        : data.users.find((user: User) => user.email == email);
    } else {
      return "bla";
    }
    if (!b) {
      // const users = await axios
      //   .get(import.meta.env.VITE_BACKEND_URL + "users", config)
      //   .catch(function (err) {
      //     if (401 == err.response.status) {
      //       console.log("bla");
      //     }
      //     return err.response;
      //   });
      let users;
      let user;
      fetch(import.meta.env.VITE_BACKEND_URL + "users", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((data) => data.json())
        .then((json) => {
          users = json;
          return json;
        })
        .then((users) => {
          user = specEmail
            ? users.find((u: User) => u.email == specEmail)
            : users.find((u: User) => u.email == email);
        })
        .catch((err) => console.error(err));

      console.log(users);

      mutate(
        {
          ...data.chatrooms,
          users: [...data.users, user],
        },
        { revalidate: true },
      );
      return user;
    } else {
      return b;
    }
  };
  console.log(findUser());
  const user = findUser();

  // debugger;
  // debugger;
  // data &&
  // (Array.isArray(data.users) && specEmail
  //   ? data.users.find((user: User) => {
  //       return user.email == specEmail;
  //     })
  //   : data.users.find((user: User) => {
  //       return user.email == email;
  //     }));

  // TODO: what need is there for user this high in the hierarchy? why does it need to be tied to the first swr? cant i use a different swr for users? cant i do this lower in the stack?

  return (
    <>
      {!loading && data && (
        <div className={home.home}>
          {
            <Chatrooms
              chats={data.chatrooms}
              users={data.users}
              user={user}
              profileOpen={profileOpen}
              mutate={mutate}
              setProfileOpen={setProfileOpen}
            />
          }
          {
            <Chat
              user={user}
              mutate={mutate}
              selectedChat={
                selectedChat
                  ? data.chatrooms.find((chat) => chat.id == selectedChat.id)
                  : selectedChat
              }
            />
          }
        </div>
      )}
    </>
  );
}

export default Home;
