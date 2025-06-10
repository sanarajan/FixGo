import "reflect-metadata";
import express from "express";
import * as dotenv from "dotenv";
dotenv.config();
import "./infrastructure/config/di";
import { connectDB } from "./config/database";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import userRoutes from "./interfaces/routes/authRoutes";
import adminRoutes from "./interfaces/routes/adminRoutes";
import providerRoutes from "./interfaces/routes/providerRoutes";
import stripeRoutes from "./interfaces/routes/stripeRoute";
import path from "path";
// Register ts-node loader for ESM
const app = express();

//  middlewares
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // Allow cookies (like JWT tokens) to be sent
  })
);
app.use("/api", stripeRoutes);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  next();
});
app.use(bodyParser.json());

app.use(
  "/uploads",
  express.static(path.join(__dirname, "..", "public", "uploads"))
);
app.use(
  "/asset",
  express.static(path.join(__dirname, "..", "public", "asset"))
);
//  routes
app.use("/api", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/provider", providerRoutes);

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});
