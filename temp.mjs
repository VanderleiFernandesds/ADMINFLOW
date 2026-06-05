import db from "./db.js"; const [rows] = await db.query("SHOW COLUMNS FROM users"); console.log(JSON.stringify(rows, null, 2));
