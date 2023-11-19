const express = require("express");
const companyModel = require("../models/company");
const userModel = require("../models/user");
const logger = require("../middleware/logger");
const upload = require("../middleware/avatarUpload");
const company = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

company.get("/company/:id", logger, async (req, res) => {
   const { id } = req.params;

   try {
      const company = await companyModel.findById(id);
      if (!company) {
         return res.status(404).send({
            statusCode: 404,
            message: "company not found",
         });
      }

      res.status(200).send({
         statusCode: 200,
         company,
      });
   } catch (e) {
      res.status(500).send({
         statusCode: 500,
         message: "Internet server ERROR",
      });
   }
});

company.post("/company/create", logger, async (req, res) => {
   const salt = await bcrypt.genSalt(10);
   const hashedPassword = await bcrypt.hash(req.body.password, salt);
   const user = await userModel.findOne({ email: `${req.body.email}` });
   if (user) {
      return res.status(404).send({
         statusCode: 404,
         message: "Email already exist",
      });
   }

   const newcompany = new companyModel({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      phoneNumber: req.body.phoneNumber,
   });

   try {
      const company = await newcompany.save();
      res.status(200).send({
         statusCode: 200,
         message: "company saved correctly",
         company,
      });
   } catch (e) {
      res.status(500).send({
         statusCode: 500,
         message: "Internet server ERROR",
      });
   }
});

company.patch(
   "/company/cloudUpdate/:id",
   upload.single("avatar"),
   async (req, res) => {
      const { id } = req.params;

      const companyExist = await companyModel.findById(id);

      if (!companyExist) {
         return res.status(400).send({
            statusCode: 404,
            message: "company not found",
         });
      }

      try {
         const avatarUrl = req.file.path;
         const options = { new: true };
         const result = await companyModel.findByIdAndUpdate(id, {
            avatar: `${avatarUrl}`,
         });

         const updatedCompany = await companyModel.findById(id);

         const token = jwt.sign(
            {
               id: updatedCompany._id,
               name: updatedCompany.name,
               email: updatedCompany.email,
               phoneNumber: updatedCompany.phoneNumber,
               avatar: updatedCompany.avatar,
               role: "company",
            },
            process.env.JWT_SECRET,
            {
               expiresIn: "24h",
            }
         );

         res.status(200).send({
            statusCode: 200,
            message: "Company edited succesfully",
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

company.patch("/company/update/:id", logger, async (req, res) => {
   const { id } = req.params;

   const companyExist = await companyModel.findById(id);

   if (!companyExist) {
      return res.status(400).send({
         statusCode: 404,
         message: "company not found",
      });
   }

   try {
      const dataToUpdate = req.body;
      const options = { new: true };
      const result = await companyModel.findByIdAndUpdate(
         id,
         dataToUpdate,
         options
      );

      const updatedCompany = await companyModel.findById(id);

      const token = jwt.sign(
         {
            id: updatedCompany._id,
            name: updatedCompany.name,
            email: updatedCompany.email,
            phoneNumber: updatedCompany.phoneNumber,
            avatar: updatedCompany.avatar,
            role: "company",
         },
         process.env.JWT_SECRET,
         {
            expiresIn: "24h",
         }
      );

      res.status(200).send({
         statusCode: 200,
         message: "company edited succesfully",
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

company.delete("/company/delete/:id", async (req, res) => {
   const { id } = req.params;

   const companyExist = await companyModel.findById(id);

   if (!companyExist) {
      return res.status(404).send({
         statusCode: 404,
         message: "company not found",
      });
   }

   try {
      const result = await companyModel.findByIdAndDelete(id);

      res.status(200).send({
         statusCode: 200,
         message: "company deleted succesfully",
         result,
      });
   } catch (e) {
      res.status(500).send({
         statusCode: 500,
         message: "Internet server ERROR",
      });
   }
});

module.exports = company;
