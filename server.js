const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const userRoute = require("./routes/user");
const companyRoute = require("./routes/company");
const loginRoute = require("./routes/login");
require("dotenv").config();

const PORT = 5050;
const app = express();

app.use("/public", express.static(path.join(__dirname, "public")));

app.use(cors());
app.use(express.json());

app.use("/", userRoute);
app.use("/", companyRoute);
app.use("/", loginRoute);

mongoose.connect(process.env.MONGODB_URL, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Error during db connection"));
db.once("open", () => {
   console.log("Database successfully connected!");
});

app.listen(PORT, () => console.log(`Server up and running on port ${PORT}`));
