"use strict";

const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "Notification";
const COLLECTION_NAME = "Notifications";

// ORDER-001 : successful
// ORDER-002 : order failed
// PROMOTION-001 : new promotion
// SHOP-001 : new product by user following

const notificationSchema = new Schema(
    {
        noti_type: {
            type: String,
            enum: ["ORDER-001", "ORDER-002", "PROMOTION-001", "SHOP-001"],
            require: true,
        },
        noti_senderId: {
            type: Schema.Types.ObjectId,
            require: true,
            ref: "Shop",
        },
        noti_receivedId: {
            type: Number,
            require: true,
        },
        noti_content: {
            type: String,
            require: true,
        },
        noti_options: {
            type: Object,
            default: {},
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

//Export the model
module.exports = model(DOCUMENT_NAME, notificationSchema);
