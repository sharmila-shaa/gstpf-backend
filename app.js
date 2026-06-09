require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const gstpRoutes = require("./routes/gstp.routes");

const app = express();

const allowedOrigins = [
    // Old deployed HTML frontend
    "https://gstpf-frontend-v.vercel.app",
    "https://gstpf-frontend.vercel.app",

    // Old HTML Live Server
    "http://localhost:5500",
    "http://127.0.0.1:5500",

    // New Vue + Vite frontend
    "http://localhost:5173",
    "http://127.0.0.1:5173",

    // Deployed Vue frontend URL from .env
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(
    cors({
        origin(origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(new Error("Blocked by CORS policy"));
        }
    })
);

app.use(express.json());

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

// Required only for local development
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Backend server running on http://localhost:${PORT}`);
    });
}