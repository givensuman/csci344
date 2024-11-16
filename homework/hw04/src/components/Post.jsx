import React from "react";
import BookmarkButton from "./BookmarkButton";

export default function Post({ token, post, ...props }) {
  console.log(post);
  return (
    <>
      <div class="p-4 flex justify-between">
        <h3 class="text-lg font-Comfortaa font-bold">{post.user.username}</h3>
        <button class="icon-button">
          <i class="fas fa-ellipsis-h"></i>
        </button>
      </div>
      <img
        src={post.image_url}
        alt={post.alt_text}
        width="300"
        height="300"
        class="w-full bg-cover"
      />
      <div class="p-4">
        <div class="flex justify-between text-2xl mb-3">
          <div class="space-x-4">
            <button>
              <i class="far fa-comment"></i>
            </button>
            <button>
              <i class="far fa-paper-plane"></i>
            </button>
          </div>
          <div>
            <BookmarkButton token={token} post={post} />
          </div>
        </div>
        <p class="font-bold mb-3">{post.likes.length} likes</p>
        <div class="text-sm mb-3">
          <p>
            <strong>{post.user.username}</strong>
            {post.caption}
            <button class="button">more</button>
          </p>
        </div>
      </div>
      <div class="flex justify-between items-center p-3">
        <div class="flex items-center gap-3 min-w-[80%]">
          <i class="far fa-smile text-lg"></i>
          <input
            type="text"
            class="min-w-[80%] focus:outline-none"
            placeholder="Add a comment..."
          />
        </div>
        <button class="text-blue-500 py-2">Post</button>
      </div>
    </>
  );
}
