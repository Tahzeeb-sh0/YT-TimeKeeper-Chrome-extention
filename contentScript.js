(() => {
  let youtubeLeftControls;
  let youtubePlayer;

  let currentVideoId = "";
  let lastVideoId = "";
  let currentVideoBookmarks = [];

  /* =====================================================
     VIDEO CHANGE DETECTOR (YouTube SPA)
  ===================================================== */
  setInterval(() => {
    const url = new URL(window.location.href);
    const videoId = url.searchParams.get("v");

    if (videoId && videoId !== lastVideoId) {
      lastVideoId = videoId;
      currentVideoId = videoId;
      newVideoLoaded();
    }
  }, 1000);

  /* =====================================================
     MESSAGE LISTENER (FROM POPUP)
  ===================================================== */
  chrome.runtime.onMessage.addListener((obj, sender, sendResponse) => {
    const { type, value, videoId } = obj;

    if (videoId) {
      currentVideoId = videoId;
    }

    switch (type) {
      case "PLAY":
        if (youtubePlayer) {
          youtubePlayer.currentTime = Number(value);
        }
        break;

      case "DELETE":
        if (!currentVideoId) return;

        currentVideoBookmarks = currentVideoBookmarks.filter(
          (b) => b.time !== Number(value)
        );

        chrome.storage.sync.set({
          [currentVideoId]: JSON.stringify(currentVideoBookmarks),
        });

        sendResponse(currentVideoBookmarks);
        break;
    }

    return true; // keep sendResponse alive
  });

  /* =====================================================
     STORAGE
  ===================================================== */
  const fetchBookmarks = () => {
    return new Promise((resolve) => {
      chrome.storage.sync.get([currentVideoId], (obj) => {
        resolve(obj[currentVideoId] ? JSON.parse(obj[currentVideoId]) : []);
      });
    });
  };

  /* =====================================================
     VIDEO LOAD HANDLER
  ===================================================== */
  const newVideoLoaded = async () => {
    // Remove old button (SPA-safe)
    const oldBtn = document.querySelector(".bookmark-btn");
    if (oldBtn) oldBtn.remove();

    youtubeLeftControls = document.querySelector(".ytp-left-controls");
    youtubePlayer = document.querySelector(".video-stream");

    if (!youtubeLeftControls || !youtubePlayer) {
      setTimeout(newVideoLoaded, 500);
      return;
    }

    currentVideoBookmarks = await fetchBookmarks();

    const bookmarkBtn = document.createElement("img");
    bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
    bookmarkBtn.className = "bookmark-btn ytp-button";
    bookmarkBtn.title = "Bookmark current timestamp";

    // Minimal inline styling (safe for YT)
    bookmarkBtn.style.cursor = "pointer";
    bookmarkBtn.style.width = "24px";
    bookmarkBtn.style.height = "24px";
    bookmarkBtn.style.marginTop = "15px";

    youtubeLeftControls.appendChild(bookmarkBtn);
    bookmarkBtn.addEventListener("click", addNewBookmark);

    bookmarkBtn.addEventListener("click", () => {
      alert("Bookmark added!");
    });
  };

  /* =====================================================
     ADD BOOKMARK
  ===================================================== */
  const addNewBookmark = async () => {
    if (!youtubePlayer || !currentVideoId) return;

    const currentTime = Math.floor(youtubePlayer.currentTime);

    // Prevent duplicate timestamps
    if (
      currentVideoBookmarks.some(
        (b) => Math.floor(b.time) === currentTime
      )
    ) {
      return;
    }

    const newBookmark = {
      time: currentTime,
      dec: `Bookmark at ${getTime(currentTime)}`,
    };

    currentVideoBookmarks = [...currentVideoBookmarks, newBookmark].sort(
      (a, b) => a.time - b.time
    );

    chrome.storage.sync.set({
      [currentVideoId]: JSON.stringify(currentVideoBookmarks),
    });
  };

  /* =====================================================
     INITIAL LOAD
  ===================================================== */
  newVideoLoaded();
})();

/* =====================================================
   TIME FORMATTER
===================================================== */
const getTime = (t) => {
  const date = new Date(0);
  date.setSeconds(t);
  return date.toISOString().substr(11, 8);
};
