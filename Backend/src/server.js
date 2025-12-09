import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import startRoutes from "./routes/startRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

dotenv.config();

const app = express();
const PORT = 9990;

app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/start", startRoutes);
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running on port 9990!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
