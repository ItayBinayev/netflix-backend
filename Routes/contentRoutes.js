import express from "express";
import expressAsyncHandler from "express-async-handler";
import { isAuth } from "../utils.js";
import Content from "../Models/ContentModel.js";
import FeaturedContent from "../Models/FeaturedContentModel.js";



const contentRouter = express.Router();
const PAGE_SIZE = 10;

contentRouter.get(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const contents = await Content.find();
    res.send(contents);
  })
);

contentRouter.get(
  "/id/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const contentById = await Content.findById(id);
    console.log(contentById);
    contentById
      ? res.send(contentById)
      : res.status(404).send({ message: "Content not found" });
  })
);



contentRouter.get('/featured/:type',isAuth, expressAsyncHandler(async (req, res) =>{
  const { type } = req.params;
  const featuredContent = await FeaturedContent.find( type.toLowerCase() === "all" ? {} : { type: type.toLowerCase()})
  .populate("contentList")
  .exec();
  return res.status(200).send(featuredContent);
}))

contentRouter.get('/random/:type',isAuth, expressAsyncHandler(async (req, res) => {
  const { type } = req.params;
  const content = await Content.aggregate(type.toLowerCase() === 'series' ? [{ $match: { isSeries: true } } ,{ $sample: { size: 1 } } ] : type.toLowerCase() === 'movie' ? [{ $match: { isSeries: false } } ,{ $sample: { size: 1 } }] : [{ $sample: { size: 1 } }]);
  return res.send(content[0])
}))

contentRouter.get(
  "/genres",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const genres = await Content.find().distinct("genre");
    res.send(genres);
  })
);

contentRouter.get(
  "/search",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const searchQuery = query.query || "";
    const queryFilter = searchQuery
      ? { title: { $regex: searchQuery, $options: "i" } }
      : {};
      
    const contents = await Content.find({
      ...queryFilter,
    })
    const countContent = await Content.countDocuments({
      ...queryFilter,
    });
    console.log(countContent);
    res.send({
      contents,
      countContent: countContent,
    });
  })
);






export default contentRouter;
