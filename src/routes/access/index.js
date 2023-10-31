"use strict";

const express = require("express");
const accessController = require("../../controllers/access.controller");
const router = express.Router();
const { asyncHandler } = require("../../auth/checkAuth");
const { authentication } = require("../../auth/authUtils");

// signUp
router.post("/shop/signup", accessController.signUp);
router.post("/shop/login", accessController.login);

// authentication
router.use(authentication);

router.post("/shop/logout", accessController.logout);

module.exports = router;
