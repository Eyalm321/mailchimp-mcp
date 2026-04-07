import { z } from "zod";
import { mailchimpRequest } from "../client.js";

export const searchTools = [
  {
    name: "mailchimp_search_campaigns",
    description:
      "Search all campaigns for the specified query terms.",
    inputSchema: z.object({
      query: z
        .string()
        .describe("The search query to find campaigns."),
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
      query: string;
      fields?: string;
      exclude_fields?: string;
    }) => {
      return mailchimpRequest(
        "GET",
        "/search-campaigns",
        undefined,
        args
      );
    },
  },
  {
    name: "mailchimp_search_members",
    description:
      "Search for list members across all lists for the specified query terms.",
    inputSchema: z.object({
      query: z
        .string()
        .describe("The search query to find members."),
      fields: z
        .string()
        .optional()
        .describe("A comma-separated list of fields to return."),
      exclude_fields: z
        .string()
        .optional()
        .describe("A comma-separated list of fields to exclude."),
      list_id: z
        .string()
        .optional()
        .describe("The unique ID of a list to limit the search to."),
    }),
    handler: async (args: {
      query: string;
      fields?: string;
      exclude_fields?: string;
      list_id?: string;
    }) => {
      return mailchimpRequest(
        "GET",
        "/search-members",
        undefined,
        args
      );
    },
  },
];
