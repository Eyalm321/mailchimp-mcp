import { z } from "zod";
import { mailchimpRequest } from "../client.js";

export const batchWebhookTools = [
  {
    name: "mailchimp_list_batch_webhooks",
    description:
      "List all batch webhooks that have been configured for the account.",
    inputSchema: z.object({
      fields: z
        .string()
        .optional()
        .describe("A comma-separated list of fields to return."),
      exclude_fields: z
        .string()
        .optional()
        .describe("A comma-separated list of fields to exclude."),
      count: z
        .number()
        .optional()
        .describe("The number of records to return. Default is 10."),
      offset: z
        .number()
        .optional()
        .describe("The number of records to skip. Default is 0."),
    }),
    handler: async (args: {
      fields?: string;
      exclude_fields?: string;
      count?: number;
      offset?: number;
    }) => {
      return mailchimpRequest("GET", "/batch-webhooks", undefined, args);
    },
  },
  {
    name: "mailchimp_create_batch_webhook",
    description:
      "Create a new batch webhook to receive notifications when batch operations complete.",
    inputSchema: z.object({
      url: z
        .string()
        .describe(
          "The URL where Mailchimp will send batch operation webhook notifications."
        ),
      enabled: z
        .boolean()
        .optional()
        .describe("Whether the batch webhook is enabled."),
    }),
    handler: async (args: { url: string; enabled?: boolean }) => {
      return mailchimpRequest("POST", "/batch-webhooks", args);
    },
  },
  {
    name: "mailchimp_delete_batch_webhook",
    description: "Remove a batch webhook.",
    inputSchema: z.object({
      batch_webhook_id: z
        .string()
        .describe("The unique ID of the batch webhook."),
    }),
    handler: async (args: { batch_webhook_id: string }) => {
      return mailchimpRequest(
        "DELETE",
        `/batch-webhooks/${args.batch_webhook_id}`
      );
    },
  },
  {
    name: "mailchimp_get_batch_webhook",
    description: "Get information about a specific batch webhook.",
    inputSchema: z.object({
      batch_webhook_id: z
        .string()
        .describe("The unique ID of the batch webhook."),
      fields: z
        .string()
        .optional()
        .describe("A comma-separated list of fields to return."),
      exclude_fields: z
        .string()
        .optional()
        .describe("A comma-separated list of fields to exclude."),
    }),
    handler: async (args: {
      batch_webhook_id: string;
      fields?: string;
      exclude_fields?: string;
    }) => {
      const { batch_webhook_id, ...params } = args;
      return mailchimpRequest(
        "GET",
        `/batch-webhooks/${batch_webhook_id}`,
        undefined,
        params
      );
    },
  },
  {
    name: "mailchimp_update_batch_webhook",
    description: "Update an existing batch webhook.",
    inputSchema: z.object({
      batch_webhook_id: z
        .string()
        .describe("The unique ID of the batch webhook."),
      url: z
        .string()
        .optional()
        .describe("The URL where Mailchimp will send webhook notifications."),
      enabled: z
        .boolean()
        .optional()
        .describe("Whether the batch webhook is enabled."),
    }),
    handler: async (args: {
      batch_webhook_id: string;
      url?: string;
      enabled?: boolean;
    }) => {
      const { batch_webhook_id, ...body } = args;
      return mailchimpRequest(
        "PATCH",
        `/batch-webhooks/${batch_webhook_id}`,
        body
      );
    },
  },
];
