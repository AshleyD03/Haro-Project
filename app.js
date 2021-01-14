const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const url = process.env.URL || 'http://localhost:'


app.use('/public', express.static('public'))

app.get('/home/', (req, res) => {
    res.sendFile(path.join(__dirname, 'offline/home.html'))
})

app.listen(port, () => {
    console.log(`Server listening at ${url}${port}/home`)
})