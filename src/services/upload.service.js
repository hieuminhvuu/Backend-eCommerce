"use strict";

const cloudinary = require("../configs/cloudinary.config");

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
};
