import path from "node:path";
import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const rootPath = path.resolve(__dirname, "..");
export const runtimePath = process.cwd();
export const cliPackagePath = path.resolve(rootPath, "package.json");
