"use strict";

const cart = require("../../models/cart.model");

const createUserCart = async ({ userId, product }) => {
    const query = { cart_userId: userId, cart_state: "active" },
        updateOrInsert = {
            $addToSet: {
                cart_products: product,
            },
        },
        options = { upsert: true, new: true };

    return await cart.findOneAndUpdate(query, updateOrInsert, options);
};

const updateUserProductQuantity = async ({ userId, product }) => {
    const { productId, quantity } = product;
    const query = {
            cart_userId: userId,
            "cart_products.productId": productId,
            cart_state: "active",
        },
        updateSet = {
            $inc: {
                "cart_products.$.quantity": quantity,
            },
        },
        options = { upsert: true, new: true };

    return await cart.findOneAndUpdate(query, updateSet, options);
};

const updateUserCart_products = async ({ userId, product }) => {
    const query = {
            cart_userId: userId,
            cart_state: "active",
        },
        updateSet = {
            $push: {
                cart_products: product,
            },
        },
        options = { upsert: true, new: true };
    return await cart.findOneAndUpdate(query, updateSet, options);
};

module.exports = {
    createUserCart,
    updateUserProductQuantity,
    updateUserCart_products,
};
