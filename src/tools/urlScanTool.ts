import { server, preProcessData } from "../conf";
import { z } from "zod";
import { urlScan } from "../api/urlScan";

export async function urlScanTool() {
  return server.registerTool(
    "urlscan-lookup",
    {
      description: `Checks if a website is malicious/phishing using urlscan.io (ML-powered sandbox)`,
      inputSchema: {
        url: z.string().describe("The URL to look up"),
      },
    },
    async ({ url }) => {
      if (!url) {
        return {
          content: [
            {
              type: "text",
              text: "No URL provided.",
            },
          ],
        };
      }

      try {
        const scanResult = await urlScan(preProcessData(url));
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(scanResult, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `URL lookup failed (${url}), error: ${String(error)}`,
            },
          ],
        };
      }
    },
  );
}
