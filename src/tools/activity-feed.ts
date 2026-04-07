import { z } from "zod";
import { mailchimpRequest } from "../client.js";

export const activityFeedTools = [
  {
    name: "mailchimp_get_activity_feed",
    description:
      "Get the latest chimp chatter activity for the authenticated account",
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
    }),
    handler: async (args: { count?: number; offset?: number }) => {
      return mailchimpRequest(
        "GET",
        "/activity-feed/chimp-chatter",
        undefined,
        {
          count: args.count,
          offset: args.offset,
        }
      );
    },
  },
];
