import React, { useState, useEffect } from "react";
import { getDataFromServer } from "../server-requests.jsx";

export default function Profile({ token }) {
  const [profile, setProfile] = useState([]);

  async function getProfile() {
    const data = await getDataFromServer(token, "/api/profile");
    console.log(data);
    setProfile(data);
  }

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <header className="flex gap-4 items-center">
      <img src={profile.thumb_url} alt={profile.username} />
      <p>{profile.username}</p>
    </header>
  );
}
