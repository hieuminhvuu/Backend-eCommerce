"use strict";

const winston = require("winston");

const { createLogger, format, transports } = require("winston");
require("winston-daily-rotate-file");
const { v4: uuidv4 } = require("uuid");

class MyLogger {
    constructor() {
        const formatPrint = format.printf(
            ({ level, message, context, requestId, timestamp, metadata }) => {
                return `[${timestamp}] :: ${level} :: ${context} :: ${requestId} :: ${message} :: ${JSON.stringify(
                    metadata
                )}`;
            }
        );

        this.logger = createLogger({
            format: format.combine(
                format.timestamp({ format: "YYYY-MM-DD hh:mm:ss" }),
                formatPrint
            ),
            transports: [
                new transports.Console(),
                new transports.DailyRotateFile({
                    dirname: "src/logs",
                    filename: "application-%DATE%.info.log",
                    datePattern: "YYYY-MM-DD-HH",
                    zippedArchive: true, // true => backup log zipped
                    maxSize: "20m", //dung luong file
                    maxFiles: "14d",
                    format: format.combine(
                        format.timestamp({ format: "YYYY-MM-DD hh:mm:ss" }),
                        formatPrint
                    ),
                    level: "info",
                }),
                new transports.DailyRotateFile({
                    dirname: "src/logs",
                    filename: "application-%DATE%.error.log",
                    datePattern: "YYYY-MM-DD-HH",
                    zippedArchive: true, // true => backup log zipped
                    maxSize: "10m", //dung luong file
                    maxFiles: "14d",
                    format: format.combine(
                        format.timestamp({ format: "YYYY-MM-DD hh:mm:ss" }),
                        formatPrint
                    ),
                    level: "error",
                }),
            ],
        });
    }

    commonParams(params) {
        let context, req, metadata;
        if (!Array.isArray(params)) {
            context = params;
        } else {
            [context, req, metadata] = params;
        }

        const requestId = req?.requestId || uuidv4();

        return {
            requestId,
            context,
            metadata,
        };
    }

    log(message, params) {
        const paramLog = this.commonParams(params);
        const logObject = Object.assign(
            {
                message,
            },
            paramLog
        );
        this.logger.info(logObject);
    }

    error(message, params) {
        const paramLog = this.commonParams(params);
        const logObject = Object.assign(
            {
                message,
            },
            paramLog
        );
        this.logger.error(logObject);
    }
}

module.exports = new MyLogger();
