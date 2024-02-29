const swaggerUi = require("swagger-ui-express");

const optionsOpenApi = require("./openapi.config");
const swaggerJsdoc = require("swagger-jsdoc");
const specs = swaggerJsdoc(optionsOpenApi);

const openApi = (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
    routeDefault(app);
};

const optionsSwagger = {
    swaggerOptions: {
        urls: [
            {
                url: "/api-docs/swagger.json",
                name: "Json",
            },
            {
                url: "/api-docs/swagger.yaml",
                name: "Yaml",
            },
        ],
    },
};

const routeDefault = (app) => {
    // setting router default
    app.use((req, res, next) => {
        if (req.url === "/") {
            res.redirect("/api-docs");
            return;
        }
        next();
    });
};

module.exports = {
    openApi,
};
