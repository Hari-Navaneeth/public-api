require("dotenv").config();
const express = require("express");
const cors = require("cors");
const port = process.env.PORT;
const routes = require("./routes");
const mongoose = require("mongoose");
const { setup } = require("./test/utils");
const app = express();
mongoose.set("debug", true);
// app.options('*', cors()) // include before other routes
app.use(cors({ allowedHeaders: "*", methods: "*", origin: "*" }));
app.use(express.json());
app.use("/", routes);
Promise.all([setup()]).then(() => {
  app.listen(port, async () => {
    console.log("server started at", port);
  });
});

module.exports = app;
