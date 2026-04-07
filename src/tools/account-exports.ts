import { z } from "zod";
import { mailchimpRequest } from "../client.js";

export const accountExportsTools = [
  {
    name: "mailchimp_list_account_exports",
    description: "Get a list of account exports for a given account",
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
    }),
    handler: async (args: {
      fields?: string;
      exclude_fields?: string;
      count?: number;
      offset?: number;
    }) => {
      return mailchimpRequest("GET", "/account-exports", undefined, {
        fields: args.fields,
        exclude_fields: args.exclude_fields,
        count: args.count,
        offset: args.offset,
      });
    },
  },
  {
    name: "mailchimp_create_account_export",
    description: "Create a new account export in your Mailchimp account",
    inputSchema: z.object({
      include_stages: z
        .array(z.string())
        .describe(
          "The stages of an account export to include (e.g. contacts, campaigns)"
        ),
      since_timestamp: z
        .string()
        .optional()
        .describe(
          "An ISO 8601 date string to filter exports created after this timestamp"
        ),
    }),
    handler: async (args: {
      include_stages: string[];
      since_timestamp?: string;
    }) => {
      const body: Record<string, unknown> = {
        include_stages: args.include_stages,
      };
      if (args.since_timestamp !== undefined) {
        body.since_timestamp = args.since_timestamp;
      }
      return mailchimpRequest("POST", "/account-exports", body);
    },
  },
  {
    name: "mailchimp_get_account_export",
    description:
      "Get information about a specific account export by its ID",
    inputSchema: z.object({
      export_id: z
        .string()
        .describe("The unique ID for the account export"),
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
      export_id: string;
      fields?: string;
      exclude_fields?: string;
    }) => {
      return mailchimpRequest(
        "GET",
        `/account-exports/${args.export_id}`,
        undefined,
        {
          fields: args.fields,
          exclude_fields: args.exclude_fields,
        }
      );
    },
  },
];
