const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const url = process.env.URL || 'http://localhost:'


app.use(express.static('public'))

/*

    Currently using basic html pages, to test out page features / build styling.
    Later, they will be turned into handlebar format views, with data pulled from firebase
    and cached.

*/

app.get(['/home/','/home.html'], (req, res) => {
    res.sendFile(path.join(__dirname, 'offline/home.html'))
})
app.get(['/product/','/product.html'], (req, res) => {
    res.sendFile(path.join(__dirname, 'offline/home.html'))
})

app.listen(port, () => {
    console.log(`Server listening at ${url}${port}/home`)
})