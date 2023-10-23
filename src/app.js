const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const app = express();

// init middlewares
// app.use(morgan("combined")); //using when produce
app.use(morgan("dev")); //using when develop
app.use(helmet());
app.use(compression());

// init db

// init routes

// handling error

module.exports = app;
