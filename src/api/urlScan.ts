import { setTimeout as sleep } from "node:timers/promises";

interface scanResponse {
  malicious: boolean;
  score: number;
  message: string;
  url: string;
  screenshot?: string;
  veredict?: string;
}

export async function urlScan(ip: string) {
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
        url: ip,
        visibility: "public",
      }),
    });
    if (!response.ok) {
      throw new Error(`Error submitting URL scan: ${response.statusText}`);
    }

    const data = (await response.json()) as { uuid?: string };
    // Ensure the response includes a UUID for the scan result
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
    // Return the scan result as is, or extract relevant information if needed.
    return scanResult;
  } catch (error) {
    throw new Error(`Error submitting URL scan: ${String(error)}`);
  }
}
