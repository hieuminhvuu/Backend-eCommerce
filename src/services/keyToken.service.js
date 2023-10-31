"use strict";

const keytokenModel = require("../models/keytoken.model");
// const { Types: { ObjectId } } = require("mongoose");
class KeyTokenService {
    static createKeyToken = async ({
        userId,
        publicKey,
        privateKey,
        refreshToken,
    }) => {
        try {
            // Lv 0
            // const tokens = await keytokenModel.create({
            //     user: userId,
            //     publicKey,
            //     privateKey,
            // });

            // Lv cao : đảm bảo tính atomic của mongoDB
            const filter = {
                    user: userId,
                },
                update = {
                    publicKey,
                    privateKey,
                    refreshTokensUsed: [],
                    refreshToken,
                },
                options = {
                    upsert: true,
                    new: true,
                };

            const tokens = await keytokenModel.findOneAndUpdate(
                filter,
                update,
                options
            );

            return tokens ? tokens.publicKey : null;
        } catch (error) {
            return error;
        }
    };

    static findByUserId = async (userId) => {
        // return await keytokenModel.findOne({ user: new ObjectId(userId) }).lean();
        return await keytokenModel.findOne({ user: userId });
    };

    static removeKeyById = async (id) => {
        // return await keytokenModel.deleteOne({ _id: new ObjectId(id) });
        return await keytokenModel.deleteOne(id);
    };
}

module.exports = KeyTokenService;
