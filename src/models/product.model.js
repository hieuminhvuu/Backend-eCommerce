"use strict";

const { model, Schema, Types } = require("mongoose");

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

// Declare the Schema of the Mongo model
const productSchema = Schema(
    {
        product_name: {
            type: String,
            required: true,
        },
        product_thumb: {
            type: String,
            required: true,
        },
        product_description: String,
        product_price: {
            type: Number,
            required: true,
        },
        product_quantity: {
            type: Number,
            require: true,
        },
        product_type: {
            type: String,
            require: true,
            enum: ["Electronics", "Clothing", "Furniture"],
        },
        product_shop: {
            type: Schema.Types.ObjectId,
            ref: "Shop",
        },
        product_attributes: {
            type: Schema.Types.Mixed,
            require: true,
        },
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    }
);

const clothingSchema = new Schema(
    {
        brand: { type: String, require: true },
        size: String,
        material: String,
    },
    {
        collection: "clothes",
        timestamps: true,
    }
);

const electronicSchema = new Schema(
    {
        manufacturer: { type: String, require: true },
        model: String,
        color: String,
    },
    {
        collection: "electronics",
        timestamps: true,
    }
);

const furnitureSchema = new Schema(
    {
        brand: { type: String, require: true },
        size: String,
        material: String,
    },
    {
        collection: "furnitures",
        timestamps: true,
    }
);

module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    electronic: model("Electronics", electronicSchema),
    clothing: model("Clothing", clothingSchema),
    furniture: model("Furniture", furnitureSchema),
};
