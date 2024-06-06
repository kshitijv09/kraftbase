const express = require('express');
require("dotenv").config();

const app = express();

app.use(express.json());

const userRouter = require("./user_service/routes");
const restaurantRouter = require("./restaurant_service/routes");
const deliveryRouter = require("./deliveryagent_service/routes");
const helperRouter=require("./helper/routes")

app.use("/user",userRouter)
app.use("/restaurant",restaurantRouter)
app.use("/agent",deliveryRouter)
app.use("/helper",helperRouter)

const PORT = process.env.PORT || 3000;
const start = () => {
    try {
      app.listen(PORT, console.log(`Server is running on port ${PORT}`));
    } catch (error) {
      console.log("Error is ",error);
    }
  };
  
  start();