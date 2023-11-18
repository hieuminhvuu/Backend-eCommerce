"use strict";

const { SuccessResponse } = require("../core/success.response");
const CommentService = require("../services/comment.service");

class CommentController {
    createComment = async (req, res, next) => {
        new SuccessResponse({
            message: "Successful create a Comment!",
            metadata: await CommentService.createComment(req.body),
        }).send(res);
    };

    getCommentsByParentId = async (req, res, next) => {
        new SuccessResponse({
            message: "Successful get comments!",
            metadata: await CommentService.getCommentsByParentId(req.query),
        }).send(res);
    };

    deleteComment = async (req, res, next) => {
        new SuccessResponse({
            message: "Successful delete comments!",
            metadata: await CommentService.deleteComment(req.body),
        }).send(res);
    };
}

module.exports = new CommentController();
