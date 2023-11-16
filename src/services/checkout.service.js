"use strict";

const { findCartById } = require("../models/repositories/cart.repo");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const { checkProductByServer } = require("../models/repositories/product.repo");
const { getDiscountAmount } = require("./discount.service");
const { acquireLock, releaseLock } = require("./redis.service");
const order = require("../models/order.model");

class CheckoutService {
    //login and without login
    /*
        {
            cartId,
            userId,
            shop_order_ids: [
                {
                    shopId,
                    shop_discounts:[],
                    item_products: [
                        {
                            price,
                            quantity,
                            productId
                        }
                    ]
                },
                {
                    shopId,
                    shop_discounts:[
                        {
                            shopId,
                            discountId,
                            codeId,
                        }
                    ],
                    item_products: [
                        {
                            price,
                            quantity,
                            productId,
                        },
                        {
                            price,
                            quantity,
                            productId,
                        },
                    ]
                },
            ]
        }
    */
    static async checkoutReview({ cartId, userId, shop_order_ids = [] }) {
        //check cartId exists?
        const foundCart = await findCartById(cartId);
        if (!foundCart) throw new BadRequestError("Cart not found!");

        const checkout_order = {
                totalPrice: 0, //tong tien hang
                feeShip: 0, //tien ship
                totalDiscount: 0, //discount
                totalCheckout: 0, //tong thanh toan
            },
            shop_order_ids_new = [];

        for (let i = 0; i < shop_order_ids.length; i++) {
            const {
                shopId,
                shop_discounts = [],
                item_products = [],
            } = shop_order_ids[i];

            //check product available?
            const checkProductServer = await checkProductByServer(
                item_products
            );
            console.log(`checkProductServer:::::::`, checkProductServer);
            if (!checkProductServer[i])
                throw new BadRequestError("Order wrong!");

            const checkoutPrice = checkProductServer.reduce((acc, product) => {
                return acc + product.quantity * product.price;
            }, 0);

            //tong tien truoc khi xu ly
            checkout_order.totalPrice += checkoutPrice;
            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRaw: checkoutPrice,
                priceApplyDiscount: checkoutPrice,
                item_products: checkProductServer,
            };

            if (shop_discounts.length > 0) {
                //gia su chi co 1 discount
                //get amount discount
                const { totalPrice, discount } = await getDiscountAmount({
                    codeId: shop_discounts[0].codeId,
                    userId,
                    shopId,
                    products: checkProductServer,
                });

                //tong cong discount giam gia
                checkout_order.totalDiscount += discount;
                //neu tien giam gia > 0
                if (discount > 0) {
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount;
                }
            }

            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
            shop_order_ids_new.push(itemCheckout);
        }

        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order,
        };
    }

    static async orderByUser({
        shop_order_ids,
        cartId,
        userId,
        user_address = {},
        user_payment = {},
    }) {
        const { shop_order_ids_new, checkout_order } =
            await CheckoutService.checkoutReview({
                cartId,
                userId,
                shop_order_ids,
            });

        // Check lai 1 lan nua xem co vuot ton kho hay ko?
        // get new array Products
        const products = shop_order_ids_new.platMap(
            (order) => order.item_products
        );
        console.log(`[1]:::`, products);
        const acquireProduct = [];
        for (let i = 0; i < products.length; i++) {
            const { productId, quantity } = products[i];
            const keyLock = await acquireLock(productId, quantity, cartId);
            acquireLock.push(keyLock ? true : false);
            if (keyLock) {
                await releaseLock(keyLock);
            }
        }

        // check neu co 1 sp het hang trong kho
        if (acquireProduct.includes(false)) {
            throw new BadRequestError(
                "Mot so san pham da duoc cap nhat, vui long quay lai gio hang..."
            );
        }

        const newOrder = await order.create({
            order_userId: userId,
            order_checkout: checkout_order,
            order_shipping: user_address,
            order_payment: user_payment,
            order_products: shop_order_ids_new,
        });

        // TH : neu truong hop thanh cong, remove product co trong cart
        if (newOrder) {
            //remove product in my cart
        }

        return newOrder;
    }

    static async getOrdersByUser() {}

    static async getOneOrderByUser() {}

    static async cancelOrderByUser() {}

    static async updateOrderStatusByShop() {}
}

module.exports = CheckoutService;
