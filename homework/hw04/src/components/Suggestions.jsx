import React, { useState, useEffect } from "react";

import { getDataFromServer } from "../server-requests";

export default function Suggestions({ token }) {
  const [suggestions, setSuggestions] = useState([]);

  async function getSuggestions() {
    const data = await getDataFromServer(token, "/api/suggestions");
    console.log(data);
    setSuggestions(data);
  }

  useEffect(() => {
    getSuggestions();
  }, []);

  return (
    <div className="mt-4">
      <p className="text-base text-gray-400 font-bold mb-4">
        Suggestions for you
      </p>

      {suggestions.map((suggestion, i) => (
        <section
          key={i}
          className="flex justify-between items-center mb-4 gap-2"
        >
          <img
            src={suggestion.thumb_url}
            alt={suggestion.first_name}
            className="rounded-full"
          />
          <div className="w-[180px]">
            <p className="font-bold text-sm">{suggestion.username}</p>
            <p className="text-gray-500 text-xs">suggested for you</p>
          </div>
          <button className="text-blue-500 text-sm py-2">follow</button>
        </section>
      ))}
    </div>
  );
}
