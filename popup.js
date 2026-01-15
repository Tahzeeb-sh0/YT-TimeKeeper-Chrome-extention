import { getCurrentTabURL } from "./utils.js";

/* ---------------- ADD BOOKMARK UI ---------------- */
const addNewBookmark = (bookmarksElement, bookmark) => {
  const bookmarkTitleElement = document.createElement("div");
  const newBookmarkElement = document.createElement("div");
  const controlElement = document.createElement("div");

  bookmarkTitleElement.textContent = bookmark.dec;
  bookmarkTitleElement.className = "bookmark-title";

  controlElement.className = "bookmark-controls";

  newBookmarkElement.id = `bookmark-${bookmark.time}`;
  newBookmarkElement.className = "bookmark";
  newBookmarkElement.dataset.timestamp = bookmark.time;

  setBookmarkAttributes("play", onPlay, controlElement);
  setBookmarkAttributes("delete", onDelete, controlElement);

  newBookmarkElement.appendChild(bookmarkTitleElement);
  newBookmarkElement.appendChild(controlElement);
  bookmarksElement.appendChild(newBookmarkElement);
};

/* ---------------- VIEW ---------------- */
const viewBookmarks = (currentBookmarks = []) => {
  const bookmarksElement = document.querySelector(".bookmarks");
  bookmarksElement.innerHTML = "";

  if (!currentBookmarks.length) {
    bookmarksElement.innerHTML =
      '<div class="title">No bookmarks to display.</div>';
    return;
  }

  currentBookmarks.forEach((bookmark) =>
    addNewBookmark(bookmarksElement, bookmark)
  );
};

/* ---------------- PLAY ---------------- */
const onPlay = async (e) => {
  const bookmarkElement = e.target.closest(".bookmark");
  const bookmarkTime = Number(bookmarkElement.dataset.timestamp);

  const activeTab = await getCurrentTabURL();

  chrome.tabs.sendMessage(activeTab.id, {
    type: "PLAY",
    value: bookmarkTime,
  });
};

/* ---------------- DELETE ---------------- */
const onDelete = async (e) => {
  const bookmarkElement = e.target.closest(".bookmark");
  const bookmarkTime = Number(bookmarkElement.dataset.timestamp);

  const activeTab = await getCurrentTabURL();

  chrome.tabs.sendMessage(
    activeTab.id,
    {
      type: "DELETE",
      value: bookmarkTime,
    },
    (updatedBookmarks) => {
      viewBookmarks(updatedBookmarks);
    }
  );
};

/* ---------------- ICON HELPER ---------------- */
const setBookmarkAttributes = (type, handler, parent) => {
  const control = document.createElement("img");
  control.src = chrome.runtime.getURL(`assets/${type}.png`);
  control.title = type;
  control.addEventListener("click", handler);
  parent.appendChild(control);
};

/* ---------------- INIT ---------------- */
document.addEventListener("DOMContentLoaded", async () => {
  const activeTab = await getCurrentTabURL();

  if (!activeTab.url.includes("youtube.com/watch")) {
    document.querySelector(".container").innerHTML =
      '<div class="title">This is not a YouTube video page.</div>';
    return;
  }

  const url = new URL(activeTab.url);
  const currentVideo = url.searchParams.get("v");

  chrome.storage.sync.get([currentVideo], (result) => {
    const bookmarks = result[currentVideo]
      ? JSON.parse(result[currentVideo])
      : [];
    viewBookmarks(bookmarks);
  });
});
