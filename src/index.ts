import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import multer from "multer";
require("dotenv").config();

//setting up express app
console.log(path.join(__dirname, "..", "public"));
let app = express();
// app.use(express.static(path.join(__dirname, "..", "public")));
app.use('/public', express.static(path.join(__dirname, "..", "public")));
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json());
// app.use(multer().any());
app.use(cors());

//Connecting with mongoose
mongoose.connect(process.env.MONGO_CON_STRING, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).then(() => { console.log("Mongoose connected") }).catch((err) => { throw err });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Creating routes
import authRouter from "./routes/auth";
import userRouter from "./routes/user";
import postRouter from "./routes/post";
import commentRouter from "./routes/comment";
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/post", postRouter);
app.use("/comment", commentRouter);


// Error handling
const errorHandler = (err: any, request: Request, response: Response, next: NextFunction) => {
    console.log("using error handler");
    return response.status(500).json({ err: err.message });
}

// Starting express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => { console.log(`Server started listening on port ${PORT}`); });