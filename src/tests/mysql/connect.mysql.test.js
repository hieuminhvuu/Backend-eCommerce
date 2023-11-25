const mysql = require("mysql2");

//Perform a sample operation
//pool.query("SELECT 1 + 1 AS solution", function (err, results) {
pool.query("SELECT * FROM users", function (err, results) {
    if (err) throw err;
    console.log(`Query result: `, results);

    //Close pool connection
    pool.end((err) => {
        if (err) throw err;
        console.log(`Connection closed!`);
    });
});
