"use strict";

const { SuccessResponse } = require("../core/success.response");
const CartService = require("../services/cart.service");

class CartController {
    addToCart = async (req, res, next) => {
        new SuccessResponse({
            message: "Successful add to Cart!",
            metadata: await CartService.addToCart({
                ...req.body,
            }),
        }).send(res);
    };

    update = async (req, res, next) => {
        new SuccessResponse({
            message: "Successful update to Cart!",
            metadata: await CartService.changeQuantityProduct({
                ...req.body,
            }),
        }).send(res);
    };

    delete = async (req, res, next) => {
        new SuccessResponse({
            message: "Successful delete product in Cart!",
            metadata: await CartService.deleteUserCard({
                ...req.body,
            }),
        }).send(res);
    };

    list = async (req, res, next) => {
        new SuccessResponse({
            message: "Successful get list Product in Cart!",
            metadata: await CartService.gitListUserCart(req.query),
        }).send(res);
    };
}

module.exports = new CartController();
