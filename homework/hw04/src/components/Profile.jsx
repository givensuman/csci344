import React from "react";
import { getDataFromServer } from "../server-requests.jsx";

export default function Profile({ token }) {
  return (
    <header className="flex gap-4 items-center">
      <p>Profile Goes Here. Fetch data from /api/profile/ endpoint.</p>
    </header>
  );
}
