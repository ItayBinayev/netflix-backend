import express from "express";
import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import User from "../Models/UserModel.js";
import { generateToken, isAuth } from "../utils.js";
import mongoose from "mongoose";

const userRouter = express.Router();

userRouter.post(
  "/signin",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.identifier });

    if (user) {
        await user.populate("myFavouriteList");
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          username: user.username,
          email: user.email,
          token: generateToken(user),
          userList: user.myFavouriteList
        });
        return;
      }
    }
    res.status(401).send({ message: "Invalid Credentials" });
  })
);

userRouter.post(
  "/signup",
  expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;
    try {
      const newUser = new User({
        username: email.split("@")[0],
        email: email,
        password: bcrypt.hashSync(password, 10),
      });
      const user = await newUser.save();
      await user.populate("myFavouriteList");
      res.send({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user),
        userList: user.myFavouriteList
      });
    } catch (error) {
      res.status(400).send({ message: "email already in database" });
    }
  })
);

userRouter.get("/", isAuth, async (req, res) => {
  res.status(200).send({ message: "Ok" });
});

userRouter.post(
  "/list",
  expressAsyncHandler(async (req, res) => {
    const { id, content } = req.body;
    const user = await User.findById(id);
    console.log(user);
    let newList = user.myFavouriteList ? [...user.myFavouriteList] : [];
    const indexCon = user.myFavouriteList.indexOf(content);
    if (indexCon === -1) {
      newList.push(content);
    } else {
      newList.splice(indexCon, 1);
    }
    user.myFavouriteList = newList;
    await user.save();
    await user.populate("myFavouriteList");
    return res.send(user.myFavouriteList);
  })
);

userRouter.get(
  "/mylist",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const id = req.user._id;
    console.log(id);
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    await user.populate("myFavouriteList");
    console.log(user.myFavouriteList);
    return res.send({ name: "My List", contentList: user.myFavouriteList });
  })
);

export default userRouter;
