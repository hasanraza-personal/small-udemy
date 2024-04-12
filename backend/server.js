const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const { connectDB } = require("./db/index.js");
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 5000;

const corsOptions = {
  origin: "*",
};

// MongoDB connection
connectDB()
  .then(() => {
    app.on("error", () => {
      console.log("ERROR on server: ", error);
    });
    app.listen(PORT, () => {
      console.log(`Server is running at port : ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MONGO db connection failed !!! ", error);
  });

// Middleware
app.use(express.static(path.join(__dirname, "../frontend/build")));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, linit: "16kb" }));
app.use(cors(corsOptions));
app.use(express.static("public"));
app.use("/auth", authRoutes);
app.use("/courses", courseRoutes);

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});
