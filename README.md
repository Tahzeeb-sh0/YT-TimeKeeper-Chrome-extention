YT TimeKeeper
A Chrome extension that allows you to save timestamps in YouTube videos, creating bookmarks for important moments you want to revisit later.

YT TimeKeeper Logo

Features
📌 Save Timestamps: Click the bookmark button to save the current timestamp in a YouTube video
📚 View Bookmarks: See all your saved timestamps for the current video in an organized popup
▶️ Jump to Bookmarks: Click the play button to jump directly to a bookmarked timestamp
🗑️ Delete Bookmarks: Remove bookmarks you no longer need
💾 Persistent Storage: Your bookmarks are saved locally and persist across browser sessions
🎯 Video-Specific: Bookmarks are saved per video, so you'll only see relevant bookmarks
Installation
Clone this repository:

git clone https://github.com/yourusername/yt-timekeeper.git
Open Chrome and navigate to chrome://extensions/
Enable "Developer mode" in the top right corner
Click "Load unpacked" and select the cloned repository folder
The YT TimeKeeper extension should now appear in your extensions list
Usage
Navigate to any YouTube video
Click the bookmark button (📌) that appears in the video player controls to save the current timestamp
Click the extension icon in your Chrome toolbar to view all saved bookmarks for the current video
Use the play button (▶️) to jump to a specific timestamp
Use the delete button (🗑️) to remove bookmarks
Screenshots
Main Popup Interface
Main Popup Interface

Bookmark Button in YouTube Player
Bookmark Button in YouTube Player

Bookmarks List
Bookmarks List

File Structure

yt-timekeeper/
├── manifest.json         # Extension manifest
├── popup.html            # Popup HTML
├── popup.js              # Popup JavaScript logic
├── popup.css             # Popup styles
├── contentScript.js      # Content script for YouTube pages
├── background.js         # Background service worker
├── utils.js              # Utility functions
└── assets/               # Extension assets
    ├── ext-icon.png      # Extension icon
    ├── bookmark.png      # Bookmark button icon
    ├── play.png          # Play button icon
    ├── delete.png        # Delete button icon
    └── save.png          # Save button icon
How It Works
The extension consists of several components:

Content Script: Injects a bookmark button into YouTube's video player controls and handles bookmark creation
Popup: Displays saved bookmarks for the current video with options to play or delete them
Background Script: Monitors tab updates and communicates between the popup and content script
Storage: Uses Chrome's sync storage to persist bookmarks across sessions
Technical Details
Built with vanilla JavaScript
Uses Chrome Extension Manifest V3
Stores bookmarks using Chrome's sync storage API
Detects video changes in YouTube's SPA (Single Page Application) structure
Formats timestamps in HH:MM:SS format
Contributing
Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

Development
Clone the repository
Make your changes
Load the extension in Chrome using the steps in the Installation section
Test your changes
Submit a Pull Request
License
This project is licensed under the MIT License - see the LICENSE file for details.

Changelog
Version 0.1.0
Initial release
Basic bookmark functionality
Popup interface for viewing bookmarks
Play and delete bookmark options
