import express from "express";
import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import User from "../Models/UserModel.js";
import { generateToken , isAuth } from "../utils.js";

const userRouter = express.Router();

userRouter.post("/signin", expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.identifier });
      
    if(user)
    {
        if(bcrypt.compareSync(req.body.password, user.password))
        {
            res.send({_id : user._id, username: user.username, email: user.email, token: generateToken(user)})
            return;
        }
    }
    res.status(401).send({message: "Invalid Credentials"});
}));

userRouter.post("/signup", expressAsyncHandler(async (req, res) => {
    const {email,password} = req.body;
    try{
        const newUser = new User({username: email.split('@')[0], email: email, password: bcrypt.hashSync(password,10)});
        const user = await newUser.save();
        res.send({_id: user._id, username: user.username, email: user.email, token: generateToken(user)});
    }
    catch(error){
        res.status(400).send({message: "email already in database"});
    }
}));

userRouter.get("/", isAuth , async (req,res) => {
    res.status(200).send({message: "Ok"})
});

export default userRouter;