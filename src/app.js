require("dotenv").config();

const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const app = express();
const { v4: uuidv4 } = require("uuid");
const myLogger = require("./loggers/mylogger.log");
const cors = require("cors");

// cors
const corsOptions = {
    origin: "http://localhost:3000",
    method: "GET, HEAD, PUT, PATCH, POST, DELETE",
    credentials: true,
    optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// init middlewares
// app.use(morgan("combined")); //using when production
app.use(morgan("dev")); //using when develop
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

// logging : info
app.use((req, res, next) => {
    const requestId = req.headers["x-request-id"];
    req.requestId = requestId ? requestId : uuidv4();
    myLogger.log(`Input params :: ${req.method} :: `, [
        req.path,
        { requestId: req.requestId },
        req.method === "POST" ? req.body : req.query,
    ]);

    next();
});

// init db
require("./dbs/init.mongodb");

// init routes
app.use("/", require("./routes"));

// handling error
app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    const statusCode = error.status || 500;

    // logging : error
    const resMessage = `${error.status} - ${
        Date.now() - error.now
    }ms - Response: ${JSON.stringify(error)}`;
    myLogger.error(resMessage, [
        req.path,
        { requestId: req.requestId },
        {
            message: error.message,
        },
    ]);

    return res.status(statusCode).json({
        status: "error",
        code: statusCode,
        stack: error.stack, //turn on when develop
        message: error.message || "Internal Server Error",
    });
});

module.exports = app;
