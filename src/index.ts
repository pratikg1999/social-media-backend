import express from "express"
import cors from "cors";
import mongoose from "mongoose";
require("dotenv").config();

//setting up express app
let app = express();
app.use(express.json());
app.use(cors());

//Connecting with mongoose
mongoose.connect(process.env.MONGO_CON_STRING, {useNewUrlParser : true, useUnifiedTopology: true, useCreateIndex: true}).then(()=>{console.log("Mongoose connected")}).catch((err)=>{throw err});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Creating routes
app.use((request, response)=>{return response.json("hello")});

// Starting express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{console.log(`Server started listening on port ${PORT}`);});