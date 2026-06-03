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

app.get("/", (req, res) => {
    res.redirect("/signup.html");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});