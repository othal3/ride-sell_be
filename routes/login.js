const express = require("express");
const login = express.Router();
const bcrypt = require("bcrypt");
const userModel = require("../models/user");
const companyModel = require("../models/company");
const jwt = require("jsonwebtoken");
require("dotenv").config();

login.post("/login", async (req, res) => {
   const user = await userModel.findOne({ email: req.body.email });
   const company = await companyModel.findOne({ email: req.body.email });

   if (!user) {
      if (!company) {
         return res.status(404).send({
            message: "Email or password do not exist",
            statusCode: 404,
         });
      }
   }

   if (user) {
      var validPassword = await bcrypt.compare(
         req.body.password,
         user.password
      );
   } else {
      var validPassword = await bcrypt.compare(
         req.body.password,
         company.password
      );
   }

   if (!validPassword) {
      return res.status(400).send({
         statusCode: 400,
         message: "Incorrect Email o password",
      });
   }

   if (user) {
      var token = jwt.sign(
         {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            dateOfBirth: user.dateOfBirth,
            phoneNumber: user.phoneNumber,
            avatar: user.avatar,
            role: "user",
         },
         process.env.JWT_SECRET,
         {
            expiresIn: "24h",
         }
      );
   } else {
      var token = jwt.sign(
         {
            id: company._id,
            name: company.name,
            email: company.email,
            phoneNumber: company.phoneNumber,
            avatar: company.avar,
            role: "company",
         },
         process.env.JWT_SECRET,
         {
            expiresIn: "24h",
         }
      );
   }

   res.header("Authorization", token).status(200).send({
      message: "Login effettuato con successo",
      statusCode: 200,
      token,
   });
});

module.exports = login;
