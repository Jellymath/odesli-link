# odesli-link
Chrome Extension to generate Odesli link (song.link/album.link) for the current tab

## How to install
Extension is not available via Chrome Web Store (or other stores) at the moment.
However, it can be installed manually.
1. Download the source code
2. Go to browser extensions page (chrome://extensions/, brave://extensions/ etc)
3. Turn on Developer Mode
4. Select "Load Unpacked"
5. Choose the source code folder

## How to use 
Click on Odesli icon. Generated Odesli link will be copied to the clipboard.

## How does it work
For selection of music platforms extension will generate a link by itself based on the active tab url.
For other music platforms extension will delegate link generation to Odesli API.

## Supported platforms
Note: List does not include all possible music platforms.
Some of them can be supported by Odesli API (you can check supported platforms [here](https://www.notion.so/Supported-Platforms-d7d206c34b8d40039930b98c91e44de0))

Legend:

✔ - Quick link generation supported

👌 - Link generation supported by Odesli API (can be a bit slow)

❔ - No known way to have the related page url 
 

| Platform          | Song | Album |
| ----------------- | ---- | ----- |
| Spotify           | ✔*   | ✔     |
| YouTube (videos)  | ✔    | ✔     |
| YouTube Music     | ✔    | ✔     |
| Google Play Music | ❔    | ✔     |
| Deezer            | ✔    | ✔     |
| SoundCloud        | 👌    | 👌    |
| Yandex.Music      | ✔    | ✔    |

