import mongoose from "mongoose";

const featuredContentSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        type: {type: String },      
        genre: [{ type: String }],      
        contentList: [{type: mongoose.Schema.Types.ObjectId,
            ref: 'Content'}]
    },
    { timestamps: true }
);

const FeaturedContent = mongoose.model("FeaturedContent", featuredContentSchema);
export default FeaturedContent;