"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const discount = require("../models/discount.model");
const { convertToObjectIdMongodb } = require("../utils");
const { findAllProducts } = require("../models/repositories/product.repo");
const {
    findAllDiscountCodesSelect,
    checkDiscountExists,
} = require("../models/repositories/discount.repo");

/**
 * Discount Services
 * 1. Generate Discount code [Shop | Admin] ok
 * 2. Get discount amount [User] ok
 * 3. Get all discount codes [User | Shop]
 * 4. Verify discount code [User]
 * 5. Delete discount code [Shop | Admin] ok
 * 6. Cancel discount code [User] ok
 */

class DiscountService {
    static async createDiscountCode(payload) {
        const {
            name,
            code,
            start_date,
            end_date,
            is_active,
            shopId,
            min_order_value,
            product_ids,
            applies_to,
            description,
            type,
            value,
            max_value,
            max_uses,
            uses_count,
            max_uses_per_user,
            users_used,
        } = payload;

        // check
        if (
            !(
                new Date() < new Date(start_date) &&
                new Date(start_date) < new Date(end_date)
            )
        ) {
            throw new BadRequestError("Discount code has expired!");
        }

        // create index for discount code
        const foundDiscount = await checkDiscountExists({
            model: discount,
            filter: {
                discount_code: code,
                discount_shopId: convertToObjectIdMongodb(shopId),
            },
        });

        if (foundDiscount && foundDiscount.discount_is_active) {
            throw new BadRequestError("Discount exists!");
        }

        const newDiscount = await discount.create({
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_code: code,
            discount_value: value,
            discount_min_order_value: min_order_value || 0,
            discount_max_value: max_value,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_users: max_uses,
            discount_uses_count: uses_count,
            discount_users_used: users_used,
            discount_shopId: shopId,
            discount_max_uses_per_user: max_uses_per_user,
            discount_is_active: is_active,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to === "all" ? [] : product_ids,
        });

        return newDiscount;
    }

    // get all discount codes available with products
    static async getAllDiscountCodeWithProduct({ code, shopId, limit, page }) {
        // create index for discount code
        limit = limit || 50;
        page = page || 1;
        const foundDiscount = await checkDiscountExists({
            model: discount,
            filter: {
                discount_code: code,
                discount_shopId: convertToObjectIdMongodb(shopId),
            },
        });

        if (!foundDiscount || !foundDiscount.discount_is_active) {
            throw new BadRequestError("Discount isn't exists!");
        }

        const { discount_applies_to, discount_product_ids } = foundDiscount;
        let products;
        if (discount_applies_to === "all") {
            products = await findAllProducts({
                filter: {
                    product_shop: convertToObjectIdMongodb(shopId),
                    isPublished: true,
                },
                limit: +limit,
                page: +page,
                sort: "ctime",
                select: ["product_name"],
            });
        }

        if (discount_applies_to === "specific") {
            products = await findAllProducts({
                filter: {
                    _id: { $in: discount_product_ids },
                    isPublished: true,
                },
                limit: +limit,
                page: +page,
                sort: "ctime",
                select: ["product_name"],
            });
        }

        return products;
    }

    // get all discount code of shop
    static async getAllDiscountCodeByShop({ limit, page, shopId }) {
        const discounts = await findAllDiscountCodesSelect({
            limit: limit || 50,
            page: page || 1,
            filter: {
                discount_shopId: convertToObjectIdMongodb(shopId),
                discount_is_active: true,
            },
            select: ["discount_name", "discount_code"],
            model: discount,
        });

        return discounts;
    }

    // apply discount code
    static async getDiscountAmount({ codeId, userId, shopId, products }) {
        const foundDiscount = await checkDiscountExists({
            model: discount,
            filter: {
                discount_code: codeId,
                discount_shopId: convertToObjectIdMongodb(shopId),
            },
        });

        if (!foundDiscount) {
            throw new NotFoundError("Discount isn't exists!");
        }

        const {
            discount_is_active,
            discount_max_users,
            discount_max_uses_per_user,
            discount_min_order_value,
            discount_users_used,
            discount_start_date,
            discount_end_date,
        } = foundDiscount;

        if (!discount_is_active) throw new NotFoundError("Discount expired!");
        if (!discount_max_users) throw new NotFoundError("Discounts were out!");

        if (
            new Date() < new Date(discount_start_date) ||
            new Date() > new Date(discount_end_date)
        ) {
            throw new NotFoundError("Discount expired!");
        }

        // check xem co set gia tri toi thieu khong
        let totalOrder = 0;
        if (discount_min_order_value > 0) {
            //get total
            totalOrder = products.reduce((acc, product) => {
                return acc + product.quantity * product.price;
            }, 0);

            if (totalOrder < discount_min_order_value) {
                throw new NotFoundError(
                    `Discount require minimum order value of ${discount_min_order_value}`
                );
            }
        }

        if (discount_max_uses_per_user > 0) {
            const userDiscount = discount_users_used.find(
                (user) => user.userId === userId
            );
            if (userDiscount) {
                //...Đoạn này đang dở, cần check xem mỗi user có thể sd max bao nhiêu lần mã discount
            }
        }

        //check discount fixed or percentage
        const amount =
            discount_type === "fixed_amount"
                ? discount_value
                : totalOrder * (discount_value / 100);

        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount,
        };
    }

    // Đây là cách xoá đơn giản nhấtn: Xoá trực tiếp khỏi db
    // Cách xoá khác ví dụ như : set thêm 1 attribute isDeleted: true or false, hoặc là lưu sang 1 collection khác ví dụ deletedDiscount
    static async deleteDiscountCode({ shopId, codeId }) {
        const foundDiscount = await checkDiscountExists({
            model: discount,
            filter: {
                discount_code: codeId,
                discount_shopId: convertToObjectIdMongodb(shopId),
            },
        });

        if (!foundDiscount) throw new NotFoundError("Discount doesn't exists!");

        // we have to do something before delete
        // example : find code is used somewhere? cancel it first

        const deleted = await discount.deleteOne({
            discount_code: foundDiscount.discount_code,
            discount_shopId: foundDiscount.discount_shopId,
        });

        return deleted;
    }

    static async cancelDiscountCode({ codeId, shopId, userId }) {
        const foundDiscount = await checkDiscountExists({
            model: discount,
            discount_shopId: convertToObjectIdMongodb(shopId),
        });

        if (!foundDiscount) throw new NotFoundError("Discount doesn't exist");

        const result = await discount.findByIdAndUpdate(foundDiscount._id, {
            $pull: {
                discount_users_used: userId,
            },
            $inc: {
                discount_max_uses: 1,
                discount_uses_count: -1,
            },
        });

        return result;
    }
}

module.exports = DiscountService;
