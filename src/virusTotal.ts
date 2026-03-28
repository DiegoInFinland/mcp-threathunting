import dotenv from "dotenv";
dotenv.config();

export async function IPReputation(ip: string) {
  const apiKey = process.env.VT_KEY;
  const ipCheck = process.env.VT_URL_IP;

  if (!apiKey || !ipCheck) {
    throw new Error("API key or URL not set in environment variables");
  }
  try {
    const response = await fetch(`${ipCheck}${ip}`, {
      headers: {
        "x-apikey": apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching IP reputation: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Error fetching IP reputation: ${String(error)}`);
  }
}

export async function URLReputation(url: string) {
  const apiKey = process.env.VT_KEY;
  const urlCheck = process.env.VT_URL_URL;

  if (!apiKey || !urlCheck) {
    throw new Error("API key or URL not set in environment variables");
  }
  try {
    const urlId = Buffer.from(url)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/g, "");

    const response = await fetch(`${urlCheck}${urlId}`, {
      headers: {
        "x-apikey": apiKey,
      },
    });
    if (!response.ok) {
      throw new Error(`Error fetching URL reputation: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Error fetching URL reputation: ${String(error)}`);
  }
}

export async function DomainReputation(domain: string) {
  const apiKey = process.env.VT_KEY;
  const domainCheck = process.env.VT_URL_DOMAIN;

  if (!apiKey || !domainCheck) {
    throw new Error("API key or URL not set in environment variables");
  }
  try {
    const response = await fetch(`${domainCheck}${domain}`, {
      headers: {
        "x-apikey": apiKey,
      },
    });
    if (!response.ok) {
      throw new Error(
        `Error fetching domain reputation: ${response.statusText}`,
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Error fetching domain reputation: ${String(error)}`);
  }
}
