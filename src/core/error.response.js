"use strict";

const { StatusCodes, ReasonPhrases } = require("../utils/httpStatusCode");
const myLogger = require("../loggers/mylogger.log");
const { logger } = require("../loggers/winston");

class ErrorResponse extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;

        // log the error using winston
        logger.error(`${this.status} - ${this.message}`);

        // custom
        myLogger.error(this.message, [
            "/api/v1/???",
            "vvmmhh234234",
            { error: "error ??????" },
        ]);
    }
}

class ConflictRequestError extends ErrorResponse {
    constructor(
        message = ReasonPhrases.CONFLICT,
        status = StatusCodes.FORBIDDEN
    ) {
        super(message, status);
    }
}

class BadRequestError extends ErrorResponse {
    constructor(
        message = ReasonPhrases.BAD_REQUEST,
        status = StatusCodes.BAD_REQUEST
    ) {
        super(message, status);
    }
}

class AuthFailureError extends ErrorResponse {
    constructor(
        message = ReasonPhrases.UNAUTHORIZED,
        status = StatusCodes.UNAUTHORIZED
    ) {
        super(message, status);
    }
}

class NotFoundError extends ErrorResponse {
    constructor(
        message = ReasonPhrases.NOT_FOUND,
        status = StatusCodes.NOT_FOUND
    ) {
        super(message, status);
    }
}

class ForbiddenError extends ErrorResponse {
    constructor(
        message = ReasonPhrases.FORBIDDEN,
        status = StatusCodes.FORBIDDEN
    ) {
        super(message, status);
    }
}

module.exports = {
    ConflictRequestError,
    BadRequestError,
    AuthFailureError,
    NotFoundError,
    ForbiddenError,
};
