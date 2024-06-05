const express = require("express");

const router = express.Router();
const restaurant = require("./controllers");

router.route("/add").post(restaurant.addRestaurant);
router.route("/update/:id").put(restaurant.updateRestaurantDetails);
router.route("/approve/:id").put(restaurant.approveOrder);

module.exports = router;