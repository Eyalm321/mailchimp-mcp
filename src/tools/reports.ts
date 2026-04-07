import { z } from "zod";
import { mailchimpRequest } from "../client.js";

export const reportTools = [
  // 1. List reports
  {
    name: "mailchimp_list_reports",
    description:
      "Get campaign reports for all campaigns in an account",
    inputSchema: z.object({
      fields: z
        .string()
        .optional()
        .describe(
          "Comma-separated list of fields to include in the response"
        ),
      exclude_fields: z
        .string()
        .optional()
        .describe(
          "Comma-separated list of fields to exclude from the response"
        ),
      count: z
        .number()
        .optional()
        .describe("The number of records to return (default 10, max 1000)"),
      offset: z
        .number()
        .optional()
        .describe(
          "The number of records to skip (used for pagination, default 0)"
        ),
      type: z
        .enum(["regular", "plaintext", "absplit", "rss", "variate"])
        .optional()
        .describe("The campaign type to filter by"),
      before_send_time: z
        .string()
        .optional()
        .describe(
          "Restrict results to campaigns sent before this time (ISO 8601)"
        ),
      since_send_time: z
        .string()
        .optional()
        .describe(
          "Restrict results to campaigns sent after this time (ISO 8601)"
        ),
    }),
    handler: async (args: {
      fields?: string;
      exclude_fields?: string;
      count?: number;
      offset?: number;
      type?: string;
      before_send_time?: string;
      since_send_time?: string;
    }) => {
      return mailchimpRequest("GET", "/reports", undefined, {
        fields: args.fields,
        exclude_fields: args.exclude_fields,
        count: args.count,
        offset: args.offset,
        type: args.type,
        before_send_time: args.before_send_time,
        since_send_time: args.since_send_time,
      });
    },
  },

  // 2. Get campaign report
  {
    name: "mailchimp_get_campaign_report",
    description:
      "Get report for a specific campaign",
    inputSchema: z.object({
      campaign_id: z
        .string()
        .describe("The unique ID for the campaign"),
      fields: z
        .string()
        .optional()
        .describe(
          "Comma-separated list of fields to include in the response"
        ),
      exclude_fields: z
        .string()
        .optional()
        .describe(
          "Comma-separated list of fields to exclude from the response"
        ),
    }),
    handler: async (args: {
      campaign_id: string;
      fields?: string;
      exclude_fields?: string;
    }) => {
      return mailchimpRequest(
        "GET",
        `/reports/${args.campaign_id}`,
        undefined,
        {
          fields: args.fields,
          exclude_fields: args.exclude_fields,
        }
      );
    },
  },

  // 3. List campaign abuse reports
  {
    name: "mailchimp_list_campaign_abuse_reports",
    description:
      "Get a list of abuse complaints for a specific campaign",
    inputSchema: z.object({
      campaign_id: z
        .string()
        .describe("The unique ID for the campaign"),
      fields: z
        .string()
        .optional()
        .describe(
          "Comma-separated list of fields to include in the response"
        ),
      exclude_fields: z
        .string()
        .optional()
        .describe(
          "Comma-separated list of fields to exclude from the response"
        ),
      count: z
        .number()
        .optional()
        .describe("The number of records to return (default 10, max 1000)"),
      offset: z
        .number()
        .optional()
        .describe(
          "The number of records to skip (used for pagination, default 0)"
        ),
    }),
    handler: async (args: {
      campaign_id: string;
      fields?: string;
      exclude_fields?: string;
      count?: number;
      offset?: number;
    }) => {
      return mailchimpRequest(
        "GET",
        `/reports/${args.campaign_id}/abuse-reports`,
        undefined,
        {
          fields: args.fields,
          exclude_fields: args.exclude_fields,
          count: args.count,
          offset: args.offset,
        }
      );
    },
  },

  // 4. Get campaign abuse report
  {
    name: "mailchimp_get_campaign_abuse_report",
    description:
      "Get information about a specific abuse report for a campaign",
    inputSchema: z.object({
      campaign_id: z
        .string()
        .describe("The unique ID for the campaign"),
      report_id: z
        .string()
        .describe("The unique ID for the abuse report"),
      fields: z
        .string()
        .optional()
        .describe(
          "Comma-separated list of fields to include in the response"
        ),
      exclude_fields: z
        .string()
        .optional()
        .describe(
          "Comma-separated list of fields to exclude from the response"
        ),
    }),
    handler: async (args: {
      campaign_id: string;
      report_id: string;
      fields?: string;
      exclude_fields?: string;
    }) => {
      return mailchimpRequest(
        "GET",
        `/reports/${args.campaign_id}/abuse-reports/${args.report_id}`,
        undefined,
        {
          fields: args.fields,
          exclude_fields: args.exclude_fields,
        }
      );
    },
  },

  // 5. List campaign advice
  {
    name: "mailchimp_list_campaign_advice",
    description:
      "Get feedback based on a campaign's statistics",
    inputSchema: z.object({
      campaign_id: z
        .string()
        .describe("The unique ID for the campaign"),
      fields: z
        .string()
        .optional()
        .describe(
          "Comma-separated list of fields to include in the response"
        ),
      exclude_fields: z
        .string()
        .optional()
        .describe(
          "Comma-separated list of fields to exclude from the response"
        ),
    }),
    handler: async (args: {
      campaign_id: string;
      fields?: string;
      exclude_fields?: string;
    }) => {
      return mailchimpRequest(
        "GET",
        `/reports/${args.campaign_id}/advice`,
        undefined,
        {
          fields: args.fields,
          exclude_fields: args.exclude_fields,
        }
      );
    },
  },

  // 6. List click details
  {
    name: "mailchimp_list_click_details",
    description:
      "Get information about clicks on specific links in a campaign",
    inputSchema: z.object({
      campaign_id: z
        .string()
        .describe("The unique ID for the campaign"),
      fields: z
        .string()
        .optional()
        .describe(
          "Comma-separated list of fields to include in the response"
        ),
      exclude_fields: z
        .string()
        .optional()
        .describe(
          "Comma-separated list of fields to exclude from the response"
        ),
      count: z
        .number()
        .optional()
        .describe("The number of records to return (default 10, max 1000)"),
      offset: z
        .number()
        .optional()
        .describe(
          "The number of records to skip (used for pagination, default 0)"
        ),
    }),
    handler: async (args: {
      campaign_id: string;
      fields?: string;
      exclude_fields?: string;
      count?: number;
      offset?: number;
    }) => {
      return mailchimpRequest(
        "GET",
        `/reports/${args.campaign_id}/click-details`,
        undefined,
        {
          fields: args.fields,
          exclude_fields: args.exclude_fields,
          count: args.count,
          offset: args.offset,
        }
      );
    },
  },

  // 7. Get click detail
  {
    name: "mailchimp_get_click_detail",
    description:
      "Get information about a specific link clicked in a campaign",
    inputSchema: z.object({
      campaign_id: z
        .string()
        .describe("The unique ID for the campaign"),
      link_id: z
        .string()
        .describe("The unique ID for the clicked link"),
      fields: z
        .string()
        .optional()
        .describe(
          "Comma-separated list of fields to include in the response"
        ),
      exclude_fields: z
        .string()
        .optional()
        .describe(
          "Comma-separated list of fields to exclude from the response"
        ),
    }),
    handler: async (args: {
      campaign_id: string;
      link_id: string;
      fields?: string;
      exclude_fields?: string;
    }) => {
      return mailchimpRequest(
        "GET",
        `/reports/${args.campaign_id}/click-details/${args.link_id}`,
        undefined,
        {
          fields: args.fields,
          exclude_fields: args.exclude_fields,
        }
      );
    },
  },

  // 8. List click detail members
  {
    name: "mailchimp_list_click_detail_members",
    description:
      "Get information about subscribers who clicked a specific link in a campaign",
    inputSchema: z.object({
      campaign_id: z
        .string()
        .describe("The unique ID for the campaign"),
      link_id: z
        .string()
        .describe("The unique ID for the clicked link"),
      fields: z
        .string()
        .optional()
        .describe(
          "Comma-separated list of fields to include in the response"
        ),
      exclude_fields: z
        .string()
        .optional()
        .describe(
          "Comma-separated list of fields to exclude from the response"
        ),
      count: z
        .number()
        .optional()
        .describe("The number of records to return (default 10, max 1000)"),
      offset: z
        .number()
        .optional()
        .describe(
          "The number of records to skip (used for pagination, default 0)"
        ),
    }),
    handler: async (args: {
      campaign_id: string;
      link_id: string;
      fields?: string;
      exclude_fields?: string;
      count?: number;
      offset?: number;
    }) => {
      return mailchimpRequest(
        "GET",
        `/reports/${args.campaign_id}/click-details/${args.link_id}/members`,
        undefined,
        {
          fields: args.fields,
          exclude_fields: args.exclude_fields,
          count: args.count,
          offset: args.offset,
        }
      );
    },
  },

  // 9. Get click detail member
  {
    name: "mailchimp_get_click_detail_member",
    description:
      "Get information about a specific subscriber who clicked a link in a campaign",
    inputSchema: z.object({
      campaign_id: z
        .string()
        .describe("The unique ID for the campaign"),
      link_id: z
        .string()
        .describe("The unique ID for the clicked link"),
      subscriber_hash: z
        .string()
        .describe(
          "The MD5 hash of the lowercase version of the list member's email address"
        ),
      fields: z
        .string()
        .optional()
        .describe(
          "Comma-separated list of fields to include in the response"
        ),
      exclude_fields: z
        .string()
        .optional()
        .describe(
          "Comma-separated list of fields to exclude from the response"
        ),
    }),
    handler: async (args: {
      campaign_id: string;
      link_id: string;
      subscriber_hash: string;
      fields?: string;
      exclude_fields?: string;
    }) => {
      return mailchimpRequest(
        "GET",
        `/reports/${args.campaign_id}/click-details/${args.link_id}/members/${args.subscriber_hash}`,
        undefined,
        {
          fields: args.fields,
          exclude_fields: args.exclude_fields,
        }
      );
    },
  },

  // 10. List domain performance
  {
    name: "mailchimp_list_domain_performance",
    description:
      "Get statistics for the top-performing email domains in a campaign",
    inputSchema: z.object({
      campaign_id: z
        .string()
        .describe("The unique ID for the campaign"),
      fields: z
        .string()
        .optional()
        .describe(
          "Comma-separated list of fields to include in the response"
        ),
      exclude_fields: z
        .string()
        .optional()
        .describe(
          "Comma-separated list of fields to exclude from the response"
        ),
    }),
    handler: async (args: {
      campaign_id: string;
      fields?: string;
      exclude_fields?: string;
    }) => {
      return mailchimpRequest(
        "GET",
        `/reports/${args.campaign_id}/domain-performance`,
        undefined,
        {
          fields: args.fields,
          exclude_fields: args.exclude_fields,
        }
      );
    },
  },

  // 11. List ecommerce product activity
  {
    name: "mailchimp_list_ecommerce_product_activity",
    description:
      "Get breakdown of product activity for a campaign",
    inputSchema: z.object({
      campaign_id: z
        .string()
        .describe("The unique ID for the campaign"),
      fields: z
        .string()
        .optional()
        .describe(
          "Comma-separated list of fields to include in the response"
        ),
      exclude_fields: z
        .string()
        .optional()
        .describe(
          "Comma-separated list of fields to exclude from the response"
        ),
      count: z
        .number()
        .optional()
        .describe("The number of records to return (default 10, max 1000)"),
      offset: z
        .number()
        .optional()
        .describe(
          "The number of records to skip (used for pagination, default 0)"
        ),
      sort_field: z
        .enum([
          "title",
          "total_revenue",
          "total_purchased",
        ])
        .optional()
        .describe("The field to sort results by"),
    }),
    handler: async (args: {
      campaign_id: string;
      fields?: string;
      exclude_fields?: string;
      count?: number;
      offset?: number;
      sort_field?: string;
    }) => {
      return mailchimpRequest(
        "GET",
        `/reports/${args.campaign_id}/ecommerce-product-activity`,
        undefined,
        {
          fields: args.fields,
          exclude_fields: args.exclude_fields,
          count: args.count,
          offset: args.offset,
          sort_field: args.sort_field,
        }
      );
    },
  },

  // 12. List eepurl activity
  {
    name: "mailchimp_list_eepurl_activity",
    description:
      "Get a summary of social activity for a campaign, tracked by EepURL",
    inputSchema: z.object({
      campaign_id: z
        .string()
        .describe("The unique ID for the campaign"),
      fields: z
        .string()
        .optional()
        .describe(
          "Comma-separated list of fields to include in the response"
        ),
      exclude_fields: z
        .string()
        .optional()
        .describe(
          "Comma-separated list of fields to exclude from the response"
        ),
    }),
    handler: async (args: {
      campaign_id: string;
      fields?: string;
      exclude_fields?: string;
    }) => {
      return mailchimpRequest(
        "GET",
        `/reports/${args.campaign_id}/eepurl`,
        undefined,
        {
          fields: args.fields,
          exclude_fields: args.exclude_fields,
        }
      );
    },
  },

  // 13. List email activity
  {
    name: "mailchimp_list_email_activity",
    description:
      "Get a list of member activity for a campaign, including opens, clicks, and bounces",
    inputSchema: z.object({
      campaign_id: z
        .string()
        .describe("The unique ID for the campaign"),
      fields: z
        .string()
        .optional()
        .describe(
          "Comma-separated list of fields to include in the response"
        ),
      exclude_fields: z
        .string()
        .optional()
        .describe(
          "Comma-separated list of fields to exclude from the response"
        ),
      count: z
        .number()
        .optional()
        .describe("The number of records to return (default 10, max 1000)"),
      offset: z
        .number()
        .optional()
        .describe(
          "The number of records to skip (used for pagination, default 0)"
        ),
      since: z
        .string()
        .optional()
        .describe(
          "Restrict results to activity events that occur after a specific time (ISO 8601)"
        ),
    }),
    handler: async (args: {
      campaign_id: string;
      fields?: string;
      exclude_fields?: string;
      count?: number;
      offset?: number;
      since?: string;
    }) => {
      return mailchimpRequest(
        "GET",
        `/reports/${args.campaign_id}/email-activity`,
        undefined,
        {
          fields: args.fields,
          exclude_fields: args.exclude_fields,
          count: args.count,
          offset: args.offset,
          since: args.since,
        }
      );
    },
  },

  // 14. Get subscriber email activity
  {
    name: "mailchimp_get_subscriber_email_activity",
    description:
      "Get a specific list member's activity in a campaign, including opens, clicks, and bounces",
    inputSchema: z.object({
      campaign_id: z
        .string()
        .describe("The unique ID for the campaign"),
      subscriber_hash: z
        .string()
        .describe(
          "The MD5 hash of the lowercase version of the list member's email address"
        ),
      fields: z
        .string()
        .optional()
        .describe(
          "Comma-separated list of fields to include in the response"
        ),
      exclude_fields: z
        .string()
        .optional()
        .describe(
          "Comma-separated list of fields to exclude from the response"
        ),
      since: z
        .string()
        .optional()
        .describe(
          "Restrict results to activity events that occur after a specific time (ISO 8601)"
        ),
    }),
    handler: async (args: {
      campaign_id: string;
      subscriber_hash: string;
      fields?: string;
      exclude_fields?: string;
      since?: string;
    }) => {
      return mailchimpRequest(
        "GET",
        `/reports/${args.campaign_id}/email-activity/${args.subscriber_hash}`,
        undefined,
        {
          fields: args.fields,
          exclude_fields: args.exclude_fields,
          since: args.since,
        }
      );
    },
  },

  // 15. List top open locations
  {
    name: "mailchimp_list_top_open_locations",
    description:
      "Get top open locations for a specific campaign",
    inputSchema: z.object({
      campaign_id: z
        .string()
        .describe("The unique ID for the campaign"),
      fields: z
        .string()
        .optional()
        .describe(
          "Comma-separated list of fields to include in the response"
        ),
      exclude_fields: z
        .string()
        .optional()
        .describe(
          "Comma-separated list of fields to exclude from the response"
        ),
      count: z
        .number()
        .optional()
        .describe("The number of records to return (default 10, max 1000)"),
      offset: z
        .number()
        .optional()
        .describe(
          "The number of records to skip (used for pagination, default 0)"
        ),
    }),
    handler: async (args: {
      campaign_id: string;
      fields?: string;
      exclude_fields?: string;
      count?: number;
      offset?: number;
    }) => {
      return mailchimpRequest(
        "GET",
        `/reports/${args.campaign_id}/locations`,
        undefined,
        {
          fields: args.fields,
          exclude_fields: args.exclude_fields,
          count: args.count,
          offset: args.offset,
        }
      );
    },
  },

  // 16. List open details
  {
    name: "mailchimp_list_open_details",
    description:
      "Get detailed information about campaign members who opened a campaign",
    inputSchema: z.object({
      campaign_id: z
        .string()
        .describe("The unique ID for the campaign"),
      fields: z
        .string()
        .optional()
        .describe(
          "Comma-separated list of fields to include in the response"
        ),
      exclude_fields: z
        .string()
        .optional()
        .describe(
          "Comma-separated list of fields to exclude from the response"
        ),
      count: z
        .number()
        .optional()
        .describe("The number of records to return (default 10, max 1000)"),
      offset: z
        .number()
        .optional()
        .describe(
          "The number of records to skip (used for pagination, default 0)"
        ),
      since: z
        .string()
        .optional()
        .describe(
          "Restrict results to campaign open events that occur after a specific time (ISO 8601)"
        ),
    }),
    handler: async (args: {
      campaign_id: string;
      fields?: string;
      exclude_fields?: string;
      count?: number;
      offset?: number;
      since?: string;
    }) => {
      return mailchimpRequest(
        "GET",
        `/reports/${args.campaign_id}/open-details`,
        undefined,
        {
          fields: args.fields,
          exclude_fields: args.exclude_fields,
          count: args.count,
          offset: args.offset,
          since: args.since,
        }
      );
    },
  },

  // 17. Get open detail member
  {
    name: "mailchimp_get_open_detail_member",
    description:
      "Get information about a specific subscriber who opened a campaign",
    inputSchema: z.object({
      campaign_id: z
        .string()
        .describe("The unique ID for the campaign"),
      subscriber_hash: z
        .string()
        .describe(
          "The MD5 hash of the lowercase version of the list member's email address"
        ),
      fields: z
        .string()
        .optional()
        .describe(
          "Comma-separated list of fields to include in the response"
        ),
      exclude_fields: z
        .string()
        .optional()
        .describe(
          "Comma-separated list of fields to exclude from the response"
        ),
    }),
    handler: async (args: {
      campaign_id: string;
      subscriber_hash: string;
      fields?: string;
      exclude_fields?: string;
    }) => {
      return mailchimpRequest(
        "GET",
        `/reports/${args.campaign_id}/open-details/${args.subscriber_hash}`,
        undefined,
        {
          fields: args.fields,
          exclude_fields: args.exclude_fields,
        }
      );
    },
  },

  // 18. List sent-to members
  {
    name: "mailchimp_list_sent_to",
    description:
      "Get information about campaign recipients",
    inputSchema: z.object({
      campaign_id: z
        .string()
        .describe("The unique ID for the campaign"),
      fields: z
        .string()
        .optional()
        .describe(
          "Comma-separated list of fields to include in the response"
        ),
      exclude_fields: z
        .string()
        .optional()
        .describe(
          "Comma-separated list of fields to exclude from the response"
        ),
      count: z
        .number()
        .optional()
        .describe("The number of records to return (default 10, max 1000)"),
      offset: z
        .number()
        .optional()
        .describe(
          "The number of records to skip (used for pagination, default 0)"
        ),
    }),
    handler: async (args: {
      campaign_id: string;
      fields?: string;
      exclude_fields?: string;
      count?: number;
      offset?: number;
    }) => {
      return mailchimpRequest(
        "GET",
        `/reports/${args.campaign_id}/sent-to`,
        undefined,
        {
          fields: args.fields,
          exclude_fields: args.exclude_fields,
          count: args.count,
          offset: args.offset,
        }
      );
    },
  },

  // 19. Get sent-to member
  {
    name: "mailchimp_get_sent_to_member",
    description:
      "Get information about a specific campaign recipient",
    inputSchema: z.object({
      campaign_id: z
        .string()
        .describe("The unique ID for the campaign"),
      subscriber_hash: z
        .string()
        .describe(
          "The MD5 hash of the lowercase version of the list member's email address"
        ),
      fields: z
        .string()
        .optional()
        .describe(
          "Comma-separated list of fields to include in the response"
        ),
      exclude_fields: z
        .string()
        .optional()
        .describe(
          "Comma-separated list of fields to exclude from the response"
        ),
    }),
    handler: async (args: {
      campaign_id: string;
      subscriber_hash: string;
      fields?: string;
      exclude_fields?: string;
    }) => {
      return mailchimpRequest(
        "GET",
        `/reports/${args.campaign_id}/sent-to/${args.subscriber_hash}`,
        undefined,
        {
          fields: args.fields,
          exclude_fields: args.exclude_fields,
        }
      );
    },
  },

  // 20. List sub-reports
  {
    name: "mailchimp_list_sub_reports",
    description:
      "Get a list of reports with child campaigns for a specific parent campaign",
    inputSchema: z.object({
      campaign_id: z
        .string()
        .describe("The unique ID for the campaign"),
      fields: z
        .string()
        .optional()
        .describe(
          "Comma-separated list of fields to include in the response"
        ),
      exclude_fields: z
        .string()
        .optional()
        .describe(
          "Comma-separated list of fields to exclude from the response"
        ),
    }),
    handler: async (args: {
      campaign_id: string;
      fields?: string;
      exclude_fields?: string;
    }) => {
      return mailchimpRequest(
        "GET",
        `/reports/${args.campaign_id}/sub-reports`,
        undefined,
        {
          fields: args.fields,
          exclude_fields: args.exclude_fields,
        }
      );
    },
  },

  // 21. List unsubscribed members
  {
    name: "mailchimp_list_unsubscribed",
    description:
      "Get information about members who have unsubscribed from a specific campaign",
    inputSchema: z.object({
      campaign_id: z
        .string()
        .describe("The unique ID for the campaign"),
      fields: z
        .string()
        .optional()
        .describe(
          "Comma-separated list of fields to include in the response"
        ),
      exclude_fields: z
        .string()
        .optional()
        .describe(
          "Comma-separated list of fields to exclude from the response"
        ),
      count: z
        .number()
        .optional()
        .describe("The number of records to return (default 10, max 1000)"),
      offset: z
        .number()
        .optional()
        .describe(
          "The number of records to skip (used for pagination, default 0)"
        ),
    }),
    handler: async (args: {
      campaign_id: string;
      fields?: string;
      exclude_fields?: string;
      count?: number;
      offset?: number;
    }) => {
      return mailchimpRequest(
        "GET",
        `/reports/${args.campaign_id}/unsubscribed`,
        undefined,
        {
          fields: args.fields,
          exclude_fields: args.exclude_fields,
          count: args.count,
          offset: args.offset,
        }
      );
    },
  },

  // 22. Get unsubscribed member
  {
    name: "mailchimp_get_unsubscribed_member",
    description:
      "Get information about a specific member who unsubscribed from a campaign",
    inputSchema: z.object({
      campaign_id: z
        .string()
        .describe("The unique ID for the campaign"),
      subscriber_hash: z
        .string()
        .describe(
          "The MD5 hash of the lowercase version of the list member's email address"
        ),
      fields: z
        .string()
        .optional()
        .describe(
          "Comma-separated list of fields to include in the response"
        ),
      exclude_fields: z
        .string()
        .optional()
        .describe(
          "Comma-separated list of fields to exclude from the response"
        ),
    }),
    handler: async (args: {
      campaign_id: string;
      subscriber_hash: string;
      fields?: string;
      exclude_fields?: string;
    }) => {
      return mailchimpRequest(
        "GET",
        `/reports/${args.campaign_id}/unsubscribed/${args.subscriber_hash}`,
        undefined,
        {
          fields: args.fields,
          exclude_fields: args.exclude_fields,
        }
      );
    },
  },
];
