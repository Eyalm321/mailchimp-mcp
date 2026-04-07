import { z } from "zod";
import { mailchimpRequest } from "../client.js";

export const authorizedAppTools = [
  {
    name: "mailchimp_list_authorized_apps",
    description:
      "List all authorized applications that have access to the account.",
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
      return mailchimpRequest("GET", "/authorized-apps", undefined, args);
    },
  },
  {
    name: "mailchimp_get_authorized_app",
    description:
      "Get information about a specific authorized application.",
    inputSchema: z.object({
      app_id: z.string().describe("The unique ID of the authorized app."),
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
      app_id: string;
      fields?: string;
      exclude_fields?: string;
    }) => {
      const { app_id, ...params } = args;
      return mailchimpRequest(
        "GET",
        `/authorized-apps/${app_id}`,
        undefined,
        params
      );
    },
  },
];
