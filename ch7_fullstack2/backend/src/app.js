const express = require("express");
const cors = require("cors");
const typeRoutes = require("./routes/typeRoutes");
const menuRoutes = require("./routes/menuRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root welcome / healthcheck route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Restaurant Backend API is running." });
});

// Routes
app.use("/api/type", typeRoutes);
app.use("/api/menu", menuRoutes);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

module.exports = app;
