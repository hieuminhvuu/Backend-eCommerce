"use strict";

const express = require("express");
const uploadController = require("../../controllers/upload.controller");
const router = express.Router();
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const { uploadDisk, uploadMemory } = require("../../configs/multer.config");

// router.use(authentication);

router.post("/product", asyncHandler(uploadController.uploadFile));
router.post(
    "/product/thumb",
    uploadDisk.single("file"),
    asyncHandler(uploadController.uploadFileThumb)
);
router.post(
    "/product/multiple",
    uploadDisk.array("files", 3),
    asyncHandler(uploadController.uploadImagesFromLocal)
);

// upload s3
router.post(
    "/product/bucket",
    uploadMemory.single("file"),
    asyncHandler(uploadController.uploadImageFromLocalS3)
);

module.exports = router;
