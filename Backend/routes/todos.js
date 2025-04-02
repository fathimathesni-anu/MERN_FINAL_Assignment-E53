const express = require('express');
const Todo = require('../models/Todos');
const authenticationToken = require('./middleware');

const router = express.Router();

router.post('/',authenticationToken,async(req,res)=>{
const {title}= req.body;
const newTodo = new Todo({
  title,
  user:req.user.id,
});

try{
  const savedTodo = await newTodo.save();
  res.status(201).json(savedTodo);
}catch(error){
  res.status(500).json({error:'Error creating todo'});
}
});
router.get('/',authenticationToken,async(req,res)=>{
  try {
    const todos = await Todo.find({user:req.user.id});
    res.json(todos);
  } catch (error) {
    res.status(500).json({error:'error fetching todos'})
  }
});
module.exports = router;