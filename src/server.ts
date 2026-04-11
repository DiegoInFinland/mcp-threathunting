import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { server } from "./conf.js";
import { abuseIPDBTool, abuseIPDBReportTool } from "./tools/abuseIPDBTool.js";
import { urlScanTool } from "./tools/urlScanTool.js";
import {
  virusTotalDomainTool,
  virusTotalTool,
} from "./tools/virusTotalTool.js";

// Fallback to load .env file if not already loaded (e.g., when running with ts-node)
// This ensures that environment variables are available regardless of how the server is started.
// Ensure to have a .env file in the project root with the necessary API keys and URLs for the tools to function properly.
//import dotenv from "dotenv";
//import path from "node:path";
//import { fileURLToPath } from "node:url";
//const __filename = fileURLToPath(import.meta.url);
//const __dirname = path.dirname(__filename);
//dotenv.config({ path: path.resolve(__dirname, "../.env"), quiet: true });

async function main() {
  await virusTotalTool();
  await virusTotalDomainTool();
  await abuseIPDBTool();
  await abuseIPDBReportTool();
  await urlScanTool();

  const transport = new StdioServerTransport();
  await server.connect(transport);
}
main().catch((error) => {
  console.error("Error starting the server:", error);
  process.exit(1);
});
