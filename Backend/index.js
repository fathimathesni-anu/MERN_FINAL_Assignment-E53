const express = require('express');
const app = express();
const dotenv = require("dotenv");
const  mongoose= require('mongoose');
const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');
const cors = require('cors');

dotenv.config()

app.use(express.json());
app.use(cors({
  origin:"*",
  methods:"GET,POST,PUT,DELETE",
  allowedHeaders:"Content-type,Authorization"
})
);



mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log('mongodb connected'))
.catch(err =>console.error('mongodb connection error:',err));

app.use('/api/auth',authRoutes);
app.use('/api/todos',todoRoutes);

const PORT = process.env.PORT 
app.listen(PORT,()=>{
  console.log(`server is running at port ${PORT}`);
})