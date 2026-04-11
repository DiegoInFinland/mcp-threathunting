import { server } from "../conf.js";
import { z } from "zod";
import { AbuseIPDB, abuseIPDBReport } from "../api/abuseIPDb.js";

export async function abuseIPDBTool() {
  return server.registerTool(
    "abuseipdb-lookup",
    {
      description: `Checks an IP address against the AbuseIPDB database. 
        Returns abuse confidence score (0-100), country, ISP, domain, usage type, total reports, and last reported date. 
        Optionally, you can specify maxAgeInDays to filter reports by age.`,
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
      description: `Retrieves paginated abuse reports submitted for a given IP address. 
        Each report includes the reporter's categories (e.g. SSH brute-force, port scan), timestamp, and comment. 
        Use perPage to control how many reports are returned.`,
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
