import { z } from "zod";
import { mailchimpRequest } from "../client.js";

export const customerJourneyTools = [
  {
    name: "mailchimp_trigger_customer_journey",
    description:
      "Trigger a contact into a specific step of a customer journey.",
    inputSchema: z.object({
      journey_id: z
        .number()
        .describe("The unique ID of the customer journey."),
      step_id: z
        .number()
        .describe("The unique ID of the step in the customer journey."),
      email_address: z
        .string()
        .describe(
          "The email address of the contact to trigger into the journey."
        ),
    }),
    handler: async (args: {
      journey_id: number;
      step_id: number;
      email_address: string;
    }) => {
      const { journey_id, step_id, email_address } = args;
      return mailchimpRequest(
        "POST",
        `/customer-journeys/journeys/${journey_id}/steps/${step_id}/actions/trigger`,
        { email_address }
      );
    },
  },
];
