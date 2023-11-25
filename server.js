const app = require("./src/app");

const {
    app: { port },
} = require("./src/configs/mongodb.config");

const server = app.listen(port, () => {
    console.log(`Server started with port ${port}`);
});

// process.on("SIGINT", () => {
//     server.close(() => console.log("Exit server."));
// });
