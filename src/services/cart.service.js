"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const cart = require("../models/cart.model");
const { convertToObjectIdMongodb } = require("../utils");
const {
    createUserCart,
    updateUserProductQuantity,
    updateUserCart_products,
} = require("../models/repositories/cart.repo");
const { getProductByIdSelect } = require("../models/repositories/product.repo");

/**
 * Key features: Cart service
 *
 * -    add product to cart [User] ok
 * -    increase product quantity [User] ok
 * -    get cart [User] ok
 * -    delete cart [User]
 * -    delete cart item [User]
 */

class CartService {
    static async addToCart({ userId, product = {} }) {
        const { productId } = product;
        const foundProduct = await getProductByIdSelect({
            productId,
            select: ["product_name", "product_shop"],
        });
        product = { ...product, ...foundProduct };

        if (!foundProduct) throw new NotFoundError("Product not found!");

        // check cart exists?
        const userCart = await cart.findOne({ cart_userId: userId });
        if (!userCart) {
            // create cart for User
            return await createUserCart({ userId, product });
        }

        // if cart exists but empty?
        if (!userCart.cart_products.length) {
            userCart.cart_products = [product];

            return await userCart.save();
        }

        //if cart exists and includes this product => update quantity product in this cart
        // if cart exists and doesn't include this product => update cart_products in this cart
        if (
            userCart.cart_products.some(
                (obj) => obj.productId === product.productId
            )
        ) {
            return await updateUserProductQuantity({ userId, product });
        } else {
            return await updateUserCart_products({ userId, product });
        }
    }

    // Update cart
    /*
        userId,
        shop_order_ids: [
            {
                item_products: [
                    {
                        quantity,
                        old_quantity,
                        productId
                    }
                ],
                version
            }
        ]
    */
    static async changeQuantityProduct({ userId, shop_order_ids }) {
        const { productId, quantity, old_quantity } =
            shop_order_ids[0]?.item_products[0];
        // check product
        const foundProduct = await getProductByIdSelect({
            productId,
            select: ["product_name", "product_shop"],
        });

        if (!foundProduct) throw new NotFoundError("Product not exists!");

        if (quantity === 0) {
            return await CartService.deleteUserCard({ userId, productId });
        }

        return await updateUserProductQuantity({
            userId,
            product: {
                productId,
                quantity: quantity - old_quantity,
            },
        });
    }

    static async deleteUserCard({ userId, productId }) {
        const query = { cart_userId: userId, cart_state: "active" },
            updateSet = {
                $pull: {
                    cart_products: {
                        productId,
                    },
                },
            };

        // Đây là phương thức xoá đơn giản nhất, chúng ta có thể xoá bằng cách lưu vào một collection khác để tracking người dùng trong một hệ thống đủ lớn
        // Tracking người dùng rất là quan trọng, ví dụ khi một sản phẩm bị xoá khỏi giỏ hàng của người dùng rồi nhưng sau đó 1 thời gian sản phẩm có khuyến mãi lớn, ưu tin recommend tới những ai đã từng add vào cart
        const deleteCart = await cart.updateOne(query, updateSet);

        return deleteCart;
    }

    static async gitListUserCart({ userId }) {
        return await cart
            .findOne({
                cart_userId: userId,
            })
            .lean();
    }
}

module.exports = CartService;
