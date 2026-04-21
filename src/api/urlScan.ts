import { setTimeout as sleep } from "node:timers/promises";

export async function urlScan(targetUrl: string) {
  const apiKey = process.env.URLSCAN_KEY;
  const url = process.env.URLSCAN;
  const resultBaseUrl = process.env.URLSCAN_RESULT;

  if (!apiKey || !url || !resultBaseUrl) {
    throw new Error(
      "URLSCAN_KEY, URLSCAN, or URLSCAN_RESULT is not set in environment variables",
    );
  }
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "API-Key": apiKey,
      },
      body: JSON.stringify({
        url: targetUrl,
        visibility: "public",
      }),
    });
    if (!response.ok) {
      throw new Error(`Error submitting URL scan: ${response.statusText}`);
    }

    const data = (await response.json()) as { uuid?: string };
    const scanRef = data.uuid;
    if (!scanRef) {
      throw new Error("URL scan response did not include a UUID");
    }

    await sleep(30000); // Wait for 30 seconds before fetching the results

    const apiUrl = `${resultBaseUrl}/${scanRef}`;
    const resultResponse = await fetch(apiUrl, {
      headers: {
        "API-Key": apiKey,
        "Content-Type": "application/json",
      },
    });

    if (!resultResponse.ok) {
      throw new Error(
        `Error fetching URL scan result: ${resultResponse.statusText}`,
      );
    }
    const scanResult = await resultResponse.json();
    // Return both the scan result and the screenshot URL for easier access in the tool
    return {
      uuid: scanRef,
      screenshot: await getUrlScanScreenshot(scanRef),
      result: scanResult,
    };
  } catch (error) {
    throw new Error(`Error submitting URL scan: ${String(error)}`);
  }
}
// Helper function to fetch the screenshot URL for a given scan UUID
export async function getUrlScanScreenshot(uuid: string) {
  const apiKey = process.env.URLSCAN_KEY;
  const resultBaseUrl = process.env.URLSCAN_SCREENSHOT;

  if (!apiKey || !resultBaseUrl) {
    throw new Error(
      "URLSCAN_KEY or URLSCAN_SCREENSHOT is not set in environment variables",
    );
  }

  const screenshotUrl = `${resultBaseUrl.replace(/\/$/, "")}/${uuid}.png`;
  const getScreenshot = await fetch(screenshotUrl, {
    method: "GET",
    headers: {
      "API-Key": apiKey,
    },
  });

  if (!getScreenshot.ok) {
    throw new Error(
      `Error fetching URL scan screenshot: ${getScreenshot.status} ${getScreenshot.statusText}`,
    );
  }

  return screenshotUrl;
}
