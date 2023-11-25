const mysql = require("mysql2");

const pool = mysql.createPool({
    host: "localhost",
    port: 8811,
    user: "root",
    password: "password",
    database: "test",
});

const batchSize = 10000; //adjust batch size
const totalSize = 1000000; //adjust total size

let currentId = 1;

console.time(`::::::TIMER:::`);
const insertBatch = async () => {
    const values = [];
    for (let i = 0; i < batchSize && currentId <= totalSize; i++) {
        const name = `name-${currentId}`,
            age = currentId,
            address = `address-${currentId}`;
        values.push([currentId, name, age, address]);
        currentId++;
    }

    if (!values.length) {
        console.timeEnd(`::::::TIMER:::`);
        pool.end((err) => {
            if (err) {
                console.log("Error occurred while running batch!");
            } else {
                console.log("Connect pool closed successfully!");
            }
        });
        return;
    }

    const sql = `INSERT INTO test_table (id, name, age, address)  VALUES ?`;

    pool.query(sql, [values], async function (err, results) {
        if (err) throw err;
        console.log(`Inserted ${results.affectedRows} records!`);
        await insertBatch();
    });
};

insertBatch().catch(console.error);
