const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "eCommerce RestFull API",
            version: "1.0.0",
            description: "Web eCommerce RestFull api",
        },
        servers: [
            {
                url: `http://localhost:${process.env.DEV_APP_PORT}`,
                description: "Development server",
            },
            {
                url: `http://localhost:${process.env.PRO_APP_PORT}`,
                description: "Product server",
            },
        ],
        components: {
            schemas: {
                RequestLogin: {
                    type: "object",
                    required: ["email", "password"],
                    properties: {
                        email: {
                            type: "string",
                            description: "The email of the shop",
                        },
                        password: {
                            type: "string",
                            description: "The password of the shop",
                        },
                    },
                    example: {
                        email: "hieuminhvuu@deptrai.com",
                        password: "abc123",
                    },
                },
                RequestRegister: {
                    type: "object",
                    required: ["name", "email", "password"],
                    properties: {
                        name: {
                            type: "string",
                            description: "The name of the shop",
                        },
                        email: {
                            type: "string",
                            description: "The email of the shop",
                        },
                        password: {
                            type: "string",
                            description: "The password of the shop",
                        },
                    },
                    example: {
                        name: "Vu Minh Hieu",
                        email: "hieuminhvuu@deptrai.com",
                        password: "abc123",
                    },
                },
            },
            responses: {
                400: {
                    description:
                        "Missing API key - include it in the Authorization header",
                    contents: "application/json",
                },
                401: {
                    description:
                        "Unauthorized - incorrect API key or incorrect format",
                    contents: "application/json",
                },
                404: {
                    description: "Not found",
                    contents: "application/json",
                },
            },
            securitySchemes: {
                authorization: {
                    type: "apiKey",
                    in: "header",
                    name: `authorization`,
                },
                "x-api-key": {
                    type: "apiKey",
                    in: "header",
                    name: "x-api-key",
                },
                "x-client-id": {
                    type: "apiKey",
                    in: "header",
                    name: "x-client-id",
                },
                "x-rtoken-id": {
                    type: "apiKey",
                    in: "header",
                    name: "x-rtoken-id",
                },
            },
        },
        security: [
            {
                apiKey: [],
            },
            {
                apiKey: [],
            },
            {
                apiKey: [],
            },
            {
                apiKey: [],
            },
        ],
    },
    apis: ["./src/routes/*/*.js"],
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

module.exports = options;
