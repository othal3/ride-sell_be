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
      avatar: {
         type: String,
         require: false,
         default: "https://img.icons8.com/pastel-glyph/64/person-male--v1.png",
      },
   },
   { timestamps: true, strict: true }
);

module.exports = mongoose.model("companyModel", companySchema, "company");
