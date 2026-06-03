require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const gstpRoutes = require("./routes/gstp.routes");

const app = express();

const allowedOrigins = [
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin(origin, callback) {
        // Allow tools such as Bruno and browser requests with an approved origin
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error("Blocked by CORS policy"));
    }
}));

app.use(express.json());

// Backend status route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "GST Practitioner backend is running"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/gstp", gstpRoutes);

const PORT = process.env.PORT || 3000;

// Required for Vercel
module.exports = app;

// Required for local development
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Backend server running on http://localhost:${PORT}`);
    });
}