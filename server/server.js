const express = require('express');
const app = express();
const port = 3002;
// const test = require("./views/test")

// const googleauth = require('./index');

app.set("view engine", "ejs")

app.get('/', (req, res) => {
    console.log("working");
    res.status(200);  
    // res.render("test", {script: test}) 
    res.sendFile(__dirname + '/test.html');
});
app.get('/test.js', (req, res) => {
    console.log("bring");
    
});

app.post('/', (req, res) => {
    console.log("test")
});


app.listen(port)