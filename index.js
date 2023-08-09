import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import userRouter from './Routes/userRoutes.js';
import seedRouter from './Routes/seedRoutes.js';
import contentRouter from './Routes/contentRoutes.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users",userRouter);
app.use("/api/seed/reset",seedRouter);
app.use("/api/content",contentRouter);


mongoose.connect(process.env.MONGO_DB_URI)
.then(()=> {
    console.log("Connected to mongodb!");
    app.listen(PORT);
    console.log("server listening on port " + PORT);
})
.catch((e) => console.log(e));

