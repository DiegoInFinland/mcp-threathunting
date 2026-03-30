import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { server } from "./conf.js";
import { abuseIPDBTool, abuseIPDBReportTool } from "./tools/abuseIPDB.js";
import { urlScanTool } from "./tools/urlScan.js";
import { virusTotalDomainTool, virusTotalTool } from "./tools/virusTotal.js";

// Load environment variables from .env file.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env"), quiet: true });

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
