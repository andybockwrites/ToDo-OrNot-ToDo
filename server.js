const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

const srvr = express();
const PORT = process.env.PORT || 8000;

srvr.use(express.urlencoded({ extended: true }));
srvr.use(express.json());

srvr.use(express.static('./Develop/public'));

srvr.get('/api/notes', function(req, res) {
    readFileAsync('.Develop/db/db.json', 'utf-8').then(function(data) {
        notes (JSON.parse(data))
    })
});

srvr.post('/api/notes', function(req, res) {
    const note = req.body;
    readFileAsync('./Develop/db/db.json', 'utf-8').then(function(data) {
        const notes = [].concat(JSON.parse(data));
        note.id = notes.length + 1
        notes.push(note);
        return notes
    }).then(function(notes) {
        writeFileAsync('./Develop/db/db.json', JSON.stringifiy(notes))
        res.json(note);
    })
})

srvr.delete('api/notes/:id', function(req, res) {
    const notToDo = parseInt(req.params.id);
    readFileAsync('./Develop/db/db.json', 'utf-8').then(function(data) {
        const notes = [].concat(JSON.parse(data));
        const savedNotes = []
        for (let i = 0; i < notes.length; i ++) {
            if(notToDo !== notes[i].id) {
                savedNotes.push(notes[i])
            }
        }
        return savedNotes
    }).then(function(notes) {
        writeFileAsync('./Develop/db/db.json', JSON.stringify(notes))
        res.send('Saved Successfully!');
    })
});

srvr.get('/notes', function(req, res) {
    res.sendFile(path.join(__dirname, './Develop/public/notes.html'));
});

srvr.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, './Develop/public/index.html'));
});

srvr.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, './Develop/public/index.html'));
});

srvr.listen(PORT, function() {
    console.log('Your server is listening at PORT ' + PORT);
})