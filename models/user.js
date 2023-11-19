const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
   {
      firstName: {
         type: String,
         require: true,
      },
      lastName: {
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
      dateOfBirth: {
         type: String,
         require: true,
      },
      gender: {
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

module.exports = mongoose.model("userModel", userSchema, "user");
