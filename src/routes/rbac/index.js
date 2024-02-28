"use strict";

const express = require("express");
const {
    newRole,
    newResource,
    roleList,
    resourceList,
} = require("../../controllers/rbac.controller");
const router = express.Router();
const { asyncHandler } = require("../../helpers/asyncHandler");
// const { authentication } = require("../../auth/authUtils");

// router.use(authentication);

router.post("/role", asyncHandler(newRole));
router.post("/resource", asyncHandler(newResource));

router.get("/roles", asyncHandler(roleList));
router.get("/resources", asyncHandler(resourceList));

module.exports = router;
