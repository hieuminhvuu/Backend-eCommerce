"use strict";

const { SuccessResponse } = require("../core/success.response");
const NotificationService = require("../services/notification.service");

class NotificationController {
    listNotiByUser = async (req, res, next) => {
        new SuccessResponse({
            message: "Successful get list notification!",
            metadata: await NotificationService.listNotiByUser(req.query),
        }).send(res);
    };
}

module.exports = new NotificationController();
