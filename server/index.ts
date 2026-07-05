import fs from "node:fs";
import path from "node:path";
import { createApp } from "./app";

// Load .env file if it exists
const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  try {
    process.loadEnvFile(envPath);
  } catch (err) {
    console.error("Failed to load .env file:", err);
  }
}

const port = Number(process.env.PORT) || 3001;
const app = createApp();

app.listen(port, () => {
  console.log(`Pulse Board API listening on http://localhost:${port}`);
});
