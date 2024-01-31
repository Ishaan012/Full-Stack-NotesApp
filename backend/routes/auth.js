const express = require('express');
const router = express.Router();
const User= require("../models/User");

//Epress validator

router.post('/', function(req,res){
    console.log(req.body);
    const user=User(req.body);
    user.save();
    res.send("Hello");
})

module.exports = router;