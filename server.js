const express = require('express');
const path = require('path');
const utils = require('util');
const app = express();
const fs = require('fs');
const PORT = process.env.PORT || 3000;
const db = require('./db/db.json');
const uniqid = require('uniqid');
let currentId = 0;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.listen(PORT, function() {
    console.log(`Listening on port: ${PORT}`);
})

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, "/public/notes.html")));

app.get("/api/notes", (req, res) => {
    res.json(db);
});

app.post("/api/notes", (req, res) => {
    let temp = db;
    let tempitem = req.body;
    tempitem.id = uniqid();
    temp.push(tempitem);
    fs.writeFile("./db/db.json", JSON.stringify(temp), (err) => {console.log(err)});

    res.json(req.body);
});

app.delete("/api/notes/:id", (req, res) => {
    const chosen = req.params.id;
    let temp = db;
    for(let i=0; i < temp.length; i++){
        if(chosen == temp[i].id){
            temp.splice(i, 1);
            console.log(temp);
            fs.writeFile("./db/db.json", JSON.stringify(temp), (err) => {console.log(err)});
            res.json(temp[i]);
        }
    }
});