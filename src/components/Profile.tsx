import { useState } from "react";
import ApiCall from "../apiCalls.ts";
import { supabase } from "../supabase.ts";
import type { User } from "./Home.tsx";

function Profile({ user }) {
  const [file, setFile] = useState<null | File>(null);
  const email = localStorage.getItem("messaging_app_email");

  const handleChange = async (e) => {
    const now = new Date();
    const newProfileImageUrl = user.user.email + "" + now.toISOString();

    setFile(e.target.files[0]);
    const { data, error } = await supabase.storage
      .from("Profiles")
      .remove([`${email}/${user.user.profileImageUrl}`]);

    error ? console.log(error) : console.log(data);

    const response = await ApiCall.setProfileImage(newProfileImageUrl);

    if (!response.status == 200) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    } else {
      const { data, error } = await supabase.storage
        .from("Profiles")
        .upload(`${email}/${newProfileImageUrl}`, file, {
          cacheControl: "0",
          contentType: "image/png",
        });
      console.log(`${email}/image.png`);
      error ? console.log(error) : console.log(data);
    }
  };
  console.log(user.user.profileImageUrl);

  return (
    <div>
      <input type="file" name="uplaoded_file" onChange={handleChange} />
    </div>
  );
}

export default Profile;
