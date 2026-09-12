function Profile() {
  return (
    <div>
      <form action={uploadProfileImage}>
        <input type="file" name="uplaoded_file" />
      </form>
    </div>
  );
}

export default Profile;
