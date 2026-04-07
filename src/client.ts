function getConfig(): { apiKey: string; server: string } {
  const key = process.env.MAILCHIMP_API_KEY;
  if (!key) throw new Error("MAILCHIMP_API_KEY environment variable is not set");
  const dc = key.split("-").pop();
  if (!dc) throw new Error("Invalid Mailchimp API key format — expected key to end with -<dc> (e.g. us1)");
  return { apiKey: key, server: dc };
}

export async function mailchimpRequest<T>(
  method: string,
  path: string,
  body?: Record<string, unknown>,
  params?: Record<string, string | number | boolean | undefined>
): Promise<T> {
  const { apiKey, server } = getConfig();
  const url = new URL(`https://${server}.api.mailchimp.com/3.0${path}`);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }

  const headers: Record<string, string> = {
    Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString("base64")}`,
    "Content-Type": "application/json",
  };

  const options: RequestInit = {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  };

  const res = await fetch(url.toString(), options);

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Mailchimp API error ${res.status}: ${text}`);
  }

  if (res.status === 204) return {} as T;

  return res.json() as Promise<T>;
}
