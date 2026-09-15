import axios from "axios";

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

  const uploadProfileImage = async function (formData: FormData) {
    const result = await api
      .post("profile-image", {
        file: formData.get("file"),
      })
      .catch(function (err) {
        return err.response;
      });
    return result;
  };

  return {
    signUp,
    logOut,
    logIn,
    uploadProfileImage,
  };
})();

export default ApiCall;
