import express from "express";

import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/users.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
// we should specify the route after the cors intialization other wise it may cause Cors error
app.use("/posts", postRoutes);
app.use("/user", userRoutes);
let CONNECTION_URL =
  "mongodb+srv://talha55:556989talha@cluster0.9et4wou.mongodb.net/?retryWrites=true&w=majority";

const PORT = 5000;
mongoose
  .connect(CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  )
  .catch((error) => console.log(error.message));
