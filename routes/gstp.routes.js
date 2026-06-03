const router = require("express").Router();
const gstpController = require("../controllers/gstp.controller");

router.get("/search", gstpController.searchGSTP);

module.exports = router;