console.log("Starting the TypeScript app...");

import "reflect-metadata";
import  express from "express"
import * as dotenv from 'dotenv';
dotenv.config();
import "./infrastructure/config/di.ts";
import { connectDB } from "./config/database";
// import { fileURLToPath } from 'url';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import userRoutes from './interfaces/routes/authRoutes';
import adminRoutes from './interfaces/routes/adminRoutes';
import providerRoutes from './interfaces/routes/providerRoutes'
import path from 'path';
const app= express()

//  middlewares
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,  // Allow cookies (like JWT tokens) to be sent
}));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
 
  next();
});
app.use(bodyParser.json());

//  routes
app.use('/api', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/provider', providerRoutes);
//for upload path
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// app.use(
//   '/uploads',
//   express.static(path.join(__dirname, '..', 'public', 'uploads'))
// );

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});
