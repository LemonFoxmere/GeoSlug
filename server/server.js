const express = require('express')
const app = express()

app.get('/', (req, res) => {
    console.log("yuh");
    res.status(200);
    res.send("yo lemon");
})

app.listen(3002)