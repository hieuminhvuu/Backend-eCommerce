"use strict";

const crypto = require("crypto");
const cloudinary = require("../configs/cloudinary.config");
const {
    s3,
    PutObjectCommand,
    GetObjectCommand,
    DeleteBucketCommand,
} = require("../configs/s3.config");
// const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { getSignedUrl } = require("@aws-sdk/cloudfront-signer"); // CJS

/// upload file use S3Client ///

const randomImageName = () => crypto.randomBytes(16).toString("hex");

const uploadImageFromLocalS3 = async ({ file }) => {
    try {
        const imageName = randomImageName();
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: imageName,
            Body: file.buffer,
            ContentType: "image/jpeg", // needed!
        });

        const result = await s3.send(command);
        console.log("result::", result);

        // const singedUrl = new GetObjectCommand({
        //     Bucket: process.env.AWS_BUCKET_NAME,
        //     Key: imageName,
        // });

        // export url
        // const url = await getSignedUrl(s3, singedUrl, { expiresIn: 3600 });

        // export url with cloudfront
        const url = getSignedUrl({
            url: `${process.env.AWS_CLOUDFRONT_URL_DOMAIN_NAME}/${imageName}`,
            keyPairId: process.env.AWS_PUBLIC_KEY_ID,
            dateLessThan: new Date(Date.now() + 1000 * 60),
            privateKey: process.env.AWS_PRIVATE_KEY,
        });

        console.log(`url::`, url);

        return { url, result };
    } catch (error) {
        console.error("Error uploading image use S3Client::", error);
    }
};

/// END S3 Service ///

// 1. Upload from url image
const uploadImageFromUrl = async () => {
    try {
        const urlImage =
            "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Yasuo_57.jpg";
        const folderName = "product/shopId(123)",
            newFileName = "testDemo";
        const result = await cloudinary.uploader.upload(urlImage, {
            public_id: newFileName,
            folder: folderName,
        });
        return result;
    } catch (error) {
        console.error("Error uploading image::", error);
    }
};

// 2. Upload image from local
const uploadImageFromLocal = async ({ path, folderName = "product/2106" }) => {
    try {
        const result = await cloudinary.uploader.upload(path, {
            public_id: "thumb",
            folder: folderName,
        });
        return {
            image_url: result.secure_url,
            shopId: 2106,
            thumb_url: await cloudinary.url(result.public_id, {
                height: 100,
                width: 100,
                format: "jpg",
            }),
        };
    } catch (error) {
        console.error("Error uploading image::", error);
    }
};

// 3. Upload images from local
const uploadImagesFromLocal = async ({
    files,
    folderName = "product/2106",
}) => {
    try {
        console.log(`files::`, files, folderName);
        if (!files.length) return;
        const uploadUrls = [];
        for (const file of files) {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: folderName,
            });

            uploadUrls.push({
                image_url: result.secure_url,
                shopId: 2106,
                thumb_url: await cloudinary.url(result.public_id, {
                    height: 100,
                    width: 100,
                    format: "jpg",
                }),
            });
        }

        return uploadUrls;
    } catch (error) {
        console.error("Error uploading image::", error);
    }
};

module.exports = {
    uploadImageFromUrl,
    uploadImageFromLocal,
    uploadImagesFromLocal,
    uploadImageFromLocalS3,
};
