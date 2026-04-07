#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { rootTools } from "./tools/root.js";
import { accountExportsTools } from "./tools/account-exports.js";
import { activityFeedTools } from "./tools/activity-feed.js";
import { authorizedAppTools } from "./tools/authorized-apps.js";
import { automationTools } from "./tools/automations.js";
import { batchTools } from "./tools/batches.js";
import { batchWebhookTools } from "./tools/batch-webhooks.js";
import { campaignFolderTools } from "./tools/campaign-folders.js";
import { campaignTools } from "./tools/campaigns.js";
import { connectedSiteTools } from "./tools/connected-sites.js";
import { conversationTools } from "./tools/conversations.js";
import { customerJourneyTools } from "./tools/customer-journeys.js";
import { ecommerceTools } from "./tools/ecommerce.js";
import { facebookAdTools } from "./tools/facebook-ads.js";
import { fileManagerTools } from "./tools/file-manager.js";
import { landingPageTools } from "./tools/landing-pages.js";
import { listTools } from "./tools/lists.js";
import { reportTools } from "./tools/reports.js";
import { reportingTools } from "./tools/reporting.js";
import { searchTools } from "./tools/search.js";
import { templateFolderTools } from "./tools/template-folders.js";
import { templateTools } from "./tools/templates.js";
import { verifiedDomainTools } from "./tools/verified-domains.js";

const server = new McpServer({
  name: "mailchimp-mcp",
  version: "1.0.0",
});

const allTools = [
  ...rootTools,
  ...accountExportsTools,
  ...activityFeedTools,
  ...authorizedAppTools,
  ...automationTools,
  ...batchTools,
  ...batchWebhookTools,
  ...campaignFolderTools,
  ...campaignTools,
  ...connectedSiteTools,
  ...conversationTools,
  ...customerJourneyTools,
  ...ecommerceTools,
  ...facebookAdTools,
  ...fileManagerTools,
  ...landingPageTools,
  ...listTools,
  ...reportTools,
  ...reportingTools,
  ...searchTools,
  ...templateFolderTools,
  ...templateTools,
  ...verifiedDomainTools,
];

for (const tool of allTools) {
  server.tool(
    tool.name,
    tool.description,
    tool.inputSchema.shape as any,
    async (args: any) => {
      try {
        const result = await tool.handler(args as any);
        return {
          content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return {
          content: [{ type: "text" as const, text: `Error: ${message}` }],
          isError: true,
        };
      }
    }
  );
}

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Mailchimp MCP server running");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
