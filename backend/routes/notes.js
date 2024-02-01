const express = require('express');
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Note");
const { body, validationResult } = require('express-validator');

//ROUTE 1: Create all the notes: GET "api/note/getuser". Login required

router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Some error occured");
    }

})

//ROUTE 2: Add a new note: GET "api/notes/addnote". Login required

router.post('/addnote', [
    body('title', 'Enter a valid title (Min length 3 characters)').isLength({ min: 3 }),
    body('description', 'Description must be atleast 8 characters').isLength({ min: 8 }),
], fetchuser, async (req, res) => {

    try {
        const { title, description, tag } = req.body;
        //If there are errors, return bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const note = new Note({
            title, description, tag, user: req.user.id
        });
        const saveNote = await note.save();

        res.json(saveNote);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Some error occured");
    }
});


//ROUTE 3: Update an existing note: PUT "api/notes/updatenote". Login required

router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    const newNote = {}
    if (title) { newNote.title = title };
    if (description) { newNote.description = description };
    if (tag) { newNote.tag = tag };

    //Find the note to be updated and update it
    let note = await Note.findById(req.params.id);
    if (!note) { res.status(404).send("Not Found") }

    if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not allowed");
    }

    note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
    res.json({ note });
});


//ROUTE 4: Delete an existing note: DELETE "api/notes/deletenote". Login required

router.delete('/deletenote/:id', fetchuser, async (req, res) => { 
    //Find the note to be updated and delete it
    let note = await Note.findById(req.params.id);
    if (!note) { res.status(404).send("Not Found") }

    //Allow deletion only if user owns this Note
    if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not allowed");
    }

    note = await Note.findByIdAndDelete(req.params.id)
    res.json({ "Success": "Note has been deleted", note });
});

module.exports = router;