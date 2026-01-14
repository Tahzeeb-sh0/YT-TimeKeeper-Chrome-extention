(() => {

  let youtubeLeftControls, youtubePlayer;
  let currentVideoId = "";
  let currentVideoBookmarks = [];

  chrome.runtime.onMessage.addListener((obj) => {
    const { type, videoId } = obj;

    if (type === "NEW") {
      currentVideoId = videoId;
      newVideoLoaded();
    }
  });


  const fetchBookmarks = async () =>{
    return new Promise((resolve)=>{
        chrome.storage.sync.get([currentVideoId],(obj)=>{
            resolve(obj[currentVideoId] ? JSON.parse(obj[currentVideoId]) : []);
        })
    })
  }

  const newVideoLoaded = async () => {

    const bookmarkBtnExists =
      document.getElementsByClassName("bookmark-btn");

      currentVideoBookmarks = await fetchBookmarks();

    if (bookmarkBtnExists.length > 0) return;

    youtubeLeftControls =
      document.getElementsByClassName("ytp-left-controls")[0];

    youtubePlayer =
      document.getElementsByClassName("video-stream")[0];

    if (!youtubeLeftControls || !youtubePlayer) return;

    const bookmarkBtn = document.createElement("img");
    bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
    bookmarkBtn.className = "bookmark-btn ytp-button";
    bookmarkBtn.title = "Click to bookmark current timestamp";
    bookmarkBtn.style.cursor = "pointer";
   
    bookmarkBtn.style.width = "25px";
    bookmarkBtn.style.height = "25px";
    bookmarkBtn.style.marginTop = "15px";

    youtubeLeftControls.appendChild(bookmarkBtn);

    bookmarkBtn.addEventListener("click",addNewBookmarkEventHandler)
  };

  const addNewBookmarkEventHandler = async () => {
    const currentTime = youtubePlayer.currentTime;
    console.log("add new bookmark", currentTime);

    const newBookMark = {
        time: currentTime,
        dec: "Bookmark at" + getTime(currentTime),
    };

    currentVideoBookmarks = await fetchBookmarks();

    console.log("newBookMark", newBookMark);

    chrome.storage.sync.set({
        [currentVideoId]: JSON.stringify([...currentVideoBookmarks,newBookMark].sort((a,b) => a.time - b.time))
    })
  }

  newVideoLoaded();

})();


const getTime = t =>{
    var date = new Date(0)
    date.setSeconds(t)
    return date.toISOString().substr(11, 8)

}
