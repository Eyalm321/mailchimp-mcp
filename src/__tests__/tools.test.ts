import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Import all tool modules to verify they export correctly
import { rootTools } from "../tools/root.js";
import { accountExportsTools } from "../tools/account-exports.js";
import { activityFeedTools } from "../tools/activity-feed.js";
import { authorizedAppTools } from "../tools/authorized-apps.js";
import { automationTools } from "../tools/automations.js";
import { batchTools } from "../tools/batches.js";
import { batchWebhookTools } from "../tools/batch-webhooks.js";
import { campaignFolderTools } from "../tools/campaign-folders.js";
import { campaignTools } from "../tools/campaigns.js";
import { connectedSiteTools } from "../tools/connected-sites.js";
import { conversationTools } from "../tools/conversations.js";
import { customerJourneyTools } from "../tools/customer-journeys.js";
import { ecommerceTools } from "../tools/ecommerce.js";
import { facebookAdTools } from "../tools/facebook-ads.js";
import { fileManagerTools } from "../tools/file-manager.js";
import { landingPageTools } from "../tools/landing-pages.js";
import { listTools } from "../tools/lists.js";
import { reportTools } from "../tools/reports.js";
import { reportingTools } from "../tools/reporting.js";
import { searchTools } from "../tools/search.js";
import { templateFolderTools } from "../tools/template-folders.js";
import { templateTools } from "../tools/templates.js";
import { verifiedDomainTools } from "../tools/verified-domains.js";

const allToolModules = [
  { name: "root", tools: rootTools },
  { name: "account-exports", tools: accountExportsTools },
  { name: "activity-feed", tools: activityFeedTools },
  { name: "authorized-apps", tools: authorizedAppTools },
  { name: "automations", tools: automationTools },
  { name: "batches", tools: batchTools },
  { name: "batch-webhooks", tools: batchWebhookTools },
  { name: "campaign-folders", tools: campaignFolderTools },
  { name: "campaigns", tools: campaignTools },
  { name: "connected-sites", tools: connectedSiteTools },
  { name: "conversations", tools: conversationTools },
  { name: "customer-journeys", tools: customerJourneyTools },
  { name: "ecommerce", tools: ecommerceTools },
  { name: "facebook-ads", tools: facebookAdTools },
  { name: "file-manager", tools: fileManagerTools },
  { name: "landing-pages", tools: landingPageTools },
  { name: "lists", tools: listTools },
  { name: "reports", tools: reportTools },
  { name: "reporting", tools: reportingTools },
  { name: "search", tools: searchTools },
  { name: "template-folders", tools: templateFolderTools },
  { name: "templates", tools: templateTools },
  { name: "verified-domains", tools: verifiedDomainTools },
];

const allTools = allToolModules.flatMap((m) => m.tools);

describe("Tool modules", () => {
  describe("all tool modules export arrays", () => {
    for (const mod of allToolModules) {
      it(`${mod.name} exports a non-empty array`, () => {
        expect(Array.isArray(mod.tools)).toBe(true);
        expect(mod.tools.length).toBeGreaterThan(0);
      });
    }
  });

  describe("all tools have required properties", () => {
    for (const tool of allTools) {
      it(`${tool.name} has name, description, inputSchema, and handler`, () => {
        expect(typeof tool.name).toBe("string");
        expect(tool.name).toMatch(/^mailchimp_/);
        expect(typeof tool.description).toBe("string");
        expect(tool.description.length).toBeGreaterThan(0);
        expect(tool.inputSchema).toBeDefined();
        expect(typeof tool.inputSchema.shape).toBe("object");
        expect(typeof tool.handler).toBe("function");
      });
    }
  });

  describe("no duplicate tool names", () => {
    it("all tool names are unique", () => {
      const names = allTools.map((t) => t.name);
      const uniqueNames = new Set(names);
      const duplicates = names.filter((name, i) => names.indexOf(name) !== i);
      expect(duplicates).toEqual([]);
      expect(uniqueNames.size).toBe(names.length);
    });
  });

  describe("tool count", () => {
    it("has the expected number of tools across all modules", () => {
      // Log the count for visibility
      console.log(`Total tools: ${allTools.length}`);
      for (const mod of allToolModules) {
        console.log(`  ${mod.name}: ${mod.tools.length}`);
      }
      expect(allTools.length).toBeGreaterThanOrEqual(200);
    });
  });
});

describe("Tool handlers call mailchimpRequest", () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", mockFetch);
    vi.stubEnv("MAILCHIMP_API_KEY", "test-key-us1");
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ status: "ok" }),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("mailchimp_ping calls GET /ping", async () => {
    const pingTool = rootTools.find((t) => t.name === "mailchimp_ping")!;
    await pingTool.handler({});

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/3.0/ping"),
      expect.objectContaining({ method: "GET" })
    );
  });

  it("mailchimp_list_campaigns calls GET /campaigns with params", async () => {
    const tool = campaignTools.find((t) => t.name === "mailchimp_list_campaigns")!;
    await tool.handler({ count: 5, offset: 0 } as any);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/3.0/campaigns"),
      expect.objectContaining({ method: "GET" })
    );
  });

  it("mailchimp_create_campaign calls POST /campaigns with body", async () => {
    const tool = campaignTools.find((t) => t.name === "mailchimp_create_campaign")!;
    await tool.handler({ type: "regular" } as any);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/3.0/campaigns"),
      expect.objectContaining({
        method: "POST",
        body: expect.stringContaining('"type":"regular"'),
      })
    );
  });

  it("mailchimp_get_list calls GET /lists/{list_id}", async () => {
    const tool = listTools.find((t) => t.name === "mailchimp_get_list")!;
    await tool.handler({ list_id: "abc123" } as any);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/3.0/lists/abc123"),
      expect.objectContaining({ method: "GET" })
    );
  });

  it("mailchimp_add_member calls POST /lists/{list_id}/members", async () => {
    const tool = listTools.find((t) => t.name === "mailchimp_add_member")!;
    await tool.handler({
      list_id: "abc123",
      email_address: "test@example.com",
      status: "subscribed",
    } as any);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/3.0/lists/abc123/members"),
      expect.objectContaining({
        method: "POST",
        body: expect.stringContaining("test@example.com"),
      })
    );
  });

  it("mailchimp_search_members calls GET /search-members with query", async () => {
    const tool = searchTools.find((t) => t.name === "mailchimp_search_members")!;
    await tool.handler({ query: "test@example.com" } as any);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/3.0/search-members"),
      expect.objectContaining({ method: "GET" })
    );
  });

  it("mailchimp_delete_campaign calls DELETE /campaigns/{campaign_id}", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 204,
    });

    const tool = campaignTools.find((t) => t.name === "mailchimp_delete_campaign")!;
    await tool.handler({ campaign_id: "abc123" } as any);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/3.0/campaigns/abc123"),
      expect.objectContaining({ method: "DELETE" })
    );
  });

  it("mailchimp_list_stores calls GET /ecommerce/stores", async () => {
    const tool = ecommerceTools.find((t) => t.name === "mailchimp_list_stores")!;
    await tool.handler({} as any);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/3.0/ecommerce/stores"),
      expect.objectContaining({ method: "GET" })
    );
  });
});
