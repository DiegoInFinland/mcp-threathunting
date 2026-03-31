import { server } from "../conf.js";
import { z } from "zod";
import { AbuseIPDB, abuseIPDBReport } from "../api/abuseIpDb.js";

export async function abuseIPDBTool() {
  return server.registerTool(
    "abuseipdb-lookup",
    {
      description:
        "Retrieves AbuseIPDB check data for an IP address, including abuse confidence score and recent abuse context.",
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
      description:
        "Retrieves AbuseIPDB report records for a given IP address with an optional per-page limit.",
      inputSchema: {
        ipAddress: z.string().describe("The IP address to fetch reports for."),
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
