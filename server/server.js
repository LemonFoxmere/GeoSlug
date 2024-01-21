const express = require('express');
const app = express();
const port = 3002;

// const googleauth = require('./index');

app.set("view engine", "ejs")

app.get('/', (req, res) => {
    console.log("yuh");
    res.status(200);
    res.render("test")
});

app.post('/', (req, res) => {
    console.log
});

app.listen(port)