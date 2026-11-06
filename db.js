
const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Palla@2006",
    database: "pallavi job portal"
});

db.connect((err) => {
    if (err) {
        console.error("MySQL Connection Failed:", err.message);
        return;
    }

    console.log("Connected to MySQL Database Successfully!");
});

module.exports = db;
