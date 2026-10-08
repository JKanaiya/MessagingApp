import type { User } from "@supabase/supabase-js";
import axios from "axios";
import { genSalt, hash } from "bcrypt-ts";

const ApiCall = (function () {
  const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: {
      "Content-Type": "application/json", // Common content type
    },
  });

  // Add an interceptor to include the token with every request
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  const signUp = async function (formData: FormData) {
    const result = await api
      .post("sign-up", {
        email: formData.get("email"),
        password: formData.get("password"),
        passwordConfirm: formData.get("passwordConfirm"),
      })
      .catch(function (err) {
        return err.response;
      });
    return result;
  };

  const spectatorSignUp = async function () {
    const now = new Date();
    const specEmail = `spec${Math.floor(Math.random() * 1000)}_${Math.floor(Math.random() * 1000)}_${now.getMinutes()}@fakemail.com`;

    const specPass = `=specPass${now.getDay()}_${now.getMinutes()}=`;

    localStorage.setItem("messaging_app_spec_email", specEmail);
    localStorage.setItem("messaging_app_spec_pass", specPass);

    try {
      const result = await api.post("sign-up", {
        email: specEmail,
        password: specPass,
        passwordConfirm: specPass,
        spectator: true,
      });
      console.log(result);
      return result;
    } catch (err) {
      console.log(err);
    }
  };

  const spectatorLogin = async function () {
    const specEmail = localStorage.getItem("messaging_app_spec_email");
    const specPass = localStorage.getItem("messaging_app_spec_pass");

    const result = await api
      .post("log-in", {
        email: specEmail,
        password: specPass,
        passwordConfirm: specPass,
      })
      .catch(function (err) {
        if (401 == err.response.status) {
          console.log("error logging in" + err);
        }
        return err.response;
      });
    localStorage.setItem("token", result.data.token);

    return result;
  };

  const logOut = function () {
    return api.get("log-out");
  };

  const logIn = async function (formData: FormData) {
    const result = await api
      .post("log-in", {
        email: formData.get("email"),
        password: formData.get("password"),
      })
      .catch(function (err) {
        if (401 == err.response.status) {
          console.log("Unauthorized");
        }
        return err.response;
      });
    return result;
  };

  // const sendMessage = async function(formData: FormData) {
  //   const result = await.api.post("message", {})
  // }

  const setProfileImage = async function (piUrl: string) {
    const email = localStorage.getItem("messaging_app_email");
    const result = await api
      .post("profile-image", {
        email,
        piUrl,
      })
      .catch(function (err) {
        return err.response;
      });
    return result;
  };

  const authCheck = async function () {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const result = fetch(import.meta.env.VITE_BACKEND_URL + "auth-check", {
      method: "GET",
      headers,
    })
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((data) => {
        console.log(data);
        return data;
      })
      .catch((err) => console.error(err));
    console.log(result);
    return result;
  };

  const getUsers = async function () {
    const result = await api.get("users").catch(function (err) {
      return err.response;
    });
    return result.data;
  };

  const createChatroom = async function (user2: User) {
    console.log(user2);
    const result = await api
      .post("chatroom", {
        user2Email: user2.email,
      })
      .catch(function (err) {
        return err.response;
      });
    return result;
  };

  // const chats = await axios
  //   .get(url + "chatrooms", config)
  //   .catch(function (err) {
  //     if (401 == err.response.status) {
  //       console.log("bla");
  //     }
  //     return err.response;
  //   });
  // return chats.data;

  return {
    signUp,
    authCheck,
    logOut,
    logIn,
    setProfileImage,
    spectatorSignUp,
    spectatorLogin,
    getUsers,
    createChatroom,
  };
})();

export default ApiCall;
