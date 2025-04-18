const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


const router = express.Router()


router.post('/register',async(req,res)=>{
  const {username,password}= req.body;
  try{
    const hashedPassword = await bcrypt.hash(password,10);
    const newUser = new User({username, password:hashedPassword});
    await newUser.save();
    res.status(201).json({message:'User registered successfully'});
  }catch(error){
    res.status(500).json({error:'Error registering user'});
  }
});

router.post('/login',async (req,res)=>{
  const {username , password} = req.body;
  try{
    const user = await User.findOne({username});
    if(!user)return res.status(400).json({error:'invalid credentials'});
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch)return res.status(400).json({error:'invalid credentials'});
    const token = jwt.sign({id:user._id,username:user.username},process.env.JWT_SECRET);
    res.json({token});
  }catch(error){
    res.status(500).json({error:'error logging in'})
  }
});

module.exports= router;