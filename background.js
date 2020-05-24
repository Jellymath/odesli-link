// taken from https://stackoverflow.com/a/18455088
const copyToClipboard = text => {
    // Create a textbox field where we can insert text to.
    const copyFrom = document.createElement("textarea");

    // Set the text content to be the text you wished to copy.
    copyFrom.textContent = text;

    // Append the textbox field into the body as a child.
    // "execCommand()" only works when there exists selected text, and the text is inside
    // document.body (meaning the text is part of a valid rendered HTML element).
    document.body.appendChild(copyFrom);

    // Select all the text!
    copyFrom.select();

    // Execute command
    document.execCommand('copy');

    // (Optional) De-select the text using blur().
    copyFrom.blur();

    // Remove the textbox field from the document.body, so no other JavaScript nor
    // other elements can get access to this.
    document.body.removeChild(copyFrom);

}

const regexToLink = (regex, idToLink) => ({regex, idToLink});

/**
 * @param {string} tabUrl
 * @returns {string | undefined} Odesli link if it can be derived from url or undefined otherwise
 */
const generateOdesliLink = tabUrl => {
    const regexToLinkList = [
        regexToLink(/.*music.yandex.ru\/album\/[0-9]+\/track\/([0-9]+)/, id => `song.link/ya/${id}`),
        regexToLink(/.*music.yandex.ru\/album\/([0-9]+)/, id => `album.link/ya/${id}`),

        // doesn't work at the moment (both quick link and sending it to the api)
        // regexToLink(/.*music.youtube.com\/browse\/(.+)/, id => `album.link/y/${id}`),
        regexToLink(/.*music.youtube.com\/playlist\?list=(.+)/, id => `album.link/y/${id}`),
        regexToLink(/.*music.youtube.com\/watch\?v=([^&]+)/, id => `song.link/y/${id}`),

        regexToLink(/.*deezer.com\/[a-z]{2,4}\/album\/([0-9]+)/, id => `album.link/d/${id}`),
        regexToLink(/.*deezer.com\/[a-z]{2,4}\/track\/([0-9]+)/, id => `song.link/d/${id}`),

        regexToLink(/.*play.google.com\/music\/listen#\/album\/([^\/]+)/, id => `album.link/g/${id}`),
        // pretty hard to obtain link in the moment via extension, but added to be consistent
        regexToLink(/.*play.google.com\/music\/listen#\/track\/([^\/]+)/, id => `song.link/g/${id}`),

        regexToLink(/.*open.spotify.com\/album\/(?:[^?]+)\?highlight=spotify:track:([^&]+)/, id => `song.link/s/${id}`),
        regexToLink(/.*open.spotify.com\/album\/([^?]+)/, id => `album.link/s/${id}`),
        // pretty hard to obtain link in the moment via extension, but added to be consistent
        regexToLink(/.*open.spotify.com\/track\/([^?]+)/, id => `song.link/s/${id}`)

    ];

    let result;
    for (let regexToLink of regexToLinkList) {
        const match = tabUrl.match(regexToLink.regex);
        if (match) {
            result = regexToLink.idToLink(match[1]);
            break;
        }
    }
    return result;
}

const copyAndPrint = text => {
    copyToClipboard(text);
    console.log(text);
}

chrome.browserAction.onClicked.addListener(tab => {
    const currentPage = tab.url;
    let returnUrl = generateOdesliLink(currentPage);
    if (returnUrl) {
        copyAndPrint(returnUrl);
    } else {
        const escaped = encodeURIComponent(currentPage);
        fetch(`https://api.song.link/v1-alpha.1/links?url=${escaped}`)
            .then(response => response.json())
            .then(data => data.pageUrl)
            .then(copyAndPrint);
    }
});
