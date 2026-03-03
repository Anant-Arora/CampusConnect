import "dotenv/config";
import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import postRoutes from "./routes/posts";
import opportunityRoutes from "./routes/opportunities";
import messageRoutes from "./routes/messages";
import notificationRoutes from "./routes/notifications";
import searchRoutes from "./routes/search";
import uploadRoutes from "./routes/upload";
import { errorMiddleware } from "./middleware/errorMiddleware";

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:8080'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", postRoutes);
app.use("/api", opportunityRoutes);
app.use("/api", messageRoutes);
app.use("/api", notificationRoutes);
app.use("/api", searchRoutes);
app.use("/api", uploadRoutes);

app.use((_req, res) => res.status(404).json({ success: false, error: "Not found" }));
app.use(errorMiddleware);

const port = Number(process.env.PORT ?? 5000) || 5000;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`CampusConnect API running on port ${port}`);
});

