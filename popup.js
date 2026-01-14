import { getCurrentTabURL } from "./utils.js";

const addNewBookmark = () => {};

const viewBookmarks = (currentBookmarks=[]) => {
    const bookmarksElement = document.getElementsByClassName("bookmarks")[0];
    bookmarksElement.innerHTML = '';

    if(currentBookmarks.length > 0){

        for(i = 0; i = currentBookmarks.length;i++){
            const bookmark = currentBookmarks[i];
            addNewBookmark(bookmarksElement,bookmark);
        }
        
    }else{
        bookmarksElement.innerHTML = '<div class="title">No bookmarks to display.</div>';
    }
    
};

const onPlay = e => {};

const onDelete = e => {};

const setBookmarkAttributes =  () => {};

document.addEventListener("DOMContentLoaded", async () => {

    const activeTab = await getCurrentTabURL();
    const queryParameters = activeTab.url.split("?")[1];
    const urlParameters = new URLSearchParams(queryParameters);
    const currentVideo =  urlParameters.get("v");

    console.log(currentVideo);

    if(activeTab.url.includes("youtube.com/watch")) {

        chrome.storage.sync.get([currentVideo], (result) => {
           const currentVideoBookmarks = result[currentVideo] ? JSON.parse(result[currentVideo]) : [];

           viewBookmarks(currentVideoBookmarks);
           
        });
        
    }else{
        const container = document.getElementsByClassName("container")[0];
        container.innerHTML = '<div class="title">This is not a YouTube video page.</div>';
    }

});
