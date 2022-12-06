async function start() {
  const express = require("express");
  const cors = require("cors");
  // const port = process.env.PORT || 8080;
  const port = 3000;
  const routes = require("./routes");
  const mongoose = require("mongoose");
  const { setup } = require("./test/utils");
  const app = express();
  mongoose.set("debug", true);
  // app.options('*', cors()) // include before other routes
  app.use(cors({ allowedHeaders: "*", methods: "*", origin: "*" }));
  app.use(express.json());
  app.use("/", routes);

  await setup();

  app.listen(port,()=>{
    console.log("server started at", port);
  });
  
}
start();
