require("dotenv").config();
console.log("DATABASE_URL =", process.env.DATABASE_URL);
const pool = require("./neon");

async function test() {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("Connected!");
    console.log(result.rows[0]);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}


console.log(process.cwd());
console.log(process.env);

test();