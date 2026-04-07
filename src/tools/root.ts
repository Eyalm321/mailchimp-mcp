import { z } from "zod";
import { mailchimpRequest } from "../client.js";

export const rootTools = [
  {
    name: "mailchimp_get_root",
    description:
      "Get links to all resources available in the Mailchimp Marketing API",
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
    }),
    handler: async (args: { fields?: string; exclude_fields?: string }) => {
      return mailchimpRequest("GET", "/", undefined, {
        fields: args.fields,
        exclude_fields: args.exclude_fields,
      });
    },
  },
  {
    name: "mailchimp_ping",
    description:
      "Ping the Mailchimp Marketing API to test connectivity and authentication",
    inputSchema: z.object({}),
    handler: async () => {
      return mailchimpRequest("GET", "/ping");
    },
  },
];
