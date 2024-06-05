const express = require("express");

const router = express.Router();
const helper = require("./controllers");

router.route("/createuser").post(helper.createUser);
router.route("/createagent").post(helper.createAgent);


module.exports = router;
