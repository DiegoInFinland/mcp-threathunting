import { server } from "./conf.js";
import { z } from "zod";
import { AbuseIPDB, abuseIPDBReport } from "./api/abuseIpDb.js";
import { IPReputation, DomainReputation } from "./api/virusTotal.js";

export async function abuseIPDBTool() {
  return server.registerTool(
    "abuseipdb-lookup",
    {
      description: "Fetches the reputation of an IP address from AbuseIPDB",
      inputSchema: {
        ipAddress: z.string().describe("The IP address to look up"),
        maxAgeInDays: z
          .number()
          .optional()
          .describe("Maximum age of reports in days (optional)"),
      },
    },
    async ({ ipAddress, maxAgeInDays }) => {
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
              text: JSON.stringify(
                await AbuseIPDB(ipAddress, maxAgeInDays),
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
              text: `AbuseIPDB lookup failed (${ipAddress}), error: ${String(error)}`,
            },
          ],
        };
      }
    },
  );
}

export async function abuseIPDBReportTool() {
  return server.registerTool(
    "abuseipdb-report",
    {
      description: "Fetches the latest reports from AbuseIPDB",
      inputSchema: {
        ipAddress: z.string().describe("The IP address to fetch reports for"),
        page: z
          .number()
          .optional()
          .describe("Page number for pagination (optional, default: 1)"),
        perPage: z
          .number()
          .optional()
          .describe("Reports per page (optional, 1-100, default: 25)"),
      },
    },
    async ({ ipAddress, perPage }) => {
      try {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await abuseIPDBReport(
                  ipAddress,
                  perPage !== undefined ? String(perPage) : undefined,
                ),
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
              text: `AbuseIPDB report fetch failed, error: ${String(error)}`,
            },
          ],
        };
      }
    },
  );
}

export async function virusTotalTool() {
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

export async function virusTotalDomainTool() {
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
