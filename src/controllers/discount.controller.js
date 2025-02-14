"use strict";

const { SuccessResponse } = require("../core/success.response");
const DiscountService = require("../services/discount.service");

class DiscountController {
    createDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: "Successful code Generate!",
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                shopId: req.user.userId,
            }),
        }).send(res);
    };

    getAllDiscountCodeByShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Successful code found!",
            metadata: await DiscountService.getAllDiscountCodeByShop({
                ...req.query,
                shopId: req.user.userId,
            }),
        }).send(res);
    };

    getDiscountAmount = async (req, res, next) => {
        new SuccessResponse({
            message: "Successful code Generate!",
            metadata: await DiscountService.getDiscountAmount({
                ...req.body,
            }),
        }).send(res);
    };

    getAllDiscountCodeWithProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "Successful code Generate!",
            metadata: await DiscountService.getAllDiscountCodeWithProduct({
                ...req.query,
            }),
        }).send(res);
    };

    deleteDiscountCodeByShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Successful code delete!",
            metadata: await DiscountService.deleteDiscountCode({
                codeId: req.query.codeId,
                shopId: req.user.userId,
            }),
        }).send(res);
    };
}

module.exports = new DiscountController();
