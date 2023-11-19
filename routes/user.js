const express = require("express");
const userModel = require("../models/user");
const companyModel = require("../models/company");
const logger = require("../middleware/logger");
const upload = require("../middleware/avatarUpload");
const user = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

user.get("/user/:id", logger, async (req, res) => {
   const { id } = req.params;

   try {
      const user = await userModel.findById(id);
      if (!user) {
         return res.status(404).send({
            statusCode: 404,
            message: "User not found",
         });
      }

      res.status(200).send({
         statusCode: 200,
         user,
      });
   } catch (e) {
      res.status(500).send({
         statusCode: 500,
         message: "Internet server ERROR",
      });
   }
});

user.post("/user/create", logger, async (req, res) => {
   const salt = await bcrypt.genSalt(10);
   const hashedPassword = await bcrypt.hash(req.body.password, salt);
   const company = await companyModel.findOne({ email: `${req.body.email}` });

   if (company) {
      return res.status(404).send({
         statusCode: 404,
         message: "Email already exist",
      });
   }

   const newUser = new userModel({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,
      dateOfBirth: req.body.dateOfBirth,
      phoneNumber: req.body.phoneNumber,
      gender: req.body.gender,
   });

   try {
      const user = await newUser.save();
      res.status(200).send({
         statusCode: 200,
         message: "user saved correctly",
         user,
      });
   } catch (e) {
      res.status(500).send({
         statusCode: 500,
         message: "Internet server ERROR",
      });
   }
});

user.patch(
   "/user/cloudUpdate/:id",
   upload.single("avatar"),
   async (req, res) => {
      const { id } = req.params;

      const userExist = await userModel.findById(id);

      if (!userExist) {
         return res.status(400).send({
            statusCode: 404,
            message: "User not found",
         });
      }

      try {
         const avatarUrl = req.file.path;
         const options = { new: true };
         const result = await userModel.findByIdAndUpdate(id, {
            avatar: `${avatarUrl}`,
         });

         const updatedUser = await userModel.findById(id);

         const token = jwt.sign(
            {
               id: updatedUser._id,
               firstName: updatedUser.firstName,
               lastName: updatedUser.lastName,
               email: updatedUser.email,
               dateOfBirth: updatedUser.dateOfBirth,
               phoneNumber: updatedUser.phoneNumber,
               avatar: updatedUser.avatar,
               role: "user",
            },
            process.env.JWT_SECRET,
            {
               expiresIn: "24h",
            }
         );

         res.status(200).send({
            statusCode: 200,
            message: "User edited succesfully",
            result,
            token,
         });
      } catch (e) {
         res.status(500).send({
            statusCode: 500,
            message: "Internet server ERROR",
         });
      }
   }
);

user.patch("/user/update/:id", logger, async (req, res) => {
   const { id } = req.params;

   const userExist = await userModel.findById(id);

   if (!userExist) {
      return res.status(400).send({
         statusCode: 404,
         message: "User not found",
      });
   }

   try {
      const dataToUpdate = req.body;
      const options = { new: true };
      const result = await userModel.findByIdAndUpdate(
         id,
         dataToUpdate,
         options
      );

      const updatedUser = await userModel.findById(id);

      const token = jwt.sign(
         {
            id: updatedUser._id,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            dateOfBirth: updatedUser.dateOfBirth,
            phoneNumber: updatedUser.phoneNumber,
            avatar: updatedUser.avatar,
            role: "user",
         },
         process.env.JWT_SECRET,
         {
            expiresIn: "24h",
         }
      );

      res.status(200).send({
         statusCode: 200,
         message: "User edited succesfully",
         result,
         token,
      });
   } catch (e) {
      res.status(500).send({
         statusCode: 500,
         message: "Internet server ERROR",
      });
   }
});

user.delete("/user/delete/:id", async (req, res) => {
   const { id } = req.params;

   const userExist = await userModel.findById(id);

   if (!userExist) {
      return res.status(404).send({
         statusCode: 404,
         message: "User not found",
      });
   }

   try {
      const result = await userModel.findByIdAndDelete(id);

      res.status(200).send({
         statusCode: 200,
         message: "user deleted succesfully",
         result,
      });
   } catch (e) {
      res.status(500).send({
         statusCode: 500,
         message: "Internet server ERROR",
      });
   }
});

module.exports = user;
