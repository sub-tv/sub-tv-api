import { config } from "dotenv";
config();
import pino from "express-pino-logger";
import express, { Response, Request, NextFunction } from "express";
import cors from "cors";
import bodyParser from "body-parser";

import apiRoutes from "./routes/api";

const port = 3000;

const app = express();

app.use(cors());
app.use(pino());
app.use(bodyParser.json());

// @ts-ignore
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: err.message });
});

app.use("/api", apiRoutes);

app.use("/", async (_, res) => {
  res.json({ health: "ok" });
});

app.listen(port, () => console.log(`Sub-tv API running on port: ${port}!`));
