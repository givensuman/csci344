import { getAccessToken } from "./utilities.js";
const rootURL = "https://photo-app-secured.herokuapp.com";
let token = null;
let username = "given";
let password = "password";

const api = async (endpoint, args = {}) =>
  await fetch(rootURL + "/api" + endpoint, {
    headers: { Authorization: `Bearer ${token}` },
    ...args,
  });

const headers = {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
};

async function initializeScreen() {
  if (!token) {
    await getToken().catch((err) => console.error(err));
  }
  showNav();
  getUser();
  getSuggestion();
  getStories();
  getPosts();
}

async function getToken() {
  return await getAccessToken(rootURL, username, password);
}

token = await getToken().catch((err) => console.error(err));

function showNav() {
  document.querySelector("#nav").innerHTML = `
    <nav class="flex justify-between py-5 px-9 bg-white border-b fixed w-full top-0">
            <h1 class="font-Comfortaa font-bold text-2xl">Photo App</h1>
            <ul class="flex gap-4 text-sm items-center justify-center">
                <li><span>${username}</span></li>
                <li><button class="text-blue-700 py-2">Sign out</button></li>
            </ul>
        </nav>
    `;
}

// implement remaining functionality below:
async function getUser() {
  const user = await api(`/profile`).then(async (res) => await res.json());

  if (user) {
    document.querySelector("#user").innerHTML = `
        <img src="${user.thumb_url}" alt="${user.username}" class="rounded-full w-16" />
        <h2 class="font-Comfortaa font-bold text-2xl">${user.username}</h2>

`;
  }
}

async function getSuggestion() {
  const suggestions = await api(`/suggestions`).then(
    async (res) => await res.json()
  );

  const container = document.querySelector("#suggestions");

  suggestions.forEach((suggestion) => {
    const element = document.createElement("section");
    element.className = "flex justify-between items-center mb-4 gap-2";
    element.innerHTML = `
          <img src="${suggestion.thumb_url}" class="rounded-full" />
          <div class="w-[180px]">
            <p class="font-bold text-sm">${suggestion.username}</p>
            <p class="text-gray-500 text-xs">suggested for you</p>
          </div>
          <button class="text-blue-500 text-sm py-2">follow</button>
`;

    container.appendChild(element);
  });
}

async function getStories() {
  const stories = await api(`/stories`).then((res) => res.json());

  const container = document.querySelector("#stories");

  stories.forEach((story) => {
    const element = document.createElement("div");
    element.className = "flex flex-col justify-center items-center";
    element.innerHTML = `
          <img
            src="${story.user.thumb_url}"
            class="rounded-full border-4 border-gray-300"
          />
          <p class="text-xs text-gray-500">${story.user.username}</p>
`;

    container.appendChild(element);
  });
}

async function getPosts() {
  const posts = await api(`/posts?limit=10`).then((res) => res.json());

  const container = document.querySelector("#posts");

  console.log(posts[0]);

  posts.forEach((post) => {
    const element = document.createElement("section");
    element.className = "bg-white border mb-10";
    element.innerHTML = `
          <div class="p-4 flex justify-between">
            <h3 class="text-lg font-Comfortaa font-bold">${
              post.user.username
            }</h3>
            <button class="icon-button">
              <i class="fas fa-ellipsis-h"></i>
            </button>
          </div>
          <img
            src="${post.image_url}"
            alt="${post.alt_text}"
            width="300"
            height="300"
            class="w-full bg-cover"
          />
          <div class="p-4">
            <div class="flex justify-between text-2xl mb-3">
              <div id="button-container">
                <button><i class="far fa-comment"></i></button>
                <button><i class="far fa-paper-plane"></i></button>
              </div>
              <div id="bookmark-container">
              </div>
            </div>
            <p class="font-bold mb-3">${post.likes.length} likes</p>
            <div class="text-sm mb-3">
              <p>
                <strong>${post.user.username}</strong>
                  ${post.caption}
                <button class="button">more</button>
              </p>
            </div>
            ${handlePostComments(post.comments)}
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
`;
    element
      .querySelector("#button-container")
      .appendChild(handleLikeButton(post));

    element
      .querySelector("#bookmark-container")
      .appendChild(handleBookmarkButton(post));

    container.appendChild(element);
  });
}

const handlePostComments = (comments) => {
  if (comments.length === 0) {
    return "";
  }

  if (comments.length > 1) {
    return `
  <button aria-label="Expand Comments" class="text-blue-500 py-2">View all ${comments.length} comments</button>
`;
  }

  const comment = comments[0];

  return `<p class="text-sm mb-3">
      <strong>${comment.user.username}</strong>
      ${comment.text}
    </p>
<p class="uppercase text-gray-500 text-xs">${comment.display_time}</p>`;
};

const handleLikeButton = (post) => {
  const button = document.createElement("button");
  button.onclick = () => handleLike(post);

  if (post.current_user_like_id) {
    button.innerHTML = `<i aria-label = "Like Post" class="far fa-solid fa-heart" style="color: red;">/i>`;
  } else {
    button.innerHTML = `<i aria-label = "Unlike Post" class="far fa-heart"></i>`;
  }

  return button;
};

const handleLike = async (post) => {
  if (!post.current_user_like_id) {
    await fetch(rootURL + `/api/likes/${post.id}`, {
      ...headers,
      method: "POST",
      body: JSON.stringify({
        post_id: post.id,
      }),
    });
  } else {
    await fetch(rootURL + "/api/likes", {
      ...headers,
      method: "DELETE",
    });
  }
};

const handleBookmarkButton = (post) => {
  const button = document.createElement("button");
  button.onclick = () => handleBookmark(post);

  if (post.current_user_bookmark_id) {
    button.innerHTML = `<button aria-label="Unbookmark Post" style="color: black;"><i class="far fa-bookmark fa-solid"></i></button>`;
  } else {
    button.innerHTML = `<button aria-label="Bookmark Post"><i class="far fa-bookmark"></i></button>`;
  }

  return button;
};

const handleBookmark = async (post) => {
  if (!post.current_user_bookmark_id) {
    await fetch(rootURL + `/api/likes/${post.id}`, {
      ...headers,
      method: "POST",
      body: JSON.stringify({
        post_id: post.id,
      }),
    });
  } else {
    await fetch(rootURL + "/api/likes", {
      ...headers,
      method: "DELETE",
    });
  }
};

// after all of the functions are defined, invoke initialize at the bottom:
initializeScreen();
