const express = require("express");
const userModel = require("../models/user");
const companyModel = require("../models/company");
const postModel = require("../models/post");
const logger = require("../middleware/logger");
const upload = require("../middleware/postImgUpload");
const post = express.Router();

post.get("/posts", logger, async (req, res) => {
   try {
      const post = await postModel.find();

      res.status(200).send({
         statusCode: 200,
         post,
      });
   } catch (e) {
      res.status(500).send({
         statusCode: 500,
         message: "Internal server error",
      });
   }
});

post.get("/post/:id", logger, async (req, res) => {
   const { id } = req.params;

   try {
      const post = await postModel.findById(id);
      if (!post) {
         return res.status(404).send({
            statusCode: 404,
            message: "company not found",
         });
      }

      res.status(200).send({
         statusCode: 200,
         post,
      });
   } catch (e) {
      res.status(500).send({
         statusCode: 500,
         message: "Internet server ERROR",
      });
   }
});

post.post("/post/create/:id", logger, async (req, res) => {
   const { id } = req.params;
   const user = await userModel.findById(id);
   const company = await companyModel.findById(id);
   let author;

   if (user) {
      author = "userModel";
   } else if (company) {
      author = "companyModel";
   } else {
      return res.status(404).send({
         statusCode: 404,
         message: "User not found",
      });
   }

   const newPost = new postModel({
      year: req.body.year,
      make: req.body.make,
      model: req.body.model,
      engine: req.body.engine,
      fuelType: req.body.fuelType,
      power: req.body.power,
      km: req.body.km,
      description: req.body.description,
      price: req.body.price,
      author: id,
      authorType: author,
   });

   try {
      const post = await newPost.save();
      res.status(200).json({
         statusCode: 200,
         message: "post saved correctly",
         post,
      });
   } catch {
      res.status(500).send({
         statusCode: 500,
         message: "Internet server ERROR",
      });
   }
});

post.patch("/post/imgUpload/:id", upload.single("img"), async (req, res) => {
   const { id } = req.params;
   const post = await postModel.findById(id);

   if (!post) {
      return res.status(404).send({
         statusCode: 404,
         message: "Post not found",
      });
   }

   try {
      const imgUrl = req.file.path;
      const options = { new: true };
      const result = await postModel.findByIdAndUpdate(id, {
         img: `${imgUrl}`,
      });

      res.status(200).json({
         statusCode: 200,
         message: "Images uploaded successfully",
         result,
      });
   } catch (error) {
      console.error("Caught an error:", error.message);
      console.error("Stack trace:", error.stack);
      res.status(500).send({
         statusCode: 500,
         message: "Internal server error",
      });
   }
});

module.exports = post;
