import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { server } from "./conf.js";
import {
  virusTotalDomainLookup,
  virusTotalIPLookup,
  virusTotalURLLookup,
} from "./tools.js";

async function main() {
  await virusTotalIPLookup();
  await virusTotalURLLookup();
  await virusTotalDomainLookup();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
main().catch((error) => {
  console.error("Error starting the server:", error);
  process.exit(1);
});
