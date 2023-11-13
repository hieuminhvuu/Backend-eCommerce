"use strict";

const express = require("express");
const discountController = require("../../controllers/discount.controller");
const router = express.Router();
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");

router.post("/amount", asyncHandler(discountController.getDiscountAmount));
router.get(
    "/list_product_code",
    asyncHandler(discountController.getAllDiscountCodeWithProduct)
);

router.use(authentication);

router.post("", asyncHandler(discountController.createDiscountCode));
router.get("", asyncHandler(discountController.getAllDiscountCodeByShop));
router.delete("", asyncHandler(discountController.deleteDiscountCodeByShop));

module.exports = router;
