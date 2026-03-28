# Threat Hunting MCP Server

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server that exposes VirusTotal threat intelligence as tools for AI agents. Agents can look up the reputation of IP addresses, URLs, and domains in real time.
Please, note that this project is under development and not finished yet.

---

## Features

- **IP reputation lookup** — country, ASN, network, malicious/suspicious/harmless counts
- **URL reputation lookup** — title, HTTP status, redirect destination, threat names, categories
- **Domain reputation lookup** — registrar, creation date, categories, analysis stats
- Compact, agent-readable structured output (no raw JSON blobs)
- Per-tool error handling — one failed lookup never blocks the others
- Runs over stdio transport, compatible with any MCP client

---

## Requirements

- Node.js 18+
- A VirusTotal API key.

---

## Installation

```bash
git clone https://github.com/DiegoInFinland/mcp-threathunting.git
cd mcp-threathunting
npm install
```

---

## Configuration

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

| Variable        | Description                                                                |
| --------------- | -------------------------------------------------------------------------- |
| `VT_KEY`        | Your VirusTotal API key                                                    |
| `VT_URL_IP`     | VirusTotal IP endpoint (`https://www.virustotal.com/api/v3/ip_addresses/`) |
| `VT_URL_URL`    | VirusTotal URL endpoint (`https://www.virustotal.com/api/v3/urls/`)        |
| `VT_URL_DOMAIN` | VirusTotal domain endpoint (`https://www.virustotal.com/api/v3/domains/`)  |
| `VT_URL_FILE`   | VirusTotal file endpoint (`https://www.virustotal.com/api/v3/files/`)      |

---

## Running the server

```bash
# Development (with hot reload)
npx -y tsx src/server.ts
```

---

## Debugging with MCP Inspector

```bash
npx @modelcontextprotocol/inspector -- npx -y tsx src/server.ts
```

---

## Connecting to an AI agent

Add this to your MCP client config (e.g. Claude Desktop `claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "threat-hunting": {
      "command": "npx",
      "args": [
        "-y",
        "--silent",
        "tsx",
        "/path/to/mcp-threathunting/src/server.ts"
      ],
      "env": {
        "VT_KEY": "your_api_key_here",
        "VT_URL_IP": "https://www.virustotal.com/api/v3/ip_addresses/",
        "VT_URL_URL": "https://www.virustotal.com/api/v3/urls/",
        "VT_URL_DOMAIN": "https://www.virustotal.com/api/v3/domains/"
      }
    }
  }
}
```

---

## Known limitations

- This is a development project, many things could go wrong as MCP protocol is quite new and this project is a hobby and is not well debugged.
- This project should Add more online services and file scanners in order to be more meaningful.
- Currently, this server returns an entire JSON file to AI clients, since AI clients will delivers to users more readable human output, but it could be more tailored as well.
