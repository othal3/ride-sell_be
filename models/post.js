const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
   {
      year: {
         type: Number,
         require: true,
      },
      make: {
         type: String,
         require: true,
      },
      model: {
         type: String,
         require: true,
      },
      engine: {
         type: String,
         require: true,
      },
      fuelType: {
         type: String,
         require: true,
      },
      power: {
         type: String,
         require: true,
      },
      km: {
         type: String,
         require: true,
      },
      description: {
         type: String,
         require: true,
      },
      price: {
         type: Number,
         require: true,
      },
      author: {
         type: mongoose.Schema.Types.ObjectId,
         refPath: "authorType",
      },
      authorType: {
         type: String,
         enum: ["userModel", "companyModel"],
      },
      img: [
         {
            type: String,
         },
      ],
   },
   { timestamps: true, strict: true }
);

module.exports = mongoose.model("postModel", postSchema, "post");
