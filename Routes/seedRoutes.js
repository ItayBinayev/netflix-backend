import express from "express";
import { data } from "../data.js"
import Content from "../Models/ContentModel.js";
import User from "../Models/UserModel.js";
import FeaturedContent from "../Models/FeaturedContentModel.js";

const seedRouter = express.Router();

seedRouter.get("/", async (req, res,next) => {
    try{
        await Content.deleteMany({}); //delete by filtering
        await User.deleteMany({}); //delete by filtering
        await FeaturedContent.deleteMany({}); //delete by filtering
        const createdContents = await Content.insertMany(data.content);
        const createdUsers = await User.insertMany(data.users);

        res.send({createdContents, createdUsers});
    }
    catch(e)
    {
        console.log("failed to update " +e.message);
    }
})

export default seedRouter;