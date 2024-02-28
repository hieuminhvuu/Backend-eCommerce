"use strict";

// !dmbg
const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "Resource";
const COLLECTION_NAME = "Resources";

// Declare the Schema of the Mongo model
var resourceSchema = new Schema(
    {
        src_name: { type: String, require: true },
        src_slug: { type: String, require: true },
        src_description: { type: String, default: "" },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

//Export the model
module.exports = model(DOCUMENT_NAME, resourceSchema);
