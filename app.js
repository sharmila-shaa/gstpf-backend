// require("dotenv").config();

// const express = require("express");
// const cors = require("cors");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const pool = require("./neon");



// const app = express();

// app.use(cors());
// app.use(express.json());
// const path = require("path");

// app.use(express.static(path.join(__dirname, "public")));
// app.use(express.static("sign"));

// const JWT_SECRET = "gstp_secret_key";

// /* SIGNUP */
// app.post("/api/signup", async (req, res) => {
//     try {
//         const { name, email, password } = req.body;

//         const hashedPassword = await bcrypt.hash(password, 10);

//         await pool.query(
//             `
//             INSERT INTO users (name, email, password)
//             VALUES ($1, $2, $3)
//             `,
//             [name, email, hashedPassword]
//         );

//         res.json({
//             success: true,
//             message: "Signup successful"
//         });

//     } catch (err) {
//         res.status(500).json({
//             success: false,
//             message: err.message
//         });
//     }
// });

// /* LOGIN */
// app.post("/api/login", async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         const result = await pool.query(
//             `
//             SELECT *
//             FROM users
//             WHERE email = $1
//             `,
//             [email]
//         );

//         if (result.rows.length === 0) {
//             return res.json({
//                 success: false,
//                 message: "Invalid email"
//             });
//         }

//         const user = result.rows[0];

//         const isMatch = await bcrypt.compare(password, user.password);

//         if (!isMatch) {
//             return res.json({
//                 success: false,
//                 message: "Invalid password"
//             });
//         }

//         const token = jwt.sign(
//             { id: user.id, email: user.email },
//             JWT_SECRET,
//             { expiresIn: "1d" }
//         );

//         res.json({
//             success: true,
//             message: "Login successful",
//             token
//         });

//     } catch (err) {
//         res.status(500).json({
//             success: false,
//             message: err.message
//         });
//     }
// });

// /* SEARCH GSTP */
// app.get("/api/search", async (req, res) => {
//     try {
//         const { name, state, district, pincode } = req.query;

//         let query = `
//             SELECT *
//             FROM gst_practitioners
//             WHERE 1 = 1
//         `;

//         const values = [];

//         if (name) {
//             values.push(`%${name}%`);
//             query += ` AND name ILIKE $${values.length}`;
//         }

//         if (state) {
//     values.push(state);
//     query += ` AND (state_code = $${values.length} OR state_name ILIKE $${values.length})`;
// }

// if (district) {
//     values.push(district);
//     query += ` AND (district_code = $${values.length} OR district_name ILIKE $${values.length})`;
// }

//         if (pincode) {
//             values.push(pincode);
//             query += ` AND pincode = $${values.length}`;
//         }
        

//         query += ` ORDER BY id DESC`;

//         const result = await pool.query(query, values);

//         res.json(result.rows);

//     } catch (err) {
//         res.status(500).json({
//             error: err.message
//         });
//     }
// });

// app.listen(3000, () => {
//     console.log("Server running on http://localhost:3000");
// });
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./backend/config/routes/auth.routes");
const gstpRoutes = require("./backend/config/routes/gstp.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use("/api/auth", authRoutes);
app.use("/api/gstp", gstpRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});