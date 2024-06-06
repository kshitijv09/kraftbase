const express = require("express");

const router = express.Router();
const user = require("./controllers");

router.route("/list").get(user.getAllRestaurants);
router.route("/order").post(user.placeOrder);
router.route("/rateorder/:id").put(user.rateOrder);
router.route("/rateagent/:id").put(user.rateAgent);

module.exports = router;
