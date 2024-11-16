import React from "react";

export default function LikeButton({ ...props }) {
  const [isLiked, setIsLiked] = useState(false);

  const className = isLiked ? "far fa-solid fa-heart" : "far fa-solid";
  const ariaLabel = isLiked ? "Unlike Post" : "Like Post";
  return <i ariaLabel={ariaLabel} className={className}></i>;
}
