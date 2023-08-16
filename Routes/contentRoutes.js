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

contentRouter.get(
  "/search",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const pageSize = PAGE_SIZE;
    const page = query.page || 1;
    const searchQuery = query.query || "";

    const queryFilter = searchQuery
      ? { title: { $regex: searchQuery, $options: "i" } }
      : {};
    const contents = await Content.find({
      ...queryFilter,
    })
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    const countContent = await Content.countDocuments({
      ...queryFilter,
    });
    console.log(countContent);
    res.send({
      contents,
      page,
      countContent: countContent,
      pages: Math.ceil(countContent / pageSize),
    });
  })
);

contentRouter.get('/random', expressAsyncHandler(async (req, res) => {
const content = await Content.aggregate([{ $sample: { size: 1 } }]);
return res.send(content[0])
}))

contentRouter.get('/featured', expressAsyncHandler(async (req, res) =>{
const lists = await FeaturedContent.find().populate('contentList').exec();
return res.send(lists);
}))

export default contentRouter;
