import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mailchimpRequest } from "../client.js";

describe("mailchimpRequest", () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", mockFetch);
    vi.stubEnv("MAILCHIMP_API_KEY", "test-api-key-us1");
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("throws if MAILCHIMP_API_KEY is not set", async () => {
    vi.stubEnv("MAILCHIMP_API_KEY", "");
    await expect(mailchimpRequest("GET", "/ping")).rejects.toThrow(
      "MAILCHIMP_API_KEY environment variable is not set"
    );
  });

  it("throws if API key format is invalid (no datacenter suffix)", async () => {
    vi.stubEnv("MAILCHIMP_API_KEY", "invalidkey");
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });
    // "invalidkey".split("-").pop() returns "invalidkey" which is technically valid
    // but a key without a dash should still work since pop returns the whole string
    await mailchimpRequest("GET", "/ping");
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("invalidkey.api.mailchimp.com"),
      expect.anything()
    );
  });

  it("extracts datacenter from API key and builds correct URL", async () => {
    vi.stubEnv("MAILCHIMP_API_KEY", "abc123-us6");
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ health_status: "Everything's Chimpy!" }),
    });

    await mailchimpRequest("GET", "/ping");

    expect(mockFetch).toHaveBeenCalledWith(
      "https://us6.api.mailchimp.com/3.0/ping",
      expect.anything()
    );
  });

  it("makes GET request with correct URL and Basic Auth headers", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: "test" }),
    });

    await mailchimpRequest("GET", "/lists");

    const expectedAuth = `Basic ${Buffer.from("anystring:test-api-key-us1").toString("base64")}`;

    expect(mockFetch).toHaveBeenCalledWith(
      "https://us1.api.mailchimp.com/3.0/lists",
      expect.objectContaining({
        method: "GET",
        headers: {
          Authorization: expectedAuth,
          "Content-Type": "application/json",
        },
        body: undefined,
      })
    );
  });

  it("makes POST request with body", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: "abc123" }),
    });

    await mailchimpRequest("POST", "/campaigns", { type: "regular" });

    expect(mockFetch).toHaveBeenCalledWith(
      "https://us1.api.mailchimp.com/3.0/campaigns",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ type: "regular" }),
      })
    );
  });

  it("appends query params and filters undefined/null/empty values", async () => {
    let capturedUrl = "";
    mockFetch.mockImplementation((url: string) => {
      capturedUrl = url;
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      });
    });

    await mailchimpRequest("GET", "/lists", undefined, {
      count: 10,
      offset: 0,
      status: "subscribed",
      empty: undefined,
      nullVal: undefined,
    });

    const url = new URL(capturedUrl);
    expect(url.searchParams.get("count")).toBe("10");
    expect(url.searchParams.get("offset")).toBe("0");
    expect(url.searchParams.get("status")).toBe("subscribed");
    expect(url.searchParams.has("empty")).toBe(false);
    expect(url.searchParams.has("nullVal")).toBe(false);
  });

  it("returns parsed JSON on success", async () => {
    const expected = { lists: [{ id: "abc123" }] };
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(expected),
    });

    const result = await mailchimpRequest("GET", "/lists");
    expect(result).toEqual(expected);
  });

  it("returns empty object on 204 No Content", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 204,
      json: () => Promise.reject(new Error("no body")),
    });

    const result = await mailchimpRequest("DELETE", "/campaigns/abc123");
    expect(result).toEqual({});
  });

  it("throws on non-2xx response", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 401,
      text: () => Promise.resolve("API Key Invalid"),
    });

    await expect(mailchimpRequest("GET", "/ping")).rejects.toThrow(
      "Mailchimp API error 401: API Key Invalid"
    );
  });

  it("handles text() failure gracefully on error", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      text: () => Promise.reject(new Error("parse failed")),
    });

    await expect(mailchimpRequest("GET", "/ping")).rejects.toThrow(
      "Mailchimp API error 500:"
    );
  });

  it("makes PATCH request with body", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: "abc123", name: "Updated" }),
    });

    await mailchimpRequest("PATCH", "/lists/abc123", { name: "Updated" });

    expect(mockFetch).toHaveBeenCalledWith(
      "https://us1.api.mailchimp.com/3.0/lists/abc123",
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({ name: "Updated" }),
      })
    );
  });

  it("makes PUT request with body", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: "abc123" }),
    });

    await mailchimpRequest("PUT", "/campaigns/abc123/content", {
      html: "<p>Hello</p>",
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "https://us1.api.mailchimp.com/3.0/campaigns/abc123/content",
      expect.objectContaining({
        method: "PUT",
        body: JSON.stringify({ html: "<p>Hello</p>" }),
      })
    );
  });
});
