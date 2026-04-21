# Threat Hunting MCP Server

A Model Context Protocol (MCP) server that exposes threat intel lookups for AI agents and optional a Python server to parse HTML.


<p align="center">
<a href="https://github.com/user-attachments/assets/bdbfbd88-3eb0-4b8d-8c3e-c5fe2a4db9d7">Watch Minimal Example</a> 
</p>


Current providers:

- VirusTotal (IP, domain)
- AbuseIPDB (IP)
- UrlScan (URL)

This project is under active development and primarily intended for personal use.

## Requirements

- Node.js 18+
- Typescript
- VirusTotal API key
- AbuseIPDB API key
- UrlScan API key
- Uv

## Installation

```bash
git clone https://github.com/DiegoInFinland/mcp-threathunting.git
cd mcp-threathunting
npm install -y
# optional for Python server.
chmod +x setup-web-parser.sh && ./setup-web-parser.sh
```

## Configuration

Create a `.env` file in the project root with:

```env
VT_KEY=your_virustotal_api_key
VT_URL_IP=https://www.virustotal.com/api/v3/ip_addresses/
VT_URL_DOMAIN=https://www.virustotal.com/api/v3/domains/
VT_URL_FILE=https://www.virustotal.com/api/v3/files/
VT_URL_URL=https://www.virustotal.com/api/v3/urls/

ABUSEIPDB_KEY=your_abuseipdb_api_key
ABUSEIPDB_CHECK=https://api.abuseipdb.com/api/v2/check
ABUSEIPDB_REPORT=https://api.abuseipdb.com/api/v2/reports

URLSCAN_KEY=your_urlsscan_api_key
URLSCAN=https://urlscan.io/api/v1/scan
URLSCAN_RESULT=https://urlscan.io/api/v1/result
URLSCAN_SCREENSHOT=https://urlscan.io/screenshots

```

Notes:

- You must add API keys in .env file and Claude Code config file in order to use the services.

## Run locally

```bash
npx -y tsx src/server.ts
```

## Debug with MCP Inspector

```bash
npx @modelcontextprotocol/inspector -- npx -y tsx src/server.ts
```

## Claude Desktop config example for VirusTotal API

```json
{
  "mcpServers": {
    "threat-hunting": {
      "command": "npx",
      "args": [
        "-y",
        "--silent",
        "tsx",
        "/path/to/your/mcp-threathunting/src/server.ts"
      ],
      "env": {
        "VT_KEY": "your_vt_key",
        "VT_URL_IP": "https://www.virustotal.com/api/v3/ip_addresses/",
        "VT_URL_URL": "https://www.virustotal.com/api/v3/urls/",
        "VT_URL_DOMAIN": "https://www.virustotal.com/api/v3/domains/"
      }
    }
  }
}
```

## Known limitations

- JSON responses are currently returned in full.
- Limited retry/timeout/rate-limit handling.
- No tests fully implemented yet.
- This is still an evolving hobby project.
