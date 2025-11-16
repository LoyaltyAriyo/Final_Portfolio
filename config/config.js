import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load .env from the project root so starting the server from subdirectories
// (e.g., client npm scripts) still reads the same environment variables.
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || "YOUR_secret_key",
  mongoUri: process.env.MONGODB_URI || "mongodb://localhost:27017/MyPortfolio",
};

export default config;
