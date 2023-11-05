const express = require("express");
const userModel = require("../models/user");
const logger = require("../middleware/logger");
const upload = require("../middleware/avtarUploader");
const user = express.Router();
const bcrypt = require("bcrypt");

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

   const newUser = new userModel({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
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

      res.status(200).send({
         statusCode: 200,
         message: "User edited succesfully",
         result,
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