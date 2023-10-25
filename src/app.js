require("dotenv").config();

const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const app = express();

// init middlewares
// app.use(morgan("combined")); //using when production
app.use(morgan("dev")); //using when develop
app.use(helmet());
app.use(compression());

// init db
require("./dbs/init.mongodb");

// init routes

// handling error

module.exports = app;
