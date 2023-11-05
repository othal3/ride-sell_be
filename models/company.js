const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
   {
      name: {
         type: String,
         require: true,
      },
      email: {
         type: String,
         require: true,
         unique: true,
      },
      password: {
         type: String,
         require: true,
      },
      phoneNumber: {
         type: Number,
         require: false,
      },
      logo: {
         type: String,
         require: false,
      },
   },
   { timestamps: true, strict: true }
);

module.exports = mongoose.model("companyModel", companySchema, "company");
