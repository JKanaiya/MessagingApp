const Validate = (function () {
  const password = (password: string) => {
    if (password.length < 8) return false;
    return true;
  };

  const email = (email: string) => {
    const regex = new RegExp(/^[\w\-.]+@([\w-]+\.)+[\w-]{2,}$/gm);
    if (!regex.test(email)) return false;
    return true;
  };

  return {
    password,
    email,
  };
})();

export default Validate;
