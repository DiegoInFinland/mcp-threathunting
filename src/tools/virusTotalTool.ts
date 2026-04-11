import { server } from "../conf";
import { z } from "zod";
import { IPReputation, DomainReputation } from "../api/virusTotal";

export async function virusTotalTool() {
  return server.registerTool(
    "virustotal-ip-lookup",
    {
      description: `Checks the VirusTotal analysis summary for an IP address.`,
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

export async function virusTotalDomainTool() {
  return server.registerTool(
    "virustotal-domain-lookup",
    {
      description: `Retrieves the VirusTotal analysis summary and reports for a domain.`,
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
