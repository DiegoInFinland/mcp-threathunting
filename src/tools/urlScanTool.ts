import { server, preProcessData } from "../conf";
import { z } from "zod";
import { urlScan, getUrlScanScreenshot } from "../api/urlScan";

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

export async function urlScanScreenshotTool() {
  return server.registerTool(
    "urlscan-screenshot",
    {
      description: `Gets a screenshot of a URL scan result from urlscan.io`,
      inputSchema: {
        uuid: z.string().describe("The UUID of the URL scan result"),
      },
    },
    async ({ uuid }) => {
      if (!uuid) {
        return {
          content: [
            {
              type: "text",
              text: "No UUID provided.",
            },
          ],
        };
      }

      try {
        const screenshotUrl = await getUrlScanScreenshot(uuid);
        return {
          content: [
            {
              type: "text",
              text: `Screenshot URL for scan ${uuid}: ${screenshotUrl}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Failed to get screenshot for UUID ${uuid}, error: ${String(error)}`,
            },
          ],
        };
      }
    },
  );
}
