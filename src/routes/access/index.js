"use strict";

const express = require("express");
const accessController = require("../../controllers/access.controller");
const router = express.Router();
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");

/**
 * @swagger
 *   /v1/api/shop/signup:
 *     post:
 *       summary: Shop register
 *       tags: [Auth]
 *       security: [{x-api-key: []}]
 *       requestBody:
 *          description: Request Register info
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/RequestRegister'
 *       responses:
 *         "400":
 *           $ref: '#/components/responses/400'
 *         "401":
 *           $ref: '#/components/responses/401'
 *         "200":
 *           description: Register response info
 *           contents:
 *             application/json
 */
router.post("/shop/signup", asyncHandler(accessController.signUp));

/**
 * @swagger
 *   /v1/api/shop/login:
 *     post:
 *       summary: Shop login
 *       tags: [Auth]
 *       security: [{x-api-key: []}]
 *       requestBody:
 *          description: Request login info
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/RequestLogin'
 *       responses:
 *         "400":
 *           $ref: '#/components/responses/400'
 *         "401":
 *           $ref: '#/components/responses/401'
 *         "200":
 *           description: Login response info
 *           contents:
 *             application/json
 */
router.post("/shop/login", asyncHandler(accessController.login));

// authentication
router.use(authentication);

/**
 * @swagger
 *   /v1/api/shop/logout:
 *     post:
 *       summary: Shop logout
 *       tags: [Auth]
 *       security: [{x-api-key: []}, {authorization: []}, {x-client-id: []}]
 *       responses:
 *         "400":
 *           $ref: '#/components/responses/400'
 *         "401":
 *           $ref: '#/components/responses/401'
 *         "200":
 *           description: Logout successful
 *           contents:
 *             application/json
 */
router.post("/shop/logout", asyncHandler(accessController.logout));

/**
 * @swagger
 *   /v1/api/shop/handleRefreshToken:
 *     post:
 *       summary: Refresh Token
 *       tags: [Auth]
 *       security: [{x-api-key: []}, {x-rtoken-id: []}, {x-client-id: []}]
 *       responses:
 *         "400":
 *           $ref: '#/components/responses/400'
 *         "401":
 *           $ref: '#/components/responses/401'
 *         "200":
 *           description: Refresh token successful
 *           contents:
 *             application/json
 */
router.post(
    "/shop/handleRefreshToken",
    asyncHandler(accessController.handleRefreshToken)
);

module.exports = router;
