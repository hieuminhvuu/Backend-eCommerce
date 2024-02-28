"use strict";

const { AuthFailureError } = require("../core/error.response");
const { listRole } = require("../services/rbac.service");
const rbac = require("./role.middleware");

/**
 *
 * @param {string} action //read, delete or update
 * @param {*} resource // profile, balance, ...
 */
const grantAccess = (action, resource) => {
    return async (req, res, next) => {
        try {
            rbac.setGrants(await listRole({}));
            const rol_name = req.query.role;
            const permission = rbac.can(rol_name)[action](resource);
            if (!permission.granted) {
                throw new AuthFailureError("Permission deny!");
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

module.exports = { grantAccess };
