"use strict";

const { BadRequestError } = require("../core/error.response");
const { SuccessResponse } = require("../core/success.response");
const {
    uploadImageFromUrl,
    uploadImageFromLocal,
    uploadImagesFromLocal,
    uploadImageFromLocalS3,
} = require("../services/upload.service");

class UploadController {
    uploadFile = async (req, res, next) => {
        new SuccessResponse({
            message: "Successful upload!",
            metadata: await uploadImageFromUrl(),
        }).send(res);
    };

    uploadFileThumb = async (req, res, next) => {
        const { file } = req;
        if (!file) throw new BadRequestError("File missing!");
        new SuccessResponse({
            message: "Successful upload thumb!",
            metadata: await uploadImageFromLocal({
                path: file.path,
            }),
        }).send(res);
    };

    uploadImagesFromLocal = async (req, res, next) => {
        const { files } = req;
        if (!files.length) throw new BadRequestError("File missing!");
        new SuccessResponse({
            message: "Successful upload images!",
            metadata: await uploadImagesFromLocal({
                files,
            }),
        }).send(res);
    };

    // use S3
    uploadImageFromLocalS3 = async (req, res, next) => {
        const { file } = req;
        if (!file) throw new BadRequestError("File missing!");
        new SuccessResponse({
            message: "Upload successfully use S3Client",
            metadata: await uploadImageFromLocalS3({
                file,
            }),
        }).send(res);
    };
}

module.exports = new UploadController();
