const express = require('express');
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt=require('jsonwebtoken');

const JWT_SECRET='Ishaanisagoodb$oy';

//Epress validator, Jsonwebtoken

router.post('/createuser', [
    body('name', 'Enter a valid name (Min length 3 characters)').isLength({ min: 3 }),
    body('email', 'Enter the valid email').isEmail(),
    body('password', 'Password must be atleast 8 characters').isLength({ min: 8 }),
], async (req, res) => {
    //If there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    //Check whether the user with same email exists already

    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: "Sorry! A user with this email already exists" })
        }

        const salt=await bcrypt.genSalt(10);
        const secPass=await bcrypt.hash(req.body.password,salt);

        //Create a user
        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email
        });
        const data={
            user:{
                id:user.id
            }
        }

        const authtoken = jwt.sign(data,JWT_SECRET);
        res.json({authtoken});
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Some error occured");
    }



})

module.exports = router;