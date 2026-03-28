import { server } from "./conf.js";
import { z } from "zod";
import { IPReputation, URLReputation, DomainReputation } from "./virusTotal.js";

export async function virusTotalIPLookup() {
  return server.registerTool(
    "virustotal-ip-lookup",
    {
      description: "Fetches the reputation of an IP address from VirusTotal",
      inputSchema: {
        ipAddress: z.string().describe("The IP address to look up"),
      },
    },
    async ({ ipAddress }) => {
      if (!ipAddress) {
        return {
          content: [
            {
              type: "text",
              text: "No IP address provided.",
            },
          ],
        };
      }

      try {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(await IPReputation(ipAddress), null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `IP lookup failed (${ipAddress}), error: ${String(error)}`,
            },
          ],
        };
      }
    },
  );
}

export async function virusTotalURLLookup() {
  return server.registerTool(
    "virustotal-url-lookup",
    {
      description: "Fetches the reputation of a URL from VirusTotal",
      inputSchema: {
        urlAddress: z.string().describe("The URL to look up"),
      },
    },
    async ({ urlAddress }) => {
      if (!urlAddress) {
        return {
          content: [
            {
              type: "text",
              text: "No URL address provided.",
            },
          ],
        };
      }

      try {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(await URLReputation(urlAddress), null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `URL lookup failed (${urlAddress}), error: ${String(error)}`,
            },
          ],
        };
      }
    },
  );
}

export async function virusTotalDomainLookup() {
  return server.registerTool(
    "virustotal-domain-lookup",
    {
      description: "Fetches the reputation of a domain from VirusTotal",
      inputSchema: {
        domainAddress: z.string().describe("The domain to look up"),
      },
    },
    async ({ domainAddress }) => {
      if (!domainAddress) {
        return {
          content: [
            {
              type: "text",
              text: "No domain address provided.",
            },
          ],
        };
      }

      try {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await DomainReputation(domainAddress),
                null,
                2,
              ),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Domain lookup failed (${domainAddress}), error: ${String(error)}`,
            },
          ],
        };
      }
    },
  );
}
