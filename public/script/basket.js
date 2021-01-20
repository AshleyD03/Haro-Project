// Realy good guide, credit due
// http://www.ashleysheridan.co.uk/blog/Using+Local+Storage+to+Cache+Images

// Stringify data into json string, to then push to storage
function setItem (key, data) {
    try {
        let time = new Date();
        let json = JSON.stringify({time: time, data: data})

        window.localStorage.setItem(key, json)
        return true
    } catch (e) {
        return false
    }
}

// Get json string from storage, and parse back to json
function getItem (key) {
    try {
        let jsonString = window.localStorage.getItem(key);
        let parseData = JSON.parse(jsonString);

        return parseData.data
    } catch (e) {
        return null;
    }
}

// Check time property of all item's in storage. If they have been in storage for more then a week, remove them.
function expireOldItems () {
    let n = window.localStorage.length;
    let now = new Date();
    let maxAge = 1000 * 60 * 60 * 24 * 7 // 7 Days

    for (let i; i < n; i++) {
        let itemKey = window.localStorage.key(i);
        let itemData = window.localStorage.getItem(itemKey)

        try {
            let parseData = JSON.parse(itemData);
            let itemTime = new Date(parseData.time);
            let timeDif = now.valueOf() - itemTime.valueOf();

            if (timeDif > maxAge) window.localStorage.removeItem(itemKey);

        } catch (e) {}
    }
}

// Draw canvas data of image and encode to Data URL to return
function encodeImageToUrl (image) {
    let canvas = document.createElement('canvas');
    canvas.height = image.height;
    canvas.width = image.width;

    let ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);

    let dataUrl = canvas.toDataURL('image/png')
    return dataUrl
}