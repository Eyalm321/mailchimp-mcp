import { z } from "zod";
import { mailchimpRequest } from "../client.js";

export const automationTools = [
  {
    name: "mailchimp_list_automations",
    description: "List all automations in the account",
    inputSchema: z.object({
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
      before_create_time: z
        .string()
        .optional()
        .describe(
          "Restrict results to automations created before this time (ISO 8601 format)"
        ),
      since_create_time: z
        .string()
        .optional()
        .describe(
          "Restrict results to automations created after this time (ISO 8601 format)"
        ),
      before_start_time: z
        .string()
        .optional()
        .describe(
          "Restrict results to automations started before this time (ISO 8601 format)"
        ),
      since_start_time: z
        .string()
        .optional()
        .describe(
          "Restrict results to automations started after this time (ISO 8601 format)"
        ),
      status: z
        .string()
        .optional()
        .describe(
          "Restrict results to automations with the specified status (e.g. sending, paused, save)"
        ),
    }),
    handler: async (args: {
      count?: number;
      offset?: number;
      fields?: string;
      exclude_fields?: string;
      before_create_time?: string;
      since_create_time?: string;
      before_start_time?: string;
      since_start_time?: string;
      status?: string;
    }) => {
      return mailchimpRequest("GET", "/automations", undefined, {
        count: args.count,
        offset: args.offset,
        fields: args.fields,
        exclude_fields: args.exclude_fields,
        before_create_time: args.before_create_time,
        since_create_time: args.since_create_time,
        before_start_time: args.before_start_time,
        since_start_time: args.since_start_time,
        status: args.status,
      });
    },
  },
  {
    name: "mailchimp_create_automation",
    description: "Create a new automation workflow",
    inputSchema: z.object({
      list_id: z
        .string()
        .describe("The unique list ID for the audience to send to"),
      segment_opts: z
        .object({
          saved_segment_id: z
            .number()
            .optional()
            .describe("The ID of the saved segment to target"),
          match: z
            .string()
            .optional()
            .describe("Segment match type: any or all"),
          conditions: z
            .array(z.record(z.string(), z.unknown()))
            .optional()
            .describe("Array of segment conditions"),
        })
        .optional()
        .describe("Segment options for the automation recipients"),
      workflow_type: z
        .string()
        .describe(
          "The type of automation workflow (e.g. abandonedBrowse, abandonedCart, emailFollowup, welcomeSeries)"
        ),
      from_name: z
        .string()
        .optional()
        .describe("The from name for the automation emails"),
      reply_to: z
        .string()
        .optional()
        .describe("The reply-to email address for the automation emails"),
      title: z
        .string()
        .optional()
        .describe("The title of the automation"),
    }),
    handler: async (args: {
      list_id: string;
      segment_opts?: {
        saved_segment_id?: number;
        match?: string;
        conditions?: Record<string, unknown>[];
      };
      workflow_type: string;
      from_name?: string;
      reply_to?: string;
      title?: string;
    }) => {
      const body: Record<string, unknown> = {
        recipients: {
          list_id: args.list_id,
          ...(args.segment_opts && { segment_opts: args.segment_opts }),
        },
        trigger_settings: {
          workflow_type: args.workflow_type,
        },
        settings: {
          ...(args.from_name && { from_name: args.from_name }),
          ...(args.reply_to && { reply_to: args.reply_to }),
          ...(args.title && { title: args.title }),
        },
      };
      return mailchimpRequest("POST", "/automations", body);
    },
  },
  {
    name: "mailchimp_get_automation",
    description: "Get information about a specific automation workflow",
    inputSchema: z.object({
      workflow_id: z
        .string()
        .describe("The unique ID for the automation workflow"),
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
      workflow_id: string;
      fields?: string;
      exclude_fields?: string;
    }) => {
      return mailchimpRequest(
        "GET",
        `/automations/${args.workflow_id}`,
        undefined,
        {
          fields: args.fields,
          exclude_fields: args.exclude_fields,
        }
      );
    },
  },
  {
    name: "mailchimp_archive_automation",
    description: "Archive an automation workflow",
    inputSchema: z.object({
      workflow_id: z
        .string()
        .describe("The unique ID for the automation workflow"),
    }),
    handler: async (args: { workflow_id: string }) => {
      return mailchimpRequest(
        "POST",
        `/automations/${args.workflow_id}/actions/archive`
      );
    },
  },
  {
    name: "mailchimp_pause_all_automation_emails",
    description: "Pause all emails in an automation workflow",
    inputSchema: z.object({
      workflow_id: z
        .string()
        .describe("The unique ID for the automation workflow"),
    }),
    handler: async (args: { workflow_id: string }) => {
      return mailchimpRequest(
        "POST",
        `/automations/${args.workflow_id}/actions/pause-all-emails`
      );
    },
  },
  {
    name: "mailchimp_start_all_automation_emails",
    description: "Start all emails in an automation workflow",
    inputSchema: z.object({
      workflow_id: z
        .string()
        .describe("The unique ID for the automation workflow"),
    }),
    handler: async (args: { workflow_id: string }) => {
      return mailchimpRequest(
        "POST",
        `/automations/${args.workflow_id}/actions/start-all-emails`
      );
    },
  },
  {
    name: "mailchimp_list_automation_emails",
    description: "List the emails in an automation workflow",
    inputSchema: z.object({
      workflow_id: z
        .string()
        .describe("The unique ID for the automation workflow"),
    }),
    handler: async (args: { workflow_id: string }) => {
      return mailchimpRequest(
        "GET",
        `/automations/${args.workflow_id}/emails`
      );
    },
  },
  {
    name: "mailchimp_delete_automation_email",
    description: "Delete a specific workflow email",
    inputSchema: z.object({
      workflow_id: z
        .string()
        .describe("The unique ID for the automation workflow"),
      workflow_email_id: z
        .string()
        .describe("The unique ID for the automation workflow email"),
    }),
    handler: async (args: {
      workflow_id: string;
      workflow_email_id: string;
    }) => {
      return mailchimpRequest(
        "DELETE",
        `/automations/${args.workflow_id}/emails/${args.workflow_email_id}`
      );
    },
  },
  {
    name: "mailchimp_get_automation_email",
    description: "Get information about a specific workflow email",
    inputSchema: z.object({
      workflow_id: z
        .string()
        .describe("The unique ID for the automation workflow"),
      workflow_email_id: z
        .string()
        .describe("The unique ID for the automation workflow email"),
    }),
    handler: async (args: {
      workflow_id: string;
      workflow_email_id: string;
    }) => {
      return mailchimpRequest(
        "GET",
        `/automations/${args.workflow_id}/emails/${args.workflow_email_id}`
      );
    },
  },
  {
    name: "mailchimp_update_automation_email",
    description: "Update settings for a specific workflow email",
    inputSchema: z.object({
      workflow_id: z
        .string()
        .describe("The unique ID for the automation workflow"),
      workflow_email_id: z
        .string()
        .describe("The unique ID for the automation workflow email"),
      subject_line: z
        .string()
        .optional()
        .describe("The subject line for the automation email"),
      preview_text: z
        .string()
        .optional()
        .describe("The preview text for the automation email"),
      title: z
        .string()
        .optional()
        .describe("The title for the automation email"),
      from_name: z
        .string()
        .optional()
        .describe("The from name for the automation email"),
      reply_to: z
        .string()
        .optional()
        .describe("The reply-to email address for the automation email"),
      delay_amount: z
        .number()
        .optional()
        .describe("The delay amount for the automation email"),
      delay_type: z
        .string()
        .optional()
        .describe("The delay type (e.g. day, hour, week)"),
      delay_direction: z
        .string()
        .optional()
        .describe("The delay direction (e.g. before, after)"),
      delay_action: z
        .string()
        .optional()
        .describe("The delay action (e.g. signup, ecomm_abandoned_browse)"),
    }),
    handler: async (args: {
      workflow_id: string;
      workflow_email_id: string;
      subject_line?: string;
      preview_text?: string;
      title?: string;
      from_name?: string;
      reply_to?: string;
      delay_amount?: number;
      delay_type?: string;
      delay_direction?: string;
      delay_action?: string;
    }) => {
      const body: Record<string, unknown> = {};
      const settings: Record<string, unknown> = {};
      if (args.subject_line !== undefined)
        settings.subject_line = args.subject_line;
      if (args.preview_text !== undefined)
        settings.preview_text = args.preview_text;
      if (args.title !== undefined) settings.title = args.title;
      if (args.from_name !== undefined) settings.from_name = args.from_name;
      if (args.reply_to !== undefined) settings.reply_to = args.reply_to;
      if (Object.keys(settings).length > 0) body.settings = settings;

      const delay: Record<string, unknown> = {};
      if (args.delay_amount !== undefined) delay.amount = args.delay_amount;
      if (args.delay_type !== undefined) delay.type = args.delay_type;
      if (args.delay_direction !== undefined)
        delay.direction = args.delay_direction;
      if (args.delay_action !== undefined) delay.action = args.delay_action;
      if (Object.keys(delay).length > 0) body.delay = delay;

      return mailchimpRequest(
        "PATCH",
        `/automations/${args.workflow_id}/emails/${args.workflow_email_id}`,
        body
      );
    },
  },
  {
    name: "mailchimp_pause_automation_email",
    description: "Pause a specific automated email",
    inputSchema: z.object({
      workflow_id: z
        .string()
        .describe("The unique ID for the automation workflow"),
      workflow_email_id: z
        .string()
        .describe("The unique ID for the automation workflow email"),
    }),
    handler: async (args: {
      workflow_id: string;
      workflow_email_id: string;
    }) => {
      return mailchimpRequest(
        "POST",
        `/automations/${args.workflow_id}/emails/${args.workflow_email_id}/actions/pause`
      );
    },
  },
  {
    name: "mailchimp_start_automation_email",
    description: "Start a specific automated email",
    inputSchema: z.object({
      workflow_id: z
        .string()
        .describe("The unique ID for the automation workflow"),
      workflow_email_id: z
        .string()
        .describe("The unique ID for the automation workflow email"),
    }),
    handler: async (args: {
      workflow_id: string;
      workflow_email_id: string;
    }) => {
      return mailchimpRequest(
        "POST",
        `/automations/${args.workflow_id}/emails/${args.workflow_email_id}/actions/start`
      );
    },
  },
  {
    name: "mailchimp_list_automation_email_queue",
    description:
      "List subscribers who are in the queue for an automation email",
    inputSchema: z.object({
      workflow_id: z
        .string()
        .describe("The unique ID for the automation workflow"),
      workflow_email_id: z
        .string()
        .describe("The unique ID for the automation workflow email"),
    }),
    handler: async (args: {
      workflow_id: string;
      workflow_email_id: string;
    }) => {
      return mailchimpRequest(
        "GET",
        `/automations/${args.workflow_id}/emails/${args.workflow_email_id}/queue`
      );
    },
  },
  {
    name: "mailchimp_add_automation_email_queue_subscriber",
    description: "Add a subscriber to the queue for an automation email",
    inputSchema: z.object({
      workflow_id: z
        .string()
        .describe("The unique ID for the automation workflow"),
      workflow_email_id: z
        .string()
        .describe("The unique ID for the automation workflow email"),
      email_address: z
        .string()
        .describe("The email address of the subscriber to add to the queue"),
    }),
    handler: async (args: {
      workflow_id: string;
      workflow_email_id: string;
      email_address: string;
    }) => {
      return mailchimpRequest(
        "POST",
        `/automations/${args.workflow_id}/emails/${args.workflow_email_id}/queue`,
        { email_address: args.email_address }
      );
    },
  },
  {
    name: "mailchimp_get_automation_email_queue_subscriber",
    description:
      "Get information about a specific subscriber in the automation email queue",
    inputSchema: z.object({
      workflow_id: z
        .string()
        .describe("The unique ID for the automation workflow"),
      workflow_email_id: z
        .string()
        .describe("The unique ID for the automation workflow email"),
      subscriber_hash: z
        .string()
        .describe(
          "The MD5 hash of the lowercase version of the subscriber's email address"
        ),
    }),
    handler: async (args: {
      workflow_id: string;
      workflow_email_id: string;
      subscriber_hash: string;
    }) => {
      return mailchimpRequest(
        "GET",
        `/automations/${args.workflow_id}/emails/${args.workflow_email_id}/queue/${args.subscriber_hash}`
      );
    },
  },
  {
    name: "mailchimp_list_automation_removed_subscribers",
    description: "List subscribers who have been removed from an automation",
    inputSchema: z.object({
      workflow_id: z
        .string()
        .describe("The unique ID for the automation workflow"),
    }),
    handler: async (args: { workflow_id: string }) => {
      return mailchimpRequest(
        "GET",
        `/automations/${args.workflow_id}/removed-subscribers`
      );
    },
  },
  {
    name: "mailchimp_remove_automation_subscriber",
    description: "Remove a subscriber from an automation workflow",
    inputSchema: z.object({
      workflow_id: z
        .string()
        .describe("The unique ID for the automation workflow"),
      email_address: z
        .string()
        .describe(
          "The email address of the subscriber to remove from the automation"
        ),
    }),
    handler: async (args: { workflow_id: string; email_address: string }) => {
      return mailchimpRequest(
        "POST",
        `/automations/${args.workflow_id}/removed-subscribers`,
        { email_address: args.email_address }
      );
    },
  },
  {
    name: "mailchimp_get_automation_removed_subscriber",
    description:
      "Get information about a subscriber who was removed from an automation",
    inputSchema: z.object({
      workflow_id: z
        .string()
        .describe("The unique ID for the automation workflow"),
      subscriber_hash: z
        .string()
        .describe(
          "The MD5 hash of the lowercase version of the subscriber's email address"
        ),
    }),
    handler: async (args: {
      workflow_id: string;
      subscriber_hash: string;
    }) => {
      return mailchimpRequest(
        "GET",
        `/automations/${args.workflow_id}/removed-subscribers/${args.subscriber_hash}`
      );
    },
  },
];
