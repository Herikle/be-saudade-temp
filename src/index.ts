import express from "express";
import cors from "cors";
import { router } from "./routes";
import 'dotenv/config';


const app = express();

const allowedOrigins = (process.env.CORS_ORIGINS ?? "*")
  .split(",")
  .map((v) => v.trim())
  .filter(Boolean);

const corsMiddleware = cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes("*")) return callback(null, true);
    return callback(null, allowedOrigins.includes(origin));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

app.use(corsMiddleware);
app.options("*", corsMiddleware);

app.use(router);

const port = Number(process.env.PORT ?? 8080);
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
