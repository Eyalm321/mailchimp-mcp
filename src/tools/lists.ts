import { z } from "zod";
import { mailchimpRequest } from "../client.js";

export const listTools = [
  // ─── Lists ───────────────────────────────────────────────────────────────────

  // 1. List lists
  {
    name: "mailchimp_list_lists",
    description: "Get information about all lists/audiences in the account",
    inputSchema: z.object({
      fields: z
        .string()
        .optional()
        .describe("Comma-separated list of fields to include in the response"),
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
        .describe("The number of records to skip (default 0)"),
      before_date_created: z
        .string()
        .optional()
        .describe(
          "Restrict results to lists created before this time (ISO 8601)"
        ),
      since_date_created: z
        .string()
        .optional()
        .describe(
          "Restrict results to lists created after this time (ISO 8601)"
        ),
      before_campaign_last_sent: z
        .string()
        .optional()
        .describe(
          "Restrict results to lists that had their last campaign sent before this time (ISO 8601)"
        ),
      since_campaign_last_sent: z
        .string()
        .optional()
        .describe(
          "Restrict results to lists that had their last campaign sent after this time (ISO 8601)"
        ),
      email: z
        .string()
        .optional()
        .describe(
          "Restrict results to lists that include a specific subscriber's email address"
        ),
      sort_field: z
        .enum(["date_created"])
        .optional()
        .describe("The field to sort by"),
      sort_dir: z
        .enum(["ASC", "DESC"])
        .optional()
        .describe("The sort direction"),
      has_ecommerce_store: z
        .boolean()
        .optional()
        .describe("Restrict results to lists that contain an active ecommerce store"),
    }),
    handler: async (args: Record<string, unknown>) => {
      return mailchimpRequest("GET", "/lists", undefined, args as Record<string, string | number | boolean | undefined>);
    },
  },

  // 2. Create list
  {
    name: "mailchimp_create_list",
    description:
      "Create a new list/audience in your Mailchimp account",
    inputSchema: z.object({
      name: z.string().describe("The name of the list"),
      contact: z
        .object({
          company: z.string().describe("The company name for the list"),
          address1: z.string().describe("The street address for the list contact"),
          address2: z.string().optional().describe("The second line of the street address"),
          city: z.string().describe("The city for the list contact"),
          state: z.string().describe("The state for the list contact"),
          zip: z.string().describe("The postal or zip code for the list contact"),
          country: z.string().describe("The country code (ISO 3166) for the list contact"),
          phone: z.string().optional().describe("The phone number for the list contact"),
        })
        .describe("Contact information for the list"),
      permission_reminder: z
        .string()
        .describe(
          "The permission reminder for the list (e.g. 'You signed up for updates on our website')"
        ),
      use_archive_bar: z
        .boolean()
        .optional()
        .describe("Whether campaigns for this list use the archive bar"),
      campaign_defaults: z
        .object({
          from_name: z.string().describe("The default from name for campaigns"),
          from_email: z.string().describe("The default from email for campaigns"),
          subject: z.string().describe("The default subject line for campaigns"),
          language: z.string().describe("The default language for campaigns (ISO 639-1 two-letter code)"),
        })
        .describe("Default values for campaigns created for this list"),
      notify_on_subscribe: z
        .string()
        .optional()
        .describe(
          "Email address to send subscribe notifications to"
        ),
      notify_on_unsubscribe: z
        .string()
        .optional()
        .describe(
          "Email address to send unsubscribe notifications to"
        ),
      email_type_option: z
        .boolean()
        .describe(
          "Whether the list supports multiple formats for emails (true) or just HTML (false)"
        ),
      double_optin: z
        .boolean()
        .optional()
        .describe("Whether to require double opt-in for subscriptions"),
      marketing_permissions: z
        .boolean()
        .optional()
        .describe("Whether the list has marketing permissions (GDPR) enabled"),
    }),
    handler: async (args: Record<string, unknown>) => {
      return mailchimpRequest("POST", "/lists", args);
    },
  },

  // 3. Delete list
  {
    name: "mailchimp_delete_list",
    description: "Delete a list/audience from your Mailchimp account",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
    }),
    handler: async (args: { list_id: string }) => {
      return mailchimpRequest("DELETE", `/lists/${args.list_id}`);
    },
  },

  // 4. Get list
  {
    name: "mailchimp_get_list",
    description: "Get information about a specific list/audience",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      fields: z
        .string()
        .optional()
        .describe("Comma-separated list of fields to include in the response"),
      exclude_fields: z
        .string()
        .optional()
        .describe(
          "Comma-separated list of fields to exclude from the response"
        ),
      include_total_contacts: z
        .boolean()
        .optional()
        .describe("Return the total_contacts field in the stats response"),
    }),
    handler: async (args: { list_id: string } & Record<string, unknown>) => {
      const { list_id, ...params } = args;
      return mailchimpRequest("GET", `/lists/${list_id}`, undefined, params as Record<string, string | number | boolean | undefined>);
    },
  },

  // 5. Update list
  {
    name: "mailchimp_update_list",
    description: "Update the settings for a specific list/audience",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      name: z.string().optional().describe("The name of the list"),
      contact: z
        .record(z.string(), z.unknown())
        .optional()
        .describe("Contact information for the list (company, address1, city, state, zip, country, etc.)"),
      permission_reminder: z
        .string()
        .optional()
        .describe("The permission reminder for the list"),
      use_archive_bar: z
        .boolean()
        .optional()
        .describe("Whether campaigns for this list use the archive bar"),
      campaign_defaults: z
        .record(z.string(), z.unknown())
        .optional()
        .describe("Default values for campaigns (from_name, from_email, subject, language)"),
      notify_on_subscribe: z
        .string()
        .optional()
        .describe("Email address to send subscribe notifications to"),
      notify_on_unsubscribe: z
        .string()
        .optional()
        .describe("Email address to send unsubscribe notifications to"),
      email_type_option: z
        .boolean()
        .optional()
        .describe("Whether the list supports multiple formats for emails"),
      double_optin: z
        .boolean()
        .optional()
        .describe("Whether to require double opt-in"),
      marketing_permissions: z
        .boolean()
        .optional()
        .describe("Whether the list has marketing permissions (GDPR) enabled"),
    }),
    handler: async (args: Record<string, unknown>) => {
      const { list_id, ...body } = args;
      return mailchimpRequest("PATCH", `/lists/${list_id}`, body);
    },
  },

  // 6. Batch list members
  {
    name: "mailchimp_batch_list_members",
    description:
      "Batch subscribe or unsubscribe list members (add or update multiple members at once)",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      members: z
        .array(z.record(z.string(), z.unknown()))
        .describe(
          "Array of member objects with email_address, status (subscribed/unsubscribed/cleaned/pending), and optional email_type, merge_fields, interests, language, vip, location, tags"
        ),
      sync_tags: z
        .boolean()
        .optional()
        .describe("Whether to sync member tags"),
      update_existing: z
        .boolean()
        .optional()
        .describe("Whether to update existing members matched by email"),
    }),
    handler: async (args: Record<string, unknown>) => {
      const { list_id, ...body } = args;
      return mailchimpRequest("POST", `/lists/${list_id}`, body);
    },
  },

  // ─── Abuse Reports ───────────────────────────────────────────────────────────

  // 7. List abuse reports
  {
    name: "mailchimp_list_abuse_reports",
    description: "Get all abuse reports for a specific list",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      fields: z
        .string()
        .optional()
        .describe("Comma-separated list of fields to include in the response"),
      exclude_fields: z
        .string()
        .optional()
        .describe("Comma-separated list of fields to exclude from the response"),
      count: z.number().optional().describe("The number of records to return (default 10, max 1000)"),
      offset: z.number().optional().describe("The number of records to skip (default 0)"),
    }),
    handler: async (args: { list_id: string } & Record<string, unknown>) => {
      const { list_id, ...params } = args;
      return mailchimpRequest("GET", `/lists/${list_id}/abuse-reports`, undefined, params as Record<string, string | number | boolean | undefined>);
    },
  },

  // 8. Get abuse report
  {
    name: "mailchimp_get_abuse_report",
    description: "Get details about a specific abuse report for a list",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      report_id: z.string().describe("The ID for the abuse report"),
      fields: z.string().optional().describe("Comma-separated list of fields to include"),
      exclude_fields: z.string().optional().describe("Comma-separated list of fields to exclude"),
    }),
    handler: async (args: { list_id: string; report_id: string } & Record<string, unknown>) => {
      const { list_id, report_id, ...params } = args;
      return mailchimpRequest("GET", `/lists/${list_id}/abuse-reports/${report_id}`, undefined, params as Record<string, string | number | boolean | undefined>);
    },
  },

  // ─── Activity & Clients ──────────────────────────────────────────────────────

  // 9. List activity
  {
    name: "mailchimp_list_activity",
    description: "Get up to the previous 180 days of daily detailed aggregated activity stats for a list",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      fields: z.string().optional().describe("Comma-separated list of fields to include"),
      exclude_fields: z.string().optional().describe("Comma-separated list of fields to exclude"),
      count: z.number().optional().describe("The number of records to return (default 10, max 1000)"),
      offset: z.number().optional().describe("The number of records to skip (default 0)"),
    }),
    handler: async (args: { list_id: string } & Record<string, unknown>) => {
      const { list_id, ...params } = args;
      return mailchimpRequest("GET", `/lists/${list_id}/activity`, undefined, params as Record<string, string | number | boolean | undefined>);
    },
  },

  // 10. List clients
  {
    name: "mailchimp_list_clients",
    description: "Get a list of the top email clients based on user-agent strings for a specific list",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      fields: z.string().optional().describe("Comma-separated list of fields to include"),
      exclude_fields: z.string().optional().describe("Comma-separated list of fields to exclude"),
    }),
    handler: async (args: { list_id: string } & Record<string, unknown>) => {
      const { list_id, ...params } = args;
      return mailchimpRequest("GET", `/lists/${list_id}/clients`, undefined, params as Record<string, string | number | boolean | undefined>);
    },
  },

  // ─── Growth History ──────────────────────────────────────────────────────────

  // 11. List growth history
  {
    name: "mailchimp_list_growth_history",
    description: "Get a month-by-month summary of a specific list's growth activity",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      fields: z.string().optional().describe("Comma-separated list of fields to include"),
      exclude_fields: z.string().optional().describe("Comma-separated list of fields to exclude"),
      count: z.number().optional().describe("The number of records to return (default 10, max 1000)"),
      offset: z.number().optional().describe("The number of records to skip (default 0)"),
      sort_field: z.enum(["month"]).optional().describe("The field to sort by"),
      sort_dir: z.enum(["ASC", "DESC"]).optional().describe("The sort direction"),
    }),
    handler: async (args: { list_id: string } & Record<string, unknown>) => {
      const { list_id, ...params } = args;
      return mailchimpRequest("GET", `/lists/${list_id}/growth-history`, undefined, params as Record<string, string | number | boolean | undefined>);
    },
  },

  // 12. Get growth history month
  {
    name: "mailchimp_get_growth_history_month",
    description: "Get a summary of a specific list's growth activity for a specific month",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      month: z.string().describe("A specific month of list growth history (format: YYYY-MM)"),
      fields: z.string().optional().describe("Comma-separated list of fields to include"),
      exclude_fields: z.string().optional().describe("Comma-separated list of fields to exclude"),
    }),
    handler: async (args: { list_id: string; month: string } & Record<string, unknown>) => {
      const { list_id, month, ...params } = args;
      return mailchimpRequest("GET", `/lists/${list_id}/growth-history/${month}`, undefined, params as Record<string, string | number | boolean | undefined>);
    },
  },

  // ─── Interest Categories ─────────────────────────────────────────────────────

  // 13. List interest categories
  {
    name: "mailchimp_list_interest_categories",
    description: "Get information about a list's interest categories",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      fields: z.string().optional().describe("Comma-separated list of fields to include"),
      exclude_fields: z.string().optional().describe("Comma-separated list of fields to exclude"),
      count: z.number().optional().describe("The number of records to return (default 10, max 1000)"),
      offset: z.number().optional().describe("The number of records to skip (default 0)"),
      type: z
        .enum(["checkboxes", "dropdown", "radio", "hidden"])
        .optional()
        .describe("Restrict results to interest categories of a specific type"),
    }),
    handler: async (args: { list_id: string } & Record<string, unknown>) => {
      const { list_id, ...params } = args;
      return mailchimpRequest("GET", `/lists/${list_id}/interest-categories`, undefined, params as Record<string, string | number | boolean | undefined>);
    },
  },

  // 14. Create interest category
  {
    name: "mailchimp_create_interest_category",
    description: "Create a new interest category for a specific list",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      title: z.string().describe("The text description of this category"),
      display_order: z.number().optional().describe("The order that the categories are displayed in the list"),
      type: z
        .enum(["checkboxes", "dropdown", "radio", "hidden"])
        .describe("Determines how this category's interests appear on signup forms"),
    }),
    handler: async (args: Record<string, unknown>) => {
      const { list_id, ...body } = args;
      return mailchimpRequest("POST", `/lists/${list_id}/interest-categories`, body);
    },
  },

  // 15. Delete interest category
  {
    name: "mailchimp_delete_interest_category",
    description: "Delete a specific interest category for a list",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      interest_category_id: z.string().describe("The unique ID for the interest category"),
    }),
    handler: async (args: { list_id: string; interest_category_id: string }) => {
      return mailchimpRequest("DELETE", `/lists/${args.list_id}/interest-categories/${args.interest_category_id}`);
    },
  },

  // 16. Get interest category
  {
    name: "mailchimp_get_interest_category",
    description: "Get information about a specific interest category",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      interest_category_id: z.string().describe("The unique ID for the interest category"),
      fields: z.string().optional().describe("Comma-separated list of fields to include"),
      exclude_fields: z.string().optional().describe("Comma-separated list of fields to exclude"),
    }),
    handler: async (args: { list_id: string; interest_category_id: string } & Record<string, unknown>) => {
      const { list_id, interest_category_id, ...params } = args;
      return mailchimpRequest("GET", `/lists/${list_id}/interest-categories/${interest_category_id}`, undefined, params as Record<string, string | number | boolean | undefined>);
    },
  },

  // 17. Update interest category
  {
    name: "mailchimp_update_interest_category",
    description: "Update an existing interest category",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      interest_category_id: z.string().describe("The unique ID for the interest category"),
      title: z.string().optional().describe("The text description of this category"),
      display_order: z.number().optional().describe("The display order for this category"),
      type: z
        .enum(["checkboxes", "dropdown", "radio", "hidden"])
        .optional()
        .describe("Determines how this category's interests appear on signup forms"),
    }),
    handler: async (args: Record<string, unknown>) => {
      const { list_id, interest_category_id, ...body } = args;
      return mailchimpRequest("PATCH", `/lists/${list_id}/interest-categories/${interest_category_id}`, body);
    },
  },

  // ─── Interests ───────────────────────────────────────────────────────────────

  // 18. List interests
  {
    name: "mailchimp_list_interests",
    description: "Get a list of this category's interests for a specific list",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      interest_category_id: z.string().describe("The unique ID for the interest category"),
      fields: z.string().optional().describe("Comma-separated list of fields to include"),
      exclude_fields: z.string().optional().describe("Comma-separated list of fields to exclude"),
      count: z.number().optional().describe("The number of records to return (default 10, max 1000)"),
      offset: z.number().optional().describe("The number of records to skip (default 0)"),
    }),
    handler: async (args: { list_id: string; interest_category_id: string } & Record<string, unknown>) => {
      const { list_id, interest_category_id, ...params } = args;
      return mailchimpRequest("GET", `/lists/${list_id}/interest-categories/${interest_category_id}/interests`, undefined, params as Record<string, string | number | boolean | undefined>);
    },
  },

  // 19. Create interest
  {
    name: "mailchimp_create_interest",
    description: "Create a new interest within an interest category",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      interest_category_id: z.string().describe("The unique ID for the interest category"),
      name: z.string().describe("The name of the interest"),
      display_order: z.number().optional().describe("The display order for this interest"),
    }),
    handler: async (args: Record<string, unknown>) => {
      const { list_id, interest_category_id, ...body } = args;
      return mailchimpRequest("POST", `/lists/${list_id}/interest-categories/${interest_category_id}/interests`, body);
    },
  },

  // 20. Delete interest
  {
    name: "mailchimp_delete_interest",
    description: "Delete an interest within an interest category",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      interest_category_id: z.string().describe("The unique ID for the interest category"),
      interest_id: z.string().describe("The specific interest ID"),
    }),
    handler: async (args: { list_id: string; interest_category_id: string; interest_id: string }) => {
      return mailchimpRequest("DELETE", `/lists/${args.list_id}/interest-categories/${args.interest_category_id}/interests/${args.interest_id}`);
    },
  },

  // 21. Get interest
  {
    name: "mailchimp_get_interest",
    description: "Get information about a specific interest in an interest category",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      interest_category_id: z.string().describe("The unique ID for the interest category"),
      interest_id: z.string().describe("The specific interest ID"),
      fields: z.string().optional().describe("Comma-separated list of fields to include"),
      exclude_fields: z.string().optional().describe("Comma-separated list of fields to exclude"),
    }),
    handler: async (args: { list_id: string; interest_category_id: string; interest_id: string } & Record<string, unknown>) => {
      const { list_id, interest_category_id, interest_id, ...params } = args;
      return mailchimpRequest("GET", `/lists/${list_id}/interest-categories/${interest_category_id}/interests/${interest_id}`, undefined, params as Record<string, string | number | boolean | undefined>);
    },
  },

  // 22. Update interest
  {
    name: "mailchimp_update_interest",
    description: "Update an existing interest in an interest category",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      interest_category_id: z.string().describe("The unique ID for the interest category"),
      interest_id: z.string().describe("The specific interest ID"),
      name: z.string().optional().describe("The name of the interest"),
      display_order: z.number().optional().describe("The display order for this interest"),
    }),
    handler: async (args: Record<string, unknown>) => {
      const { list_id, interest_category_id, interest_id, ...body } = args;
      return mailchimpRequest("PATCH", `/lists/${list_id}/interest-categories/${interest_category_id}/interests/${interest_id}`, body);
    },
  },

  // ─── Locations ───────────────────────────────────────────────────────────────

  // 23. List locations
  {
    name: "mailchimp_list_locations",
    description: "Get the locations (countries) that the list's subscribers have been tagged to based on geocoding their IP address",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      fields: z.string().optional().describe("Comma-separated list of fields to include"),
      exclude_fields: z.string().optional().describe("Comma-separated list of fields to exclude"),
    }),
    handler: async (args: { list_id: string } & Record<string, unknown>) => {
      const { list_id, ...params } = args;
      return mailchimpRequest("GET", `/lists/${list_id}/locations`, undefined, params as Record<string, string | number | boolean | undefined>);
    },
  },

  // ─── Members ─────────────────────────────────────────────────────────────────

  // 24. List members
  {
    name: "mailchimp_list_members",
    description: "Get information about members in a specific list/audience",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      fields: z.string().optional().describe("Comma-separated list of fields to include"),
      exclude_fields: z.string().optional().describe("Comma-separated list of fields to exclude"),
      count: z.number().optional().describe("The number of records to return (default 10, max 1000)"),
      offset: z.number().optional().describe("The number of records to skip (default 0)"),
      email_type: z.string().optional().describe("The email type (html or text)"),
      status: z
        .enum(["subscribed", "unsubscribed", "cleaned", "pending", "transactional", "archived"])
        .optional()
        .describe("The subscriber status to filter by"),
      since_timestamp_opt: z.string().optional().describe("Restrict results to subscribers who opted-in after this time (ISO 8601)"),
      before_timestamp_opt: z.string().optional().describe("Restrict results to subscribers who opted-in before this time (ISO 8601)"),
      since_last_changed: z.string().optional().describe("Restrict results to subscribers whose information changed after this time (ISO 8601)"),
      before_last_changed: z.string().optional().describe("Restrict results to subscribers whose information changed before this time (ISO 8601)"),
      unique_email_id: z.string().optional().describe("A unique identifier for the email address across all lists"),
      vip_only: z.boolean().optional().describe("Restrict results to only VIP members"),
      interest_category_id: z.string().optional().describe("The unique ID for the interest category to filter by"),
      interest_ids: z.string().optional().describe("Comma-separated list of interest IDs to filter by"),
      interest_match: z.enum(["any", "all", "none"]).optional().describe("How to match interests: any, all, or none"),
      sort_field: z
        .enum(["timestamp_opt", "timestamp_signup", "last_changed"])
        .optional()
        .describe("The field to sort by"),
      sort_dir: z.enum(["ASC", "DESC"]).optional().describe("The sort direction"),
      since_last_campaign: z.boolean().optional().describe("Filter by subscribers who were sent the last campaign"),
      unsubscribed_since: z.string().optional().describe("Restrict results to subscribers who unsubscribed after this time (ISO 8601)"),
    }),
    handler: async (args: { list_id: string } & Record<string, unknown>) => {
      const { list_id, ...params } = args;
      return mailchimpRequest("GET", `/lists/${list_id}/members`, undefined, params as Record<string, string | number | boolean | undefined>);
    },
  },

  // 25. Add member
  {
    name: "mailchimp_add_member",
    description: "Add a new member to a list/audience",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      email_address: z.string().describe("The email address for the subscriber"),
      email_type: z.enum(["html", "text"]).optional().describe("The type of email the subscriber prefers"),
      status: z
        .enum(["subscribed", "unsubscribed", "cleaned", "pending", "transactional"])
        .describe("The subscriber's status"),
      merge_fields: z.record(z.string(), z.unknown()).optional().describe("A dictionary of merge fields (e.g. FNAME, LNAME)"),
      interests: z.record(z.string(), z.boolean()).optional().describe("A dictionary of interests with interest ID as key and boolean as value"),
      language: z.string().optional().describe("The subscriber's language (ISO 639-1 two-letter code)"),
      vip: z.boolean().optional().describe("VIP status for the subscriber"),
      location: z.record(z.string(), z.unknown()).optional().describe("Subscriber location with latitude and longitude"),
      marketing_permissions: z.array(z.record(z.string(), z.unknown())).optional().describe("Marketing permissions for the subscriber (GDPR)"),
      ip_signup: z.string().optional().describe("IP address the subscriber signed up from"),
      timestamp_signup: z.string().optional().describe("The date and time the subscriber signed up (ISO 8601)"),
      ip_opt: z.string().optional().describe("IP address the subscriber confirmed their opt-in from"),
      timestamp_opt: z.string().optional().describe("The date and time the subscriber confirmed their opt-in (ISO 8601)"),
      tags: z.array(z.string()).optional().describe("Tags to assign to the subscriber"),
    }),
    handler: async (args: Record<string, unknown>) => {
      const { list_id, ...body } = args;
      return mailchimpRequest("POST", `/lists/${list_id}/members`, body);
    },
  },

  // 26. Archive member
  {
    name: "mailchimp_archive_member",
    description: "Archive a list member (remove from the list without permanently deleting)",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      subscriber_hash: z
        .string()
        .describe("The MD5 hash of the lowercase version of the list member's email address, or the email address itself"),
    }),
    handler: async (args: { list_id: string; subscriber_hash: string }) => {
      return mailchimpRequest("DELETE", `/lists/${args.list_id}/members/${args.subscriber_hash}`);
    },
  },

  // 27. Get member
  {
    name: "mailchimp_get_member",
    description: "Get information about a specific member in a list/audience",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      subscriber_hash: z.string().describe("The MD5 hash of the lowercase version of the list member's email address, or the email address itself"),
      fields: z.string().optional().describe("Comma-separated list of fields to include"),
      exclude_fields: z.string().optional().describe("Comma-separated list of fields to exclude"),
    }),
    handler: async (args: { list_id: string; subscriber_hash: string } & Record<string, unknown>) => {
      const { list_id, subscriber_hash, ...params } = args;
      return mailchimpRequest("GET", `/lists/${list_id}/members/${subscriber_hash}`, undefined, params as Record<string, string | number | boolean | undefined>);
    },
  },

  // 28. Update member
  {
    name: "mailchimp_update_member",
    description: "Update information for a specific list member",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      subscriber_hash: z.string().describe("The MD5 hash of the lowercase version of the list member's email address, or the email address itself"),
      email_address: z.string().optional().describe("The email address for the subscriber"),
      email_type: z.enum(["html", "text"]).optional().describe("The type of email the subscriber prefers"),
      status: z
        .enum(["subscribed", "unsubscribed", "cleaned", "pending", "transactional"])
        .optional()
        .describe("The subscriber's status"),
      merge_fields: z.record(z.string(), z.unknown()).optional().describe("A dictionary of merge fields"),
      interests: z.record(z.string(), z.boolean()).optional().describe("A dictionary of interests"),
      language: z.string().optional().describe("The subscriber's language"),
      vip: z.boolean().optional().describe("VIP status for the subscriber"),
      location: z.record(z.string(), z.unknown()).optional().describe("Subscriber location"),
      marketing_permissions: z.array(z.record(z.string(), z.unknown())).optional().describe("Marketing permissions for the subscriber"),
      ip_signup: z.string().optional().describe("IP address the subscriber signed up from"),
      timestamp_signup: z.string().optional().describe("The date and time the subscriber signed up (ISO 8601)"),
      ip_opt: z.string().optional().describe("IP address the subscriber confirmed their opt-in from"),
      timestamp_opt: z.string().optional().describe("The date and time the subscriber confirmed their opt-in (ISO 8601)"),
    }),
    handler: async (args: Record<string, unknown>) => {
      const { list_id, subscriber_hash, ...body } = args;
      return mailchimpRequest("PATCH", `/lists/${list_id}/members/${subscriber_hash}`, body);
    },
  },

  // 29. Upsert member
  {
    name: "mailchimp_upsert_member",
    description: "Add or update a list member. If the member exists, update their info; if not, add them.",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      subscriber_hash: z.string().describe("The MD5 hash of the lowercase version of the list member's email address, or the email address itself"),
      email_address: z.string().describe("The email address for the subscriber"),
      status_if_new: z
        .enum(["subscribed", "unsubscribed", "cleaned", "pending", "transactional"])
        .describe("The subscriber's status if they are new"),
      email_type: z.enum(["html", "text"]).optional().describe("The type of email the subscriber prefers"),
      status: z
        .enum(["subscribed", "unsubscribed", "cleaned", "pending", "transactional"])
        .optional()
        .describe("The subscriber's current status"),
      merge_fields: z.record(z.string(), z.unknown()).optional().describe("A dictionary of merge fields"),
      interests: z.record(z.string(), z.boolean()).optional().describe("A dictionary of interests"),
      language: z.string().optional().describe("The subscriber's language"),
      vip: z.boolean().optional().describe("VIP status for the subscriber"),
      location: z.record(z.string(), z.unknown()).optional().describe("Subscriber location"),
      marketing_permissions: z.array(z.record(z.string(), z.unknown())).optional().describe("Marketing permissions"),
      ip_signup: z.string().optional().describe("IP address the subscriber signed up from"),
      timestamp_signup: z.string().optional().describe("The date and time the subscriber signed up (ISO 8601)"),
      ip_opt: z.string().optional().describe("IP address the subscriber confirmed their opt-in from"),
      timestamp_opt: z.string().optional().describe("The date and time the subscriber confirmed their opt-in (ISO 8601)"),
    }),
    handler: async (args: Record<string, unknown>) => {
      const { list_id, subscriber_hash, ...body } = args;
      return mailchimpRequest("PUT", `/lists/${list_id}/members/${subscriber_hash}`, body);
    },
  },

  // 30. Delete member permanent
  {
    name: "mailchimp_delete_member_permanent",
    description: "Permanently delete a list member (cannot be undone)",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      subscriber_hash: z.string().describe("The MD5 hash of the lowercase version of the list member's email address, or the email address itself"),
    }),
    handler: async (args: { list_id: string; subscriber_hash: string }) => {
      return mailchimpRequest("POST", `/lists/${args.list_id}/members/${args.subscriber_hash}/actions/delete-permanent`);
    },
  },

  // ─── Member Activity ─────────────────────────────────────────────────────────

  // 31. List member activity
  {
    name: "mailchimp_list_member_activity",
    description: "Get the last 50 events of a member's activity on a specific list",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      subscriber_hash: z.string().describe("The MD5 hash of the lowercase version of the list member's email address, or the email address itself"),
      fields: z.string().optional().describe("Comma-separated list of fields to include"),
      exclude_fields: z.string().optional().describe("Comma-separated list of fields to exclude"),
      count: z.number().optional().describe("The number of records to return (default 10, max 1000)"),
      offset: z.number().optional().describe("The number of records to skip (default 0)"),
      action: z.string().optional().describe("Filter by activity action type"),
    }),
    handler: async (args: { list_id: string; subscriber_hash: string } & Record<string, unknown>) => {
      const { list_id, subscriber_hash, ...params } = args;
      return mailchimpRequest("GET", `/lists/${list_id}/members/${subscriber_hash}/activity`, undefined, params as Record<string, string | number | boolean | undefined>);
    },
  },

  // 32. List member activity feed
  {
    name: "mailchimp_list_member_activity_feed",
    description: "Get a member's activity feed on a specific list including opens, clicks, and other events",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      subscriber_hash: z.string().describe("The MD5 hash of the lowercase version of the list member's email address, or the email address itself"),
      fields: z.string().optional().describe("Comma-separated list of fields to include"),
      exclude_fields: z.string().optional().describe("Comma-separated list of fields to exclude"),
      count: z.number().optional().describe("The number of records to return (default 10, max 1000)"),
      offset: z.number().optional().describe("The number of records to skip (default 0)"),
    }),
    handler: async (args: { list_id: string; subscriber_hash: string } & Record<string, unknown>) => {
      const { list_id, subscriber_hash, ...params } = args;
      return mailchimpRequest("GET", `/lists/${list_id}/members/${subscriber_hash}/activity-feed`, undefined, params as Record<string, string | number | boolean | undefined>);
    },
  },

  // ─── Member Events ───────────────────────────────────────────────────────────

  // 33. List member events
  {
    name: "mailchimp_list_member_events",
    description: "Get events for a contact/member",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      subscriber_hash: z.string().describe("The MD5 hash of the lowercase version of the list member's email address, or the email address itself"),
      fields: z.string().optional().describe("Comma-separated list of fields to include"),
      exclude_fields: z.string().optional().describe("Comma-separated list of fields to exclude"),
      count: z.number().optional().describe("The number of records to return (default 10, max 1000)"),
      offset: z.number().optional().describe("The number of records to skip (default 0)"),
    }),
    handler: async (args: { list_id: string; subscriber_hash: string } & Record<string, unknown>) => {
      const { list_id, subscriber_hash, ...params } = args;
      return mailchimpRequest("GET", `/lists/${list_id}/members/${subscriber_hash}/events`, undefined, params as Record<string, string | number | boolean | undefined>);
    },
  },

  // 34. Create member event
  {
    name: "mailchimp_create_member_event",
    description: "Add a new event for a list member",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      subscriber_hash: z.string().describe("The MD5 hash of the lowercase version of the list member's email address, or the email address itself"),
      name: z.string().describe("The name of the event"),
      properties: z.record(z.string(), z.string()).optional().describe("An optional list of properties for the event"),
      is_syncing: z.boolean().optional().describe("Whether this is a synced event (backfill)"),
      occurred_at: z.string().optional().describe("The date and time the event occurred (ISO 8601)"),
    }),
    handler: async (args: Record<string, unknown>) => {
      const { list_id, subscriber_hash, ...body } = args;
      return mailchimpRequest("POST", `/lists/${list_id}/members/${subscriber_hash}/events`, body);
    },
  },

  // ─── Member Goals ────────────────────────────────────────────────────────────

  // 35. List member goals
  {
    name: "mailchimp_list_member_goals",
    description: "Get the last 50 Goal events for a member on a specific list",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      subscriber_hash: z.string().describe("The MD5 hash of the lowercase version of the list member's email address, or the email address itself"),
      fields: z.string().optional().describe("Comma-separated list of fields to include"),
      exclude_fields: z.string().optional().describe("Comma-separated list of fields to exclude"),
    }),
    handler: async (args: { list_id: string; subscriber_hash: string } & Record<string, unknown>) => {
      const { list_id, subscriber_hash, ...params } = args;
      return mailchimpRequest("GET", `/lists/${list_id}/members/${subscriber_hash}/goals`, undefined, params as Record<string, string | number | boolean | undefined>);
    },
  },

  // ─── Member Notes ────────────────────────────────────────────────────────────

  // 36. List member notes
  {
    name: "mailchimp_list_member_notes",
    description: "Get recent notes for a specific list member",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      subscriber_hash: z.string().describe("The MD5 hash of the lowercase version of the list member's email address, or the email address itself"),
      fields: z.string().optional().describe("Comma-separated list of fields to include"),
      exclude_fields: z.string().optional().describe("Comma-separated list of fields to exclude"),
      count: z.number().optional().describe("The number of records to return (default 10, max 1000)"),
      offset: z.number().optional().describe("The number of records to skip (default 0)"),
      sort_field: z.enum(["created_at", "updated_at", "note_id"]).optional().describe("The field to sort by"),
      sort_dir: z.enum(["ASC", "DESC"]).optional().describe("The sort direction"),
    }),
    handler: async (args: { list_id: string; subscriber_hash: string } & Record<string, unknown>) => {
      const { list_id, subscriber_hash, ...params } = args;
      return mailchimpRequest("GET", `/lists/${list_id}/members/${subscriber_hash}/notes`, undefined, params as Record<string, string | number | boolean | undefined>);
    },
  },

  // 37. Create member note
  {
    name: "mailchimp_create_member_note",
    description: "Add a new note for a specific list member",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      subscriber_hash: z.string().describe("The MD5 hash of the lowercase version of the list member's email address, or the email address itself"),
      note: z.string().describe("The content of the note. Note length is limited to 1,000 characters."),
    }),
    handler: async (args: Record<string, unknown>) => {
      const { list_id, subscriber_hash, ...body } = args;
      return mailchimpRequest("POST", `/lists/${list_id}/members/${subscriber_hash}/notes`, body);
    },
  },

  // 38. Delete member note
  {
    name: "mailchimp_delete_member_note",
    description: "Delete a specific note for a list member",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      subscriber_hash: z.string().describe("The MD5 hash of the lowercase version of the list member's email address, or the email address itself"),
      note_id: z.string().describe("The ID of the note"),
    }),
    handler: async (args: { list_id: string; subscriber_hash: string; note_id: string }) => {
      return mailchimpRequest("DELETE", `/lists/${args.list_id}/members/${args.subscriber_hash}/notes/${args.note_id}`);
    },
  },

  // 39. Get member note
  {
    name: "mailchimp_get_member_note",
    description: "Get a specific note for a list member",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      subscriber_hash: z.string().describe("The MD5 hash of the lowercase version of the list member's email address, or the email address itself"),
      note_id: z.string().describe("The ID of the note"),
      fields: z.string().optional().describe("Comma-separated list of fields to include"),
      exclude_fields: z.string().optional().describe("Comma-separated list of fields to exclude"),
    }),
    handler: async (args: { list_id: string; subscriber_hash: string; note_id: string } & Record<string, unknown>) => {
      const { list_id, subscriber_hash, note_id, ...params } = args;
      return mailchimpRequest("GET", `/lists/${list_id}/members/${subscriber_hash}/notes/${note_id}`, undefined, params as Record<string, string | number | boolean | undefined>);
    },
  },

  // 40. Update member note
  {
    name: "mailchimp_update_member_note",
    description: "Update a specific note for a list member",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      subscriber_hash: z.string().describe("The MD5 hash of the lowercase version of the list member's email address, or the email address itself"),
      note_id: z.string().describe("The ID of the note"),
      note: z.string().describe("The content of the note"),
    }),
    handler: async (args: Record<string, unknown>) => {
      const { list_id, subscriber_hash, note_id, ...body } = args;
      return mailchimpRequest("PATCH", `/lists/${list_id}/members/${subscriber_hash}/notes/${note_id}`, body);
    },
  },

  // ─── Member Tags ─────────────────────────────────────────────────────────────

  // 41. List member tags
  {
    name: "mailchimp_list_member_tags",
    description: "Get the tags on a list member",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      subscriber_hash: z.string().describe("The MD5 hash of the lowercase version of the list member's email address, or the email address itself"),
      fields: z.string().optional().describe("Comma-separated list of fields to include"),
      exclude_fields: z.string().optional().describe("Comma-separated list of fields to exclude"),
      count: z.number().optional().describe("The number of records to return (default 10, max 1000)"),
      offset: z.number().optional().describe("The number of records to skip (default 0)"),
    }),
    handler: async (args: { list_id: string; subscriber_hash: string } & Record<string, unknown>) => {
      const { list_id, subscriber_hash, ...params } = args;
      return mailchimpRequest("GET", `/lists/${list_id}/members/${subscriber_hash}/tags`, undefined, params as Record<string, string | number | boolean | undefined>);
    },
  },

  // 42. Update member tags
  {
    name: "mailchimp_update_member_tags",
    description: "Add or remove tags on a list member",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      subscriber_hash: z.string().describe("The MD5 hash of the lowercase version of the list member's email address, or the email address itself"),
      tags: z
        .array(
          z.object({
            name: z.string().describe("The name of the tag"),
            status: z.enum(["active", "inactive"]).describe("The status of the tag (active to add, inactive to remove)"),
          })
        )
        .describe("A list of tags with name and status"),
      is_syncing: z.boolean().optional().describe("Whether this is a synced (backfill) operation"),
    }),
    handler: async (args: Record<string, unknown>) => {
      const { list_id, subscriber_hash, ...body } = args;
      return mailchimpRequest("POST", `/lists/${list_id}/members/${subscriber_hash}/tags`, body);
    },
  },

  // ─── Merge Fields ────────────────────────────────────────────────────────────

  // 43. List merge fields
  {
    name: "mailchimp_list_merge_fields",
    description: "Get the merge fields (audience fields) for a list",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      fields: z.string().optional().describe("Comma-separated list of fields to include"),
      exclude_fields: z.string().optional().describe("Comma-separated list of fields to exclude"),
      count: z.number().optional().describe("The number of records to return (default 10, max 1000)"),
      offset: z.number().optional().describe("The number of records to skip (default 0)"),
      type: z.string().optional().describe("The merge field type to filter by"),
      required: z.boolean().optional().describe("Whether to filter by required merge fields"),
    }),
    handler: async (args: { list_id: string } & Record<string, unknown>) => {
      const { list_id, ...params } = args;
      return mailchimpRequest("GET", `/lists/${list_id}/merge-fields`, undefined, params as Record<string, string | number | boolean | undefined>);
    },
  },

  // 44. Create merge field
  {
    name: "mailchimp_create_merge_field",
    description: "Add a new merge field (audience field) for a specific list",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      tag: z.string().optional().describe("The merge tag for the merge field (e.g. FNAME)"),
      name: z.string().describe("The name of the merge field"),
      type: z
        .enum(["text", "number", "address", "phone", "date", "url", "imageurl", "radio", "dropdown", "birthday", "zip"])
        .describe("The merge field type"),
      required: z.boolean().optional().describe("Whether the merge field is required"),
      default_value: z.string().optional().describe("The default value for the merge field"),
      public: z.boolean().optional().describe("Whether the merge field is displayed on the signup form"),
      display_order: z.number().optional().describe("The order that the merge field displays on the list signup form"),
      options: z
        .record(z.string(), z.unknown())
        .optional()
        .describe("Extra options for some merge field types (default_country, phone_format, date_format, choices, size)"),
    }),
    handler: async (args: Record<string, unknown>) => {
      const { list_id, ...body } = args;
      return mailchimpRequest("POST", `/lists/${list_id}/merge-fields`, body);
    },
  },

  // 45. Delete merge field
  {
    name: "mailchimp_delete_merge_field",
    description: "Delete a specific merge field from a list",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      merge_id: z.string().describe("The ID for the merge field"),
    }),
    handler: async (args: { list_id: string; merge_id: string }) => {
      return mailchimpRequest("DELETE", `/lists/${args.list_id}/merge-fields/${args.merge_id}`);
    },
  },

  // 46. Get merge field
  {
    name: "mailchimp_get_merge_field",
    description: "Get information about a specific merge field for a list",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      merge_id: z.string().describe("The ID for the merge field"),
      fields: z.string().optional().describe("Comma-separated list of fields to include"),
      exclude_fields: z.string().optional().describe("Comma-separated list of fields to exclude"),
    }),
    handler: async (args: { list_id: string; merge_id: string } & Record<string, unknown>) => {
      const { list_id, merge_id, ...params } = args;
      return mailchimpRequest("GET", `/lists/${list_id}/merge-fields/${merge_id}`, undefined, params as Record<string, string | number | boolean | undefined>);
    },
  },

  // 47. Update merge field
  {
    name: "mailchimp_update_merge_field",
    description: "Update a specific merge field for a list",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      merge_id: z.string().describe("The ID for the merge field"),
      tag: z.string().optional().describe("The merge tag"),
      name: z.string().optional().describe("The name of the merge field"),
      type: z
        .enum(["text", "number", "address", "phone", "date", "url", "imageurl", "radio", "dropdown", "birthday", "zip"])
        .optional()
        .describe("The merge field type"),
      required: z.boolean().optional().describe("Whether the merge field is required"),
      default_value: z.string().optional().describe("The default value for the merge field"),
      public: z.boolean().optional().describe("Whether the merge field is displayed on the signup form"),
      display_order: z.number().optional().describe("The order that the merge field displays"),
      options: z
        .record(z.string(), z.unknown())
        .optional()
        .describe("Extra options for some merge field types"),
    }),
    handler: async (args: Record<string, unknown>) => {
      const { list_id, merge_id, ...body } = args;
      return mailchimpRequest("PATCH", `/lists/${list_id}/merge-fields/${merge_id}`, body);
    },
  },

  // ─── Segments ────────────────────────────────────────────────────────────────

  // 48. List segments
  {
    name: "mailchimp_list_segments",
    description: "Get information about all available segments for a specific list",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      fields: z.string().optional().describe("Comma-separated list of fields to include"),
      exclude_fields: z.string().optional().describe("Comma-separated list of fields to exclude"),
      count: z.number().optional().describe("The number of records to return (default 10, max 1000)"),
      offset: z.number().optional().describe("The number of records to skip (default 0)"),
      type: z.string().optional().describe("Limit results based on segment type (saved, static, fuzzy)"),
      since_created_at: z.string().optional().describe("Restrict results to segments created after this time (ISO 8601)"),
      before_created_at: z.string().optional().describe("Restrict results to segments created before this time (ISO 8601)"),
      include_cleaned: z.boolean().optional().describe("Include cleaned members in response"),
      include_transactional: z.boolean().optional().describe("Include transactional members in response"),
      include_unsubscribed: z.boolean().optional().describe("Include unsubscribed members in response"),
      since_updated_at: z.string().optional().describe("Restrict results to segments updated after this time (ISO 8601)"),
      before_updated_at: z.string().optional().describe("Restrict results to segments updated before this time (ISO 8601)"),
    }),
    handler: async (args: { list_id: string } & Record<string, unknown>) => {
      const { list_id, ...params } = args;
      return mailchimpRequest("GET", `/lists/${list_id}/segments`, undefined, params as Record<string, string | number | boolean | undefined>);
    },
  },

  // 49. Create segment
  {
    name: "mailchimp_create_segment",
    description: "Create a new segment in a specific list",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      name: z.string().describe("The name of the segment"),
      static_segment: z
        .array(z.string())
        .optional()
        .describe("An array of emails to be used for a static segment (up to 500)"),
      options: z
        .record(z.string(), z.unknown())
        .optional()
        .describe("The conditions of the segment with match (any/all) and conditions array"),
    }),
    handler: async (args: Record<string, unknown>) => {
      const { list_id, ...body } = args;
      return mailchimpRequest("POST", `/lists/${list_id}/segments`, body);
    },
  },

  // 50. Delete segment
  {
    name: "mailchimp_delete_segment",
    description: "Delete a specific segment in a list",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      segment_id: z.string().describe("The unique ID for the segment"),
    }),
    handler: async (args: { list_id: string; segment_id: string }) => {
      return mailchimpRequest("DELETE", `/lists/${args.list_id}/segments/${args.segment_id}`);
    },
  },

  // 51. Get segment
  {
    name: "mailchimp_get_segment",
    description: "Get information about a specific segment in a list",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      segment_id: z.string().describe("The unique ID for the segment"),
      fields: z.string().optional().describe("Comma-separated list of fields to include"),
      exclude_fields: z.string().optional().describe("Comma-separated list of fields to exclude"),
      include_cleaned: z.boolean().optional().describe("Include cleaned members in response"),
      include_transactional: z.boolean().optional().describe("Include transactional members in response"),
      include_unsubscribed: z.boolean().optional().describe("Include unsubscribed members in response"),
    }),
    handler: async (args: { list_id: string; segment_id: string } & Record<string, unknown>) => {
      const { list_id, segment_id, ...params } = args;
      return mailchimpRequest("GET", `/lists/${list_id}/segments/${segment_id}`, undefined, params as Record<string, string | number | boolean | undefined>);
    },
  },

  // 52. Update segment
  {
    name: "mailchimp_update_segment",
    description: "Update an existing segment in a list",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      segment_id: z.string().describe("The unique ID for the segment"),
      name: z.string().optional().describe("The name of the segment"),
      static_segment: z.array(z.string()).optional().describe("An array of emails for a static segment"),
      options: z.record(z.string(), z.unknown()).optional().describe("Segment options with match and conditions"),
    }),
    handler: async (args: Record<string, unknown>) => {
      const { list_id, segment_id, ...body } = args;
      return mailchimpRequest("PATCH", `/lists/${list_id}/segments/${segment_id}`, body);
    },
  },

  // 53. Batch segment members
  {
    name: "mailchimp_batch_segment_members",
    description: "Batch add/remove list members to a static segment",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      segment_id: z.string().describe("The unique ID for the segment"),
      members_to_add: z.array(z.string()).optional().describe("An array of email addresses to add to the segment"),
      members_to_remove: z.array(z.string()).optional().describe("An array of email addresses to remove from the segment"),
    }),
    handler: async (args: Record<string, unknown>) => {
      const { list_id, segment_id, ...body } = args;
      return mailchimpRequest("POST", `/lists/${list_id}/segments/${segment_id}`, body);
    },
  },

  // 54. List segment members
  {
    name: "mailchimp_list_segment_members",
    description: "Get information about members in a specific segment",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      segment_id: z.string().describe("The unique ID for the segment"),
      fields: z.string().optional().describe("Comma-separated list of fields to include"),
      exclude_fields: z.string().optional().describe("Comma-separated list of fields to exclude"),
      count: z.number().optional().describe("The number of records to return (default 10, max 1000)"),
      offset: z.number().optional().describe("The number of records to skip (default 0)"),
      include_cleaned: z.boolean().optional().describe("Include cleaned members in response"),
      include_transactional: z.boolean().optional().describe("Include transactional members in response"),
      include_unsubscribed: z.boolean().optional().describe("Include unsubscribed members in response"),
    }),
    handler: async (args: { list_id: string; segment_id: string } & Record<string, unknown>) => {
      const { list_id, segment_id, ...params } = args;
      return mailchimpRequest("GET", `/lists/${list_id}/segments/${segment_id}/members`, undefined, params as Record<string, string | number | boolean | undefined>);
    },
  },

  // 55. Add segment member
  {
    name: "mailchimp_add_segment_member",
    description: "Add a member to a static segment",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      segment_id: z.string().describe("The unique ID for the segment"),
      email_address: z.string().describe("The email address of the member to add"),
    }),
    handler: async (args: Record<string, unknown>) => {
      const { list_id, segment_id, ...body } = args;
      return mailchimpRequest("POST", `/lists/${list_id}/segments/${segment_id}/members`, body);
    },
  },

  // 56. Remove segment member
  {
    name: "mailchimp_remove_segment_member",
    description: "Remove a member from a static segment",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      segment_id: z.string().describe("The unique ID for the segment"),
      subscriber_hash: z.string().describe("The MD5 hash of the lowercase version of the list member's email address"),
    }),
    handler: async (args: { list_id: string; segment_id: string; subscriber_hash: string }) => {
      return mailchimpRequest("DELETE", `/lists/${args.list_id}/segments/${args.segment_id}/members/${args.subscriber_hash}`);
    },
  },

  // ─── Signup Forms ────────────────────────────────────────────────────────────

  // 57. List signup forms
  {
    name: "mailchimp_list_signup_forms",
    description: "Get signup forms for a specific list",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
    }),
    handler: async (args: { list_id: string }) => {
      return mailchimpRequest("GET", `/lists/${args.list_id}/signup-forms`);
    },
  },

  // 58. Customize signup form
  {
    name: "mailchimp_customize_signup_form",
    description: "Customize a list's default signup form",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      header: z.record(z.string(), z.unknown()).optional().describe("Options for customizing the signup form header"),
      contents: z.array(z.record(z.string(), z.unknown())).optional().describe("The content options for the signup form"),
      styles: z.array(z.record(z.string(), z.unknown())).optional().describe("An array of objects containing CSS style options for the signup form"),
    }),
    handler: async (args: Record<string, unknown>) => {
      const { list_id, ...body } = args;
      return mailchimpRequest("POST", `/lists/${list_id}/signup-forms`, body);
    },
  },

  // ─── Surveys ─────────────────────────────────────────────────────────────────

  // 59. List surveys
  {
    name: "mailchimp_list_surveys",
    description: "Get all surveys for a specific list",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
    }),
    handler: async (args: { list_id: string }) => {
      return mailchimpRequest("GET", `/lists/${args.list_id}/surveys`);
    },
  },

  // 60. Get survey
  {
    name: "mailchimp_get_survey",
    description: "Get details about a specific survey",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      survey_id: z.string().describe("The unique ID for the survey"),
    }),
    handler: async (args: { list_id: string; survey_id: string }) => {
      return mailchimpRequest("GET", `/lists/${args.list_id}/surveys/${args.survey_id}`);
    },
  },

  // 61. Create survey email
  {
    name: "mailchimp_create_survey_email",
    description: "Create an email campaign to distribute a survey",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      survey_id: z.string().describe("The unique ID for the survey"),
    }),
    handler: async (args: { list_id: string; survey_id: string }) => {
      return mailchimpRequest("POST", `/lists/${args.list_id}/surveys/${args.survey_id}/actions/create-email`);
    },
  },

  // 62. Publish survey
  {
    name: "mailchimp_publish_survey",
    description: "Publish a survey that is in draft status",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      survey_id: z.string().describe("The unique ID for the survey"),
    }),
    handler: async (args: { list_id: string; survey_id: string }) => {
      return mailchimpRequest("POST", `/lists/${args.list_id}/surveys/${args.survey_id}/actions/publish`);
    },
  },

  // 63. Unpublish survey
  {
    name: "mailchimp_unpublish_survey",
    description: "Unpublish a survey that is currently published",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      survey_id: z.string().describe("The unique ID for the survey"),
    }),
    handler: async (args: { list_id: string; survey_id: string }) => {
      return mailchimpRequest("POST", `/lists/${args.list_id}/surveys/${args.survey_id}/actions/unpublish`);
    },
  },

  // ─── Tag Search ──────────────────────────────────────────────────────────────

  // 64. Search tags
  {
    name: "mailchimp_search_tags",
    description: "Search for tags on a list by name",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      name: z.string().optional().describe("The search query used to filter tags by name"),
    }),
    handler: async (args: { list_id: string; name?: string }) => {
      const { list_id, ...params } = args;
      return mailchimpRequest("GET", `/lists/${list_id}/tag-search`, undefined, params as Record<string, string | number | boolean | undefined>);
    },
  },

  // ─── Webhooks ────────────────────────────────────────────────────────────────

  // 65. List webhooks
  {
    name: "mailchimp_list_webhooks",
    description: "Get all webhooks for a specific list",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
    }),
    handler: async (args: { list_id: string }) => {
      return mailchimpRequest("GET", `/lists/${args.list_id}/webhooks`);
    },
  },

  // 66. Create webhook
  {
    name: "mailchimp_create_webhook",
    description: "Create a new webhook for a specific list",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      url: z.string().describe("A valid URL for the Webhook"),
      events: z
        .object({
          subscribe: z.boolean().optional().describe("Whether the webhook is triggered when a list subscriber is added"),
          unsubscribe: z.boolean().optional().describe("Whether the webhook is triggered when a list member unsubscribes"),
          profile: z.boolean().optional().describe("Whether the webhook is triggered when a subscriber's profile is updated"),
          cleaned: z.boolean().optional().describe("Whether the webhook is triggered when a subscriber's email address is cleaned"),
          upemail: z.boolean().optional().describe("Whether the webhook is triggered when a subscriber's email address is changed"),
          campaign: z.boolean().optional().describe("Whether the webhook is triggered when a campaign is sent or cancelled"),
        })
        .optional()
        .describe("The events that can trigger the webhook"),
      sources: z
        .object({
          user: z.boolean().optional().describe("Whether the webhook is triggered by subscriber-initiated actions"),
          admin: z.boolean().optional().describe("Whether the webhook is triggered by admin-initiated actions"),
          api: z.boolean().optional().describe("Whether the webhook is triggered by actions initiated via the API"),
        })
        .optional()
        .describe("The possible sources of any events that can trigger the webhook"),
    }),
    handler: async (args: Record<string, unknown>) => {
      const { list_id, ...body } = args;
      return mailchimpRequest("POST", `/lists/${list_id}/webhooks`, body);
    },
  },

  // 67. Delete webhook
  {
    name: "mailchimp_delete_webhook",
    description: "Delete a specific webhook for a list",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      webhook_id: z.string().describe("The unique ID for the webhook"),
    }),
    handler: async (args: { list_id: string; webhook_id: string }) => {
      return mailchimpRequest("DELETE", `/lists/${args.list_id}/webhooks/${args.webhook_id}`);
    },
  },

  // 68. Get webhook
  {
    name: "mailchimp_get_webhook",
    description: "Get information about a specific webhook for a list",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      webhook_id: z.string().describe("The unique ID for the webhook"),
    }),
    handler: async (args: { list_id: string; webhook_id: string }) => {
      return mailchimpRequest("GET", `/lists/${args.list_id}/webhooks/${args.webhook_id}`);
    },
  },

  // 69. Update webhook
  {
    name: "mailchimp_update_webhook",
    description: "Update an existing webhook for a specific list",
    inputSchema: z.object({
      list_id: z.string().describe("The unique ID for the list"),
      webhook_id: z.string().describe("The unique ID for the webhook"),
      url: z.string().optional().describe("A valid URL for the Webhook"),
      events: z
        .object({
          subscribe: z.boolean().optional().describe("Whether the webhook is triggered when a list subscriber is added"),
          unsubscribe: z.boolean().optional().describe("Whether the webhook is triggered when a list member unsubscribes"),
          profile: z.boolean().optional().describe("Whether the webhook is triggered when a subscriber's profile is updated"),
          cleaned: z.boolean().optional().describe("Whether the webhook is triggered when a subscriber's email address is cleaned"),
          upemail: z.boolean().optional().describe("Whether the webhook is triggered when a subscriber's email address is changed"),
          campaign: z.boolean().optional().describe("Whether the webhook is triggered when a campaign is sent or cancelled"),
        })
        .optional()
        .describe("The events that can trigger the webhook"),
      sources: z
        .object({
          user: z.boolean().optional().describe("Whether the webhook is triggered by subscriber-initiated actions"),
          admin: z.boolean().optional().describe("Whether the webhook is triggered by admin-initiated actions"),
          api: z.boolean().optional().describe("Whether the webhook is triggered by actions initiated via the API"),
        })
        .optional()
        .describe("The possible sources of any events that can trigger the webhook"),
    }),
    handler: async (args: Record<string, unknown>) => {
      const { list_id, webhook_id, ...body } = args;
      return mailchimpRequest("PATCH", `/lists/${list_id}/webhooks/${webhook_id}`, body);
    },
  },
];
