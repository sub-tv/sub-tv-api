import { config } from "dotenv";
config();

import pino from "express-pino-logger";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();

app.use(cors());
app.use(pino());
app.use(bodyParser.json());

const port = 3000;

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

export { app };
