import React, { useState } from "react";
import { deleteDataFromServer, postDataToServer } from "../server-requests";

export default function BookmarkButton({ post, token, ...props }) {
  const [isBookmarked, setIsBookmarked] = useState(
    post.current_user_bookmark_id,
  );

  const ariaLabel = isBookmarked ? "Unbookmark Post" : "Bookmark Post";
  const className = isBookmarked
    ? "far fa-bookmark fa-solid"
    : "far fa-bookmark";

  const handleBookmark = async () => {
    if (isBookmarked) {
      await deleteDataFromServer(token, `/api/bookmarks/${post.id}`).then(() =>
        setIsBookmarked(false),
      );

      return;
    }

    await postDataToServer(token, "/api/bookmarks", {
      post_id: post.id,
    }).then(() => setIsBookmarked(true));
  };

  return (
    <button aria-label={ariaLabel} onClick={handleBookmark}>
      <i className={className}></i>
    </button>
  );
}
