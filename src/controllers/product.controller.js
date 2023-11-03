"use strict";

const ProductService = require("../services/product.service");
const { SuccessResponse } = require("../core/success.response");

class ProductController {
    createProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "Create new Product success!",
            metadata: await ProductService.createProduct(
                req.body.product_type,
                {
                    ...req.body,
                    product_shop: req.user.userId,
                }
            ),
        }).send(res);
    };

    publishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Publish Product by Shop success!",
            metadata: await ProductService.publishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id,
            }),
        }).send(res);
    };

    unPublishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Unpublish Product by Shop success!",
            metadata: await ProductService.unPublishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id,
            }),
        }).send(res);
    };

    // QUERY //
    /**
     * @description Get all Drafts for shop
     * @param {Number} limit
     * @param {Number} skip
     * @return {JSON}
     */
    getAllDraftsForShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Get list Draft success!",
            metadata: await ProductService.findAllDraftForShop({
                product_shop: req.user.userId,
            }),
        }).send(res);
    };

    /**
     * @description Get all Publishes for shop
     * @param {Number} limit
     * @param {Number} skip
     * @return {JSON}
     */
    getAllPublishForShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Get list Publish success!",
            metadata: await ProductService.findAllPublishForShop({
                product_shop: req.user.userId,
            }),
        }).send(res);
    };

    getListSearchProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "Get list Search Product success!",
            metadata: await ProductService.searchProduct(req.params),
        }).send(res);
    };
    // END QUERY //
}

module.exports = new ProductController();
