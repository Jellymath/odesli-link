//taken from https://stackoverflow.com/a/18455088
const copyToClipboard = text => {
    //Create a textbox field where we can insert text to.
    const copyFrom = document.createElement("textarea");

    //Set the text content to be the text you wished to copy.
    copyFrom.textContent = text;

    //Append the textbox field into the body as a child.
    //"execCommand()" only works when there exists selected text, and the text is inside
    //document.body (meaning the text is part of a valid rendered HTML element).
    document.body.appendChild(copyFrom);

    //Select all the text!
    copyFrom.select();

    //Execute command
    document.execCommand('copy');

    //(Optional) De-select the text using blur().
    copyFrom.blur();

    //Remove the textbox field from the document.body, so no other JavaScript nor
    //other elements can get access to this.
    document.body.removeChild(copyFrom);

}

const generateOdesliLink = tabUrl => {
    const regexToLink = (regex, idToLink) => ({regex, idToLink});
    const regexToLinkList = [
        regexToLink(/.*music.yandex.ru\/album\/[0-9]+\/track\/([0-9]+)\/?/, id => `song.link/ya/${id}`),
        regexToLink(/.*music.yandex.ru\/album\/([0-9]+)\/?/, id => `album.link/ya/${id}`),
        // regexToLink(/.*music.youtube.com\/browse\/(.+)/, id => `album.link/y/${id}`),
        regexToLink(/.*music.youtube.com\/playlist\?list=(.+)/, id => `album.link/y/${id}`),
        regexToLink(/.*music.youtube.com\/watch\?v=([^&]+)/, id => `song.link/y/${id}`),
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
