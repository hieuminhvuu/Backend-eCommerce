"use strict";

const express = require("express");
const cartController = require("../../controllers/cart.controller");
const router = express.Router();
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");

router.post("", asyncHandler(cartController.addToCart));
router.delete("", asyncHandler(cartController.delete));
router.post("/update", asyncHandler(cartController.update));
router.get("", asyncHandler(cartController.list));

module.exports = router;
