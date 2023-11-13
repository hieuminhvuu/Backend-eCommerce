"use strict";

const { model, Schema } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "discounts";

const discountSchema = new Schema(
    {
        discount_name: {
            type: String,
            required: true,
        },
        discount_description: {
            type: String,
            required: true,
        },
        discount_type: {
            type: String,
            default: "fixed_amount", //percentage
            enum: ["fixed_amount", "percentage"],
        },
        discount_value: {
            type: Number,
            required: true,
        },
        discount_code: {
            type: String,
            require: true,
        },
        discount_start_date: {
            type: Date,
            require: true,
        },
        discount_end_date: {
            type: Date,
            require: true,
        },
        discount_max_uses: {
            //quantity discount
            type: Number,
            require: true,
        },
        discount_uses_count: {
            //quantity discount used
            type: Date,
            require: true,
        },
        discount_users_used: {
            // who used this code
            type: Array,
            default: [],
        },
        discount_max_uses_per_user: {
            // quantity discount max for each user
            type: Number,
            require: true,
        },
        discount_min_order_value: {
            type: Number,
            require: true,
        },
        discount_shopId: {
            type: Schema.Types.ObjectId,
            ref: "shop",
        },
        discount_is_active: {
            type: Boolean,
            default: "true",
        },
        discount_applies_to: {
            type: String,
            require: true,
            enum: ["all", "specific"],
        },
        discount_product_ids: {
            // which product can be apply
            type: Array,
            default: [],
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

//Export the model
module.exports = model(DOCUMENT_NAME, discountSchema);
