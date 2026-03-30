# Threat Hunting MCP Server

A Model Context Protocol (MCP) server that exposes threat intel lookups for AI agents.

Current providers:

- VirusTotal (IP, URL, domain)
- AbuseIPDB (IP)

This project is under heavely development.

## Features

- `virustotal-ip-lookup`
- `virustotal-url-lookup`
- `virustotal-domain-lookup`
- `abuseipdb-lookup` (supports optional `maxAgeInDays`)

## Requirements

- Node.js 18+
- VirusTotal API key
- AbuseIPDB API key

## Installation

```bash
git clone https://github.com/DiegoInFinland/mcp-threathunting.git
cd mcp-threathunting
npm install
```

## Configuration

Create a `.env` file in the project root with:

```env
VT_KEY=your_virustotal_api_key
VT_URL_IP=https://www.virustotal.com/api/v3/ip_addresses/
VT_URL_URL=https://www.virustotal.com/api/v3/urls/
VT_URL_DOMAIN=https://www.virustotal.com/api/v3/domains/

ABUSEIPDB_KEY=your_abuseipdb_api_key
ABUSEIPDB_CHECK=https://api.abuseipdb.com/api/v2/check
```

Notes:

- Environment variables are loaded in `src/server.ts` from `../.env`.
- `maxAgeInDays` for AbuseIPDB is optional.

## Run locally

```bash
npx -y tsx src/server.ts
```

## Debug with MCP Inspector

```bash
npx @modelcontextprotocol/inspector -- npx -y tsx src/server.ts
```

## Claude Desktop config example

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
        "VT_URL_DOMAIN": "https://www.virustotal.com/api/v3/domains/",
        "ABUSEIPDB_KEY": "your_abuseipdb_key",
        "ABUSEIPDB_CHECK": "https://api.abuseipdb.com/api/v2/check"
      }
    }
  }
}
```

## Known limitations

- JSON responses are currently returned in full and can be large.
- Limited retry/timeout/rate-limit handling.
- This is still an evolving hobby project.
