import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const server = new McpServer({
  name: "Threat Hunting MCP Server",
  description: "A MCP server for threat hunting",
  version: "1.0.0",
});

export { server };
