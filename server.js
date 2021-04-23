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

//displays index.html when the default page is requested
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

//displays notes.html when the notes page is requested
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, "/public/notes.html")));

//displays the currently saved json object to the screen when requested
app.get("/api/notes", (req, res) => {
    res.json(db);
});

//creates temporary version of the database and the item to store in it, assigns the new item a unique id to reference when deleting, pushes the new item on to the current array, and writes the new database to the db file
app.post("/api/notes", (req, res) => {
    let temp = db;
    let tempitem = req.body;
    tempitem.id = uniqid();
    temp.push(tempitem);
    fs.writeFile("./db/db.json", JSON.stringify(temp), (err) => {console.log(err)});

    res.json(req.body);
});

//deletes an item from the database based on its unique id, searches the current db to find a matching id, splices the selected item from the database, and writes the new array to the db file
app.delete("/api/notes/:id", (req, res) => {
    const chosen = req.params.id;
    let temp = db;
    for(let i=0; i < temp.length; i++){
        if(chosen == temp[i].id){
            temp.splice(i, 1);
            //console.log(temp);
            fs.writeFile("./db/db.json", JSON.stringify(temp), (err) => {console.log(err)});
            res.json(temp[i]);
        }
    }
});