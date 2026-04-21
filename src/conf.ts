import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export const server = new McpServer({
  name: "Threat Hunting MCP Server",
  description: "A MCP server for threat hunting",
  version: "1.0.0",
});

// A simple helper to clean the data BEFORE it goes to any API.
export function preProcessData(rawData: string) {
  return rawData
    .replace(
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      "USER@REDACTED.COM",
    )
    .replace(
      /\b(id|user|uid|od|email|aff_id|cxd|sub\d*|click_id|tid|cid|pid|scid|hash|token|t|sid|ext|m|u|mid)=([a-zA-Z0-9_%+.-]+)/gi,
      "$1=[REDACTED_ID]",
    );
}
