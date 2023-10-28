"use strict";

const express = require("express");
const { apikey, permission } = require("../auth/checkAuth");
const router = express.Router();

// check apiKey
router.use(apikey);

// check permission
router.use(permission("0000"));

router.use("/v1/api", require("./access"));

router.get("/", (req, res, next) => {
    return res.status(200).json({
        message: "Welcome to the league of Arthur!",
    });
});

module.exports = router;
