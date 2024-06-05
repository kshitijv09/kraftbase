const express = require("express");

const router = express.Router();
const agent = require("./controllers");

router.route("/update/:id").put(agent.updateDeliveryStatus);


module.exports = router;
