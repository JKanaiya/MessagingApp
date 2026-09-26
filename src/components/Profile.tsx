import { useState } from "react";
import ApiCall from "../apiCalls.ts";
import { supabase } from "../supabase.ts";
import type { User } from "./Home.tsx";

function Profile({ user }) {
  const [file, setFile] = useState<null | File>(null);
  const email = localStorage.getItem("messaging_app_email");

  const handleChange = async (e) => {
    const now = new Date();
    const newProfileImageUrl = now.toISOString();

    setFile(e.target.files[0]);
    const { data, error } = await supabase.storage
      .from("Profiles")
      .remove([`${email}/${user.user.profileImageUrl}`]);

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
    .getPublicUrl(email + "/" + user.user.profileImageUrl!);

  return (
    <div>
      <img src={userImg.data.publicUrl} />
      <input type="file" name="uplaoded_file" onChange={handleChange} />
    </div>
  );
}

export default Profile;
