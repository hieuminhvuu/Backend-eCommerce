"use strict";

// !dmbg
const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "Role";
const COLLECTION_NAME = "Roles";

// Declare the Schema of the Mongo model
var roleSchema = new Schema(
    {
        rol_name: {
            type: String,
            default: "user",
            enum: ["user", "shop", "admin"],
        },
        rol_slug: { type: String, require: true },
        rol_status: {
            type: String,
            default: "active",
            enum: ["active", "block", "pending"],
        },
        rol_description: { type: String, default: "" },
        rol_grants: [
            {
                resource: {
                    type: Schema.Types.ObjectId,
                    ref: "Resource",
                    required: true,
                },
                actions: [{ type: String, required: true }],
                attributes: { type: String, default: "*" },
            },
        ],
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

//Export the model
module.exports = model(DOCUMENT_NAME, roleSchema);
