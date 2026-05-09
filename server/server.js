import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { seedDatabase } from "./models/pincode.model.js";
import { getAreaPincodes } from "./controllers/pincode.controller.js";
import pincodeRoutes from "./routes/pincode.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5020;

// Basic middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Bangalore Pincode Explorer API" });
});

app.use("/api/pincodes", pincodeRoutes);
app.get("/api/areas/:area", getAreaPincodes);

// Error handlers
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ success: false, message: "Server error" });
});

// Start server
const startServer = async () => {
  await connectDB();
  await seedDatabase();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();

export default app;
