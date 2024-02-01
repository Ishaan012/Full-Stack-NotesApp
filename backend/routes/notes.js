const express = require('express');
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Note");
const { body, validationResult } = require('express-validator');

//ROUTE 1: Create all the notes: GET "api/auth/getuser". Login required



router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Some error occured");
    }

})

//ROUTE 2: Add a new note: GET "api/auth/addnotes". Login required

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


})

module.exports = router;