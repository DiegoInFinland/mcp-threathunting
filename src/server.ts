import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { server } from "./conf.js";
import {
  virusTotalDomainLookup,
  virusTotalIPLookup,
  virusTotalURLLookup,
  abuseIPDBLookup,
} from "./tools.js";

// Load environment variables from .env file.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env"), quiet: true });

async function main() {
  await virusTotalIPLookup();
  await virusTotalURLLookup();
  await virusTotalDomainLookup();
  await abuseIPDBLookup();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
main().catch((error) => {
  console.error("Error starting the server:", error);
  process.exit(1);
});
