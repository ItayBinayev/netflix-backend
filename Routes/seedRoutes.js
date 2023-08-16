import express from "express";
import { data, listMovieNames, listSeriesNames ,genres } from "../data.js"
import Content from "../Models/ContentModel.js";
import User from "../Models/UserModel.js";
import FeaturedContent from "../Models/FeaturedContentModel.js";
import expressAsyncHandler from "express-async-handler";

const seedRouter = express.Router();

seedRouter.get("/", async (req, res,next) => {
    try{
        await Content.deleteMany({}); //delete by filtering
        await User.deleteMany({}); //delete by filtering
        await FeaturedContent.deleteMany({}); //delete by filtering
        const createdContents = await Content.insertMany(data.content);
        const createdUsers = await User.insertMany(data.users);

        await seedFeaturedContent(listMovieNames, "movies");
        await seedFeaturedContent(listSeriesNames, "series");


        res.send({createdContents, createdUsers});
    }
    catch(e)
    {
        console.log("failed to update " +e.message);
    }
})


const seedFeaturedContent = expressAsyncHandler(async (array, type) => {
    for (let i = 0; i < array.length; i++) {
      const isSeries = type == "movie" ? false : true;
  
      const newFeatured = await Content.aggregate([
        { $match: { isSeries: isSeries } },
        { $sample: { size: 8 } },
      ]);
  
      newFeatured.map((f) => f._id);
  
      const newFeaturedContent = new FeaturedContent({
        name: array[i],
        type: type,
        genre: [genres[i]],
        contentList: newFeatured,
      });
      await newFeaturedContent.save();
    }
  });

export default seedRouter;