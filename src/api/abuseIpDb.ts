export async function AbuseIPDB(ip: string, maxAgeInDays?: number) {
  const apiKey = process.env.ABUSEIPDB_KEY;
  const url = process.env.ABUSEIPDB_CHECK;

  const params = new URLSearchParams({
    ipAddress: ip,
  });
  if (maxAgeInDays !== undefined) {
    params.set("maxAgeInDays", String(maxAgeInDays));
  }
  if (!apiKey || !url) {
    throw new Error("API key or URL not set in environment variables");
  }
  try {
    const headers = {
      Accept: "application/json",
      Key: apiKey,
    };

    const response = await fetch(`${url}?${params.toString()}`, {
      method: "GET",
      headers,
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

export async function abuseIPDBReport(ipAddress: string, perPage = "10") {
  const apiKey = process.env.ABUSEIPDB_KEY;
  const reports = process.env.ABUSEIPDB_REPORT?.trim();

  if (!apiKey || !reports || !ipAddress) {
    throw new Error("API key or URL not set in environment variables");
  }

  const params = new URLSearchParams({ ipAddress, perPage });
  try {
    const headers = {
      Accept: "application/json",
      Key: apiKey,
    };

    const response = await fetch(`${reports}?${params.toString()}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(`Error fetching IP report: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Error fetching IP report: ${String(error)}`);
  }
}
