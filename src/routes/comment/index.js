"use strict";

const express = require("express");
const commentController = require("../../controllers/comment.controller");
const router = express.Router();
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");

router.get("", asyncHandler(commentController.getCommentsByParentId));

router.use(authentication);

router.post("", asyncHandler(commentController.createComment));
router.delete("", asyncHandler(commentController.deleteComment));

module.exports = router;
