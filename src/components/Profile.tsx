import { useState, useContext } from "react";
import { FiEdit2 } from "react-icons/fi";
import UserContext from "../UserContext.tsx";
import profile from "../styles/profile.module.css";
import { useNavigate } from "react-router";
import AuthContext from "../AuthContext.tsx";
import ApiCall from "../apiCalls.ts";
import { supabase } from "../supabase.ts";

function Profile() {
  const [file, setFile] = useState<null | File>(null);
  const specEmail = localStorage.getItem("messaging_app_spec_email");
  const email = specEmail
    ? specEmail
    : localStorage.getItem("messaging_app_email");
  const { user, upsertUser } = useContext(UserContext);

  const nav = useNavigate();
  const { logout } = useContext(AuthContext);

  const logOut = () => {
    logout();
    nav("/");
  };

  const updateName = async (formData: FormData) => {
    const response = await ApiCall.updateUserName(formData);

    if (response.status != 200) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    } else {
      const updatedUser = { ...user, name: formData.get("newName") };

      upsertUser(updatedUser);
    }
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
      const updatedUser = { ...user, profileImageUrl: newProfileImageUrl };
      error ? console.log("Err" + error) : upsertUser(updatedUser);
      console.log(data);
    }
  };
  const userImg = supabase.storage
    .from("Profiles")
    .getPublicUrl(email + "/" + user.profileImageUrl!);

  return (
    <div className={profile.container}>
      <form className={profile.image} action={updateName}>
        <label htmlFor="upload file">
          <div
            className={profile.editImage}
            style={{ backgroundImage: `url(${userImg.data.publicUrl})` }}
          >
            {/* <img src={userImg.data.publicUrl} style={{ borderRadius: "50%" }} /> */}
            <FiEdit2 />
          </div>
        </label>
        <input
          id="upload file"
          type="file"
          name="uplaoded_file"
          onChange={handleChange}
          placeholder=""
          style={{ display: "none" }}
        />
        <input placeholder={user.name} name="newName" />
        <button type="submit">Update Name</button>
      </form>
      <button onClick={logOut}>LogOut</button>
    </div>
  );
}

export default Profile;
