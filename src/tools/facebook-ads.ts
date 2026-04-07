import { z } from "zod";
import { mailchimpRequest } from "../client.js";

export const facebookAdTools = [
  {
    name: "mailchimp_list_facebook_ads",
    description: "List all Facebook ads for the account.",
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
      return mailchimpRequest("GET", "/facebook-ads", undefined, args);
    },
  },
  {
    name: "mailchimp_get_facebook_ad",
    description: "Get details about a specific Facebook ad.",
    inputSchema: z.object({
      outreach_id: z
        .string()
        .describe("The unique ID of the Facebook ad outreach."),
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
      outreach_id: string;
      fields?: string;
      exclude_fields?: string;
    }) => {
      const { outreach_id, ...params } = args;
      return mailchimpRequest(
        "GET",
        `/facebook-ads/${outreach_id}`,
        undefined,
        params
      );
    },
  },
];
