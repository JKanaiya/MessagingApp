import { useState } from "react";
import ApiCall from "../apiCalls.ts";
import { supabase } from "../supabase.ts";

function Profile() {
  const [file, setFile] = useState<null | File>(null);
  const email = localStorage.getItem("messaging_app_email");

  const handleChange = async (e) => {
    setFile(e.target.files[0]);
    console.log(file);
    const { data, error } = await supabase.storage
      .from("Profiles")
      .update(`${email}/image.png`, file, {
        cacheControl: "3000",
        upsert: true,
        contentType: "image/png",
      });
    error ? console.log(error) : console.log(data);
  };

  return (
    <div>
      <input type="file" name="uplaoded_file" onChange={handleChange} />
    </div>
  );
}

export default Profile;
