import { z } from "zod";
import { mailchimpRequest } from "../client.js";

export const campaignTools = [
  // 1. List campaigns
  {
    name: "mailchimp_list_campaigns",
    description: "Get all campaigns in an account",
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
      status: z
        .enum(["save", "paused", "schedule", "sending", "sent"])
        .optional()
        .describe("The campaign status to filter by"),
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
      before_create_time: z
        .string()
        .optional()
        .describe(
          "Restrict results to campaigns created before this time (ISO 8601)"
        ),
      since_create_time: z
        .string()
        .optional()
        .describe(
          "Restrict results to campaigns created after this time (ISO 8601)"
        ),
      list_id: z
        .string()
        .optional()
        .describe("The unique ID of the list/audience to filter by"),
      folder_id: z
        .string()
        .optional()
        .describe("The unique folder ID to filter by"),
      member_id: z
        .string()
        .optional()
        .describe(
          "Retrieve campaigns sent to a particular list member (MD5 hash of lowercase email)"
        ),
      sort_field: z
        .enum(["create_time", "send_time"])
        .optional()
        .describe("The field to sort results by"),
      sort_dir: z
        .enum(["ASC", "DESC"])
        .optional()
        .describe("The sort direction"),
    }),
    handler: async (args: {
      fields?: string;
      exclude_fields?: string;
      count?: number;
      offset?: number;
      type?: string;
      status?: string;
      before_send_time?: string;
      since_send_time?: string;
      before_create_time?: string;
      since_create_time?: string;
      list_id?: string;
      folder_id?: string;
      member_id?: string;
      sort_field?: string;
      sort_dir?: string;
    }) => {
      return mailchimpRequest("GET", "/campaigns", undefined, {
        fields: args.fields,
        exclude_fields: args.exclude_fields,
        count: args.count,
        offset: args.offset,
        type: args.type,
        status: args.status,
        before_send_time: args.before_send_time,
        since_send_time: args.since_send_time,
        before_create_time: args.before_create_time,
        since_create_time: args.since_create_time,
        list_id: args.list_id,
        folder_id: args.folder_id,
        member_id: args.member_id,
        sort_field: args.sort_field,
        sort_dir: args.sort_dir,
      });
    },
  },

  // 2. Create campaign
  {
    name: "mailchimp_create_campaign",
    description: "Create a new Mailchimp campaign",
    inputSchema: z.object({
      type: z
        .enum(["regular", "plaintext", "absplit", "rss", "variate"])
        .describe("The type of campaign to create"),
      recipients: z
        .object({
          list_id: z.string().describe("The unique list/audience ID"),
          segment_opts: z
            .object({
              saved_segment_id: z
                .number()
                .optional()
                .describe("The ID of an existing saved segment"),
              match: z
                .enum(["any", "all"])
                .optional()
                .describe("Segment match type"),
              conditions: z
                .array(z.record(z.string(), z.unknown()))
                .optional()
                .describe("Array of segment conditions"),
            })
            .optional()
            .describe("Segment options for the campaign recipients"),
        })
        .optional()
        .describe("List settings for the campaign"),
      settings: z
        .object({
          subject_line: z
            .string()
            .optional()
            .describe("The subject line for the campaign"),
          preview_text: z
            .string()
            .optional()
            .describe("The preview text for the campaign"),
          title: z
            .string()
            .optional()
            .describe("The title of the campaign"),
          from_name: z
            .string()
            .optional()
            .describe("The from name on the campaign"),
          reply_to: z
            .string()
            .optional()
            .describe("The reply-to email address for the campaign"),
        })
        .optional()
        .describe("The settings for the campaign"),
      tracking: z
        .object({
          opens: z
            .boolean()
            .optional()
            .describe("Whether to track opens"),
          html_clicks: z
            .boolean()
            .optional()
            .describe("Whether to track clicks in the HTML content"),
          text_clicks: z
            .boolean()
            .optional()
            .describe("Whether to track clicks in the plain-text content"),
          goal_tracking: z
            .boolean()
            .optional()
            .describe("Whether to enable Goal tracking"),
          ecomm360: z
            .boolean()
            .optional()
            .describe("Whether to enable eCommerce360 tracking"),
          google_analytics: z
            .string()
            .optional()
            .describe("The custom slug for Google Analytics tracking"),
        })
        .optional()
        .describe("Tracking options for the campaign"),
      content_type: z
        .enum(["template", "html", "url", "multichannel"])
        .optional()
        .describe("How the campaign's content is put together"),
    }),
    handler: async (args: {
      type: string;
      recipients?: {
        list_id: string;
        segment_opts?: {
          saved_segment_id?: number;
          match?: string;
          conditions?: Record<string, unknown>[];
        };
      };
      settings?: {
        subject_line?: string;
        preview_text?: string;
        title?: string;
        from_name?: string;
        reply_to?: string;
      };
      tracking?: {
        opens?: boolean;
        html_clicks?: boolean;
        text_clicks?: boolean;
        goal_tracking?: boolean;
        ecomm360?: boolean;
        google_analytics?: string;
      };
      content_type?: string;
    }) => {
      const body: Record<string, unknown> = { type: args.type };
      if (args.recipients !== undefined) body.recipients = args.recipients;
      if (args.settings !== undefined) body.settings = args.settings;
      if (args.tracking !== undefined) body.tracking = args.tracking;
      if (args.content_type !== undefined)
        body.content_type = args.content_type;
      return mailchimpRequest("POST", "/campaigns", body);
    },
  },

  // 3. Delete campaign
  {
    name: "mailchimp_delete_campaign",
    description: "Remove a campaign from your Mailchimp account",
    inputSchema: z.object({
      campaign_id: z
        .string()
        .describe("The unique ID for the campaign"),
    }),
    handler: async (args: { campaign_id: string }) => {
      return mailchimpRequest(
        "DELETE",
        `/campaigns/${args.campaign_id}`
      );
    },
  },

  // 4. Get campaign
  {
    name: "mailchimp_get_campaign",
    description: "Get information about a specific campaign",
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
        `/campaigns/${args.campaign_id}`,
        undefined,
        {
          fields: args.fields,
          exclude_fields: args.exclude_fields,
        }
      );
    },
  },

  // 5. Update campaign
  {
    name: "mailchimp_update_campaign",
    description: "Update some or all of the settings for a specific campaign",
    inputSchema: z.object({
      campaign_id: z
        .string()
        .describe("The unique ID for the campaign"),
      settings: z
        .object({
          subject_line: z
            .string()
            .optional()
            .describe("The subject line for the campaign"),
          preview_text: z
            .string()
            .optional()
            .describe("The preview text for the campaign"),
          title: z
            .string()
            .optional()
            .describe("The title of the campaign"),
          from_name: z
            .string()
            .optional()
            .describe("The from name on the campaign"),
          reply_to: z
            .string()
            .optional()
            .describe("The reply-to email address for the campaign"),
        })
        .optional()
        .describe("The settings for the campaign"),
      recipients: z
        .object({
          list_id: z.string().describe("The unique list/audience ID"),
        })
        .optional()
        .describe("List settings for the campaign"),
      tracking: z
        .object({
          opens: z
            .boolean()
            .optional()
            .describe("Whether to track opens"),
          html_clicks: z
            .boolean()
            .optional()
            .describe("Whether to track clicks in the HTML content"),
          text_clicks: z
            .boolean()
            .optional()
            .describe("Whether to track clicks in the plain-text content"),
          goal_tracking: z
            .boolean()
            .optional()
            .describe("Whether to enable Goal tracking"),
          ecomm360: z
            .boolean()
            .optional()
            .describe("Whether to enable eCommerce360 tracking"),
          google_analytics: z
            .string()
            .optional()
            .describe("The custom slug for Google Analytics tracking"),
        })
        .optional()
        .describe("Tracking options for the campaign"),
    }),
    handler: async (args: {
      campaign_id: string;
      settings?: {
        subject_line?: string;
        preview_text?: string;
        title?: string;
        from_name?: string;
        reply_to?: string;
      };
      recipients?: { list_id: string };
      tracking?: {
        opens?: boolean;
        html_clicks?: boolean;
        text_clicks?: boolean;
        goal_tracking?: boolean;
        ecomm360?: boolean;
        google_analytics?: string;
      };
    }) => {
      const body: Record<string, unknown> = {};
      if (args.settings !== undefined) body.settings = args.settings;
      if (args.recipients !== undefined) body.recipients = args.recipients;
      if (args.tracking !== undefined) body.tracking = args.tracking;
      return mailchimpRequest(
        "PATCH",
        `/campaigns/${args.campaign_id}`,
        body
      );
    },
  },

  // 6. Cancel campaign
  {
    name: "mailchimp_cancel_campaign",
    description:
      "Cancel a Regular or Plain-Text campaign after you send, before all of your recipients receive it",
    inputSchema: z.object({
      campaign_id: z
        .string()
        .describe("The unique ID for the campaign"),
    }),
    handler: async (args: { campaign_id: string }) => {
      return mailchimpRequest(
        "POST",
        `/campaigns/${args.campaign_id}/actions/cancel-send`
      );
    },
  },

  // 7. Create campaign resend
  {
    name: "mailchimp_create_campaign_resend",
    description:
      "Creates a resend to non-openers of the specified campaign",
    inputSchema: z.object({
      campaign_id: z
        .string()
        .describe("The unique ID for the campaign"),
    }),
    handler: async (args: { campaign_id: string }) => {
      return mailchimpRequest(
        "POST",
        `/campaigns/${args.campaign_id}/actions/create-resend`
      );
    },
  },

  // 8. Pause RSS campaign
  {
    name: "mailchimp_pause_rss_campaign",
    description: "Pause an RSS-Driven campaign",
    inputSchema: z.object({
      campaign_id: z
        .string()
        .describe("The unique ID for the campaign"),
    }),
    handler: async (args: { campaign_id: string }) => {
      return mailchimpRequest(
        "POST",
        `/campaigns/${args.campaign_id}/actions/pause`
      );
    },
  },

  // 9. Replicate campaign
  {
    name: "mailchimp_replicate_campaign",
    description: "Replicate a campaign in saved or send status",
    inputSchema: z.object({
      campaign_id: z
        .string()
        .describe("The unique ID for the campaign"),
    }),
    handler: async (args: { campaign_id: string }) => {
      return mailchimpRequest(
        "POST",
        `/campaigns/${args.campaign_id}/actions/replicate`
      );
    },
  },

  // 10. Resume RSS campaign
  {
    name: "mailchimp_resume_rss_campaign",
    description: "Resume an RSS-Driven campaign",
    inputSchema: z.object({
      campaign_id: z
        .string()
        .describe("The unique ID for the campaign"),
    }),
    handler: async (args: { campaign_id: string }) => {
      return mailchimpRequest(
        "POST",
        `/campaigns/${args.campaign_id}/actions/resume`
      );
    },
  },

  // 11. Schedule campaign
  {
    name: "mailchimp_schedule_campaign",
    description: "Schedule a campaign for delivery at a specific time",
    inputSchema: z.object({
      campaign_id: z
        .string()
        .describe("The unique ID for the campaign"),
      schedule_time: z
        .string()
        .describe(
          "The UTC date and time to schedule the campaign (ISO 8601 format)"
        ),
      timewarp: z
        .boolean()
        .optional()
        .describe(
          "Whether Mailchimp should deliver the campaign at the recipient's local time"
        ),
      batch_delivery: z
        .object({
          batch_delay: z
            .number()
            .describe("The delay in minutes between batches"),
          batch_count: z
            .number()
            .describe("The number of batches for the campaign send"),
        })
        .optional()
        .describe("Choose whether the campaign should use Batch Delivery"),
    }),
    handler: async (args: {
      campaign_id: string;
      schedule_time: string;
      timewarp?: boolean;
      batch_delivery?: { batch_delay: number; batch_count: number };
    }) => {
      const body: Record<string, unknown> = {
        schedule_time: args.schedule_time,
      };
      if (args.timewarp !== undefined) body.timewarp = args.timewarp;
      if (args.batch_delivery !== undefined)
        body.batch_delivery = args.batch_delivery;
      return mailchimpRequest(
        "POST",
        `/campaigns/${args.campaign_id}/actions/schedule`,
        body
      );
    },
  },

  // 12. Send campaign
  {
    name: "mailchimp_send_campaign",
    description: "Send a Mailchimp campaign",
    inputSchema: z.object({
      campaign_id: z
        .string()
        .describe("The unique ID for the campaign"),
    }),
    handler: async (args: { campaign_id: string }) => {
      return mailchimpRequest(
        "POST",
        `/campaigns/${args.campaign_id}/actions/send`
      );
    },
  },

  // 13. Send test email
  {
    name: "mailchimp_send_test_email",
    description:
      "Send a test email for a campaign to the specified email addresses",
    inputSchema: z.object({
      campaign_id: z
        .string()
        .describe("The unique ID for the campaign"),
      test_emails: z
        .array(z.string())
        .describe("An array of email addresses to send the test email to"),
      send_type: z
        .enum(["html", "plaintext"])
        .describe("The type of test email to send"),
    }),
    handler: async (args: {
      campaign_id: string;
      test_emails: string[];
      send_type: string;
    }) => {
      return mailchimpRequest(
        "POST",
        `/campaigns/${args.campaign_id}/actions/test`,
        {
          test_emails: args.test_emails,
          send_type: args.send_type,
        }
      );
    },
  },

  // 14. Unschedule campaign
  {
    name: "mailchimp_unschedule_campaign",
    description:
      "Unschedule a scheduled campaign that hasn't started sending",
    inputSchema: z.object({
      campaign_id: z
        .string()
        .describe("The unique ID for the campaign"),
    }),
    handler: async (args: { campaign_id: string }) => {
      return mailchimpRequest(
        "POST",
        `/campaigns/${args.campaign_id}/actions/unschedule`
      );
    },
  },

  // 15. Get campaign content
  {
    name: "mailchimp_get_campaign_content",
    description:
      "Get the the HTML and plain-text content for a campaign",
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
        `/campaigns/${args.campaign_id}/content`,
        undefined,
        {
          fields: args.fields,
          exclude_fields: args.exclude_fields,
        }
      );
    },
  },

  // 16. Set campaign content
  {
    name: "mailchimp_set_campaign_content",
    description:
      "Set the content for a campaign using HTML, a URL, a template, or an archive",
    inputSchema: z.object({
      campaign_id: z
        .string()
        .describe("The unique ID for the campaign"),
      plain_text: z
        .string()
        .optional()
        .describe(
          "The plain-text portion of the campaign. If left unspecified, Mailchimp will generate from the html"
        ),
      html: z
        .string()
        .optional()
        .describe("The raw HTML for the campaign"),
      url: z
        .string()
        .optional()
        .describe(
          "When specified, the content for the campaign will be imported from the given URL"
        ),
      template: z
        .object({
          id: z.number().describe("The ID of the template to use"),
          sections: z
            .record(z.string(), z.string())
            .optional()
            .describe(
              "Content for the sections of the template. Keys are the section name, values are the content"
            ),
        })
        .optional()
        .describe("Use a template to generate the content for the campaign"),
      archive: z
        .object({
          archive_content: z
            .string()
            .describe(
              "The base64-encoded representation of the archive file"
            ),
          archive_type: z
            .enum(["zip", "tar.gz", "tar.bz2", "tar", "tgz", "tbz"])
            .optional()
            .describe("The type of encoded file (defaults to zip)"),
        })
        .optional()
        .describe("Upload an archive to generate the content for the campaign"),
    }),
    handler: async (args: {
      campaign_id: string;
      plain_text?: string;
      html?: string;
      url?: string;
      template?: { id: number; sections?: Record<string, string> };
      archive?: { archive_content: string; archive_type?: string };
    }) => {
      const body: Record<string, unknown> = {};
      if (args.plain_text !== undefined) body.plain_text = args.plain_text;
      if (args.html !== undefined) body.html = args.html;
      if (args.url !== undefined) body.url = args.url;
      if (args.template !== undefined) body.template = args.template;
      if (args.archive !== undefined) body.archive = args.archive;
      return mailchimpRequest(
        "PUT",
        `/campaigns/${args.campaign_id}/content`,
        body
      );
    },
  },

  // 17. List campaign feedback
  {
    name: "mailchimp_list_campaign_feedback",
    description:
      "Get team feedback while you're working together on a Mailchimp campaign",
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
        `/campaigns/${args.campaign_id}/feedback`,
        undefined,
        {
          fields: args.fields,
          exclude_fields: args.exclude_fields,
        }
      );
    },
  },

  // 18. Add campaign feedback
  {
    name: "mailchimp_add_campaign_feedback",
    description: "Add feedback on a specific campaign",
    inputSchema: z.object({
      campaign_id: z
        .string()
        .describe("The unique ID for the campaign"),
      block_id: z
        .number()
        .optional()
        .describe("The block ID for the editable block that the feedback addresses"),
      message: z
        .string()
        .describe("The content of the feedback"),
      is_complete: z
        .boolean()
        .optional()
        .describe("The status of feedback (true for complete, false for incomplete)"),
    }),
    handler: async (args: {
      campaign_id: string;
      block_id?: number;
      message: string;
      is_complete?: boolean;
    }) => {
      const body: Record<string, unknown> = { message: args.message };
      if (args.block_id !== undefined) body.block_id = args.block_id;
      if (args.is_complete !== undefined) body.is_complete = args.is_complete;
      return mailchimpRequest(
        "POST",
        `/campaigns/${args.campaign_id}/feedback`,
        body
      );
    },
  },

  // 19. Delete campaign feedback
  {
    name: "mailchimp_delete_campaign_feedback",
    description: "Remove a specific feedback message for a campaign",
    inputSchema: z.object({
      campaign_id: z
        .string()
        .describe("The unique ID for the campaign"),
      feedback_id: z
        .string()
        .describe("The unique ID for the feedback message"),
    }),
    handler: async (args: { campaign_id: string; feedback_id: string }) => {
      return mailchimpRequest(
        "DELETE",
        `/campaigns/${args.campaign_id}/feedback/${args.feedback_id}`
      );
    },
  },

  // 20. Get campaign feedback
  {
    name: "mailchimp_get_campaign_feedback",
    description: "Get a specific feedback message from a campaign",
    inputSchema: z.object({
      campaign_id: z
        .string()
        .describe("The unique ID for the campaign"),
      feedback_id: z
        .string()
        .describe("The unique ID for the feedback message"),
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
      feedback_id: string;
      fields?: string;
      exclude_fields?: string;
    }) => {
      return mailchimpRequest(
        "GET",
        `/campaigns/${args.campaign_id}/feedback/${args.feedback_id}`,
        undefined,
        {
          fields: args.fields,
          exclude_fields: args.exclude_fields,
        }
      );
    },
  },

  // 21. Update campaign feedback
  {
    name: "mailchimp_update_campaign_feedback",
    description: "Update a specific feedback message for a campaign",
    inputSchema: z.object({
      campaign_id: z
        .string()
        .describe("The unique ID for the campaign"),
      feedback_id: z
        .string()
        .describe("The unique ID for the feedback message"),
      block_id: z
        .number()
        .optional()
        .describe("The block ID for the editable block that the feedback addresses"),
      message: z
        .string()
        .optional()
        .describe("The content of the feedback"),
      is_complete: z
        .boolean()
        .optional()
        .describe("The status of feedback (true for complete, false for incomplete)"),
    }),
    handler: async (args: {
      campaign_id: string;
      feedback_id: string;
      block_id?: number;
      message?: string;
      is_complete?: boolean;
    }) => {
      const body: Record<string, unknown> = {};
      if (args.block_id !== undefined) body.block_id = args.block_id;
      if (args.message !== undefined) body.message = args.message;
      if (args.is_complete !== undefined) body.is_complete = args.is_complete;
      return mailchimpRequest(
        "PATCH",
        `/campaigns/${args.campaign_id}/feedback/${args.feedback_id}`,
        body
      );
    },
  },

  // 22. Get campaign send checklist
  {
    name: "mailchimp_get_campaign_send_checklist",
    description:
      "Review the send checklist for a campaign, and resolve any issues before sending",
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
        `/campaigns/${args.campaign_id}/send-checklist`,
        undefined,
        {
          fields: args.fields,
          exclude_fields: args.exclude_fields,
        }
      );
    },
  },
];
