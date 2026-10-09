import { useState, useContext } from "react";
import UserContext from "../UserContext.tsx";
import profile from "../styles/profile.module.css";
import { useNavigate } from "react-router";
import AuthContext from "../AuthContext.tsx";
import ApiCall from "../apiCalls.ts";
import { supabase } from "../supabase.ts";

function Profile() {
  const [file, setFile] = useState<null | File>(null);
  const email = localStorage.getItem("messaging_app_email");
  const { user } = useContext(UserContext);

  const nav = useNavigate();
  const { logout } = useContext(AuthContext);

  const logOut = () => {
    logout();
    nav("/");
  };

  const handleChange = async (e) => {
    const now = new Date();
    const newProfileImageUrl = now.toISOString();

    setFile(e.target.files[0]);
    const { data, error } = await supabase.storage
      .from("Profiles")
      .remove([`${email}/${user.profileImageUrl}`]);

    error ? console.log("Err" + error) : console.log("Data" + data);

    const response = await ApiCall.setProfileImage(`${newProfileImageUrl}`);

    if (response.status != 200) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    } else {
      const { data, error } = await supabase.storage
        .from("Profiles")
        .upload(`${email}/${newProfileImageUrl}`, file, {
          contentType: "image/png",
        });
      error ? console.log("Err" + error) : console.log("Data" + data);
    }
  };
  const userImg = supabase.storage
    .from("Profiles")
    .getPublicUrl(email + "/" + user.profileImageUrl!);

  return (
    <div className={profile.container}>
      <div className={profile.image}>
        <img src={userImg.data.publicUrl} style={{ borderRadius: "50%" }} />
        <input
          type="file"
          name="uplaoded_file"
          onChange={handleChange}
          placeholder=""
        />
      </div>
      <button onClick={logOut}>LogOut</button>
    </div>
  );
}

export default Profile;
