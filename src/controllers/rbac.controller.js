"use strict";

const { SuccessResponse } = require("../core/success.response");
const {
    createResource,
    createRole,
    listRole,
    listResource,
} = require("../services/rbac.service");

/**
 * @description Create a new role
 * @param {string} name
 * @param {*} res
 * @param {*} next
 */
const newRole = async (req, res, next) => {
    new SuccessResponse({
        message: "Create Role",
        metadata: await createRole(req.body),
    }).send(res);
};

const newResource = async (req, res, next) => {
    new SuccessResponse({
        message: "Create Resource",
        metadata: await createResource(req.body),
    }).send(res);
};

const roleList = async (req, res, next) => {
    new SuccessResponse({
        message: "Get list Role",
        metadata: await listRole(req.body),
    }).send(res);
};

const resourceList = async (req, res, next) => {
    new SuccessResponse({
        message: "Get list Resource",
        metadata: await listResource(req.body),
    }).send(res);
};

module.exports = { newRole, newResource, roleList, resourceList };
