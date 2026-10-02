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
    const specEmail = `spec${now.getDay()}_${now.getMinutes()}`;

    const salt = await genSalt(10);
    const specPass = await hash(
      `=specPass${now.getDay}_${now.getMinutes()}}=`,
      salt,
    );

    localStorage.setItem("message_app_spec_email", specEmail);
    localStorage.setItem("message_app_spec_pass", specPass);

    const result = await api.post("sign-up", {
      email: specEmail,
      password: specPass,
      passwordConfirm: specPass,
      spectator: true,
    });
    return result;
  };

  const spectatorLogin = async function () {
    const specEmail = localStorage.getItem("message_app_spec_email");
    const specPass = localStorage.getItem("message_app_spec_pass");

    if (specEmail && specPass) {
      const result = await api
        .post("log-in", {
          email: specEmail,
          password: specPass,
        })
        .catch(function (err) {
          if (401 == err.response.status) {
            console.log("error logging in" + err);
          }
          return err.response;
        });
      return result;
    } else {
      spectatorSignUp();
    }
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
          console.log("bla");
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
    const result = await api.post("auth-check").catch(function (err) {
      return err.response;
    });
    return result;
  };

  return {
    signUp,
    authCheck,
    logOut,
    logIn,
    setProfileImage,
    spectatorSignUp,
    spectatorLogin,
  };
})();

export default ApiCall;
