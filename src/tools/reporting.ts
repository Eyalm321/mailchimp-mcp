import { z } from "zod";
import { mailchimpRequest } from "../client.js";

export const reportingTools = [
  // 1. List Facebook ads reports
  {
    name: "mailchimp_list_facebook_ads_reports",
    description:
      "Get reports for Facebook ads",
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
      return mailchimpRequest(
        "GET",
        "/reporting/facebook-ads",
        undefined,
        {
          fields: args.fields,
          exclude_fields: args.exclude_fields,
          count: args.count,
          offset: args.offset,
        }
      );
    },
  },

  // 2. Get Facebook ad report
  {
    name: "mailchimp_get_facebook_ad_report",
    description:
      "Get report for a specific Facebook ad",
    inputSchema: z.object({
      outreach_id: z
        .string()
        .describe("The unique ID for the Facebook ad outreach"),
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
      outreach_id: string;
      fields?: string;
      exclude_fields?: string;
    }) => {
      return mailchimpRequest(
        "GET",
        `/reporting/facebook-ads/${args.outreach_id}`,
        undefined,
        {
          fields: args.fields,
          exclude_fields: args.exclude_fields,
        }
      );
    },
  },

  // 3. List Facebook ecommerce report
  {
    name: "mailchimp_list_facebook_ecommerce_report",
    description:
      "Get breakdown of product activity for a Facebook ad",
    inputSchema: z.object({
      outreach_id: z
        .string()
        .describe("The unique ID for the Facebook ad outreach"),
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
      outreach_id: string;
      fields?: string;
      exclude_fields?: string;
      count?: number;
      offset?: number;
    }) => {
      return mailchimpRequest(
        "GET",
        `/reporting/facebook-ads/${args.outreach_id}/ecommerce-product-activity`,
        undefined,
        {
          fields: args.fields,
          exclude_fields: args.exclude_fields,
          count: args.count,
          offset: args.offset,
        }
      );
    },
  },

  // 4. List landing page reports
  {
    name: "mailchimp_list_landing_page_reports",
    description:
      "Get reports for landing pages",
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
      return mailchimpRequest(
        "GET",
        "/reporting/landing-pages",
        undefined,
        {
          fields: args.fields,
          exclude_fields: args.exclude_fields,
          count: args.count,
          offset: args.offset,
        }
      );
    },
  },

  // 5. Get landing page report
  {
    name: "mailchimp_get_landing_page_report",
    description:
      "Get report for a specific landing page",
    inputSchema: z.object({
      outreach_id: z
        .string()
        .describe("The unique ID for the landing page outreach"),
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
      outreach_id: string;
      fields?: string;
      exclude_fields?: string;
    }) => {
      return mailchimpRequest(
        "GET",
        `/reporting/landing-pages/${args.outreach_id}`,
        undefined,
        {
          fields: args.fields,
          exclude_fields: args.exclude_fields,
        }
      );
    },
  },

  // 6. List survey reports
  {
    name: "mailchimp_list_survey_reports",
    description:
      "Get reports for surveys",
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
      return mailchimpRequest(
        "GET",
        "/reporting/surveys",
        undefined,
        {
          fields: args.fields,
          exclude_fields: args.exclude_fields,
          count: args.count,
          offset: args.offset,
        }
      );
    },
  },

  // 7. Get survey report
  {
    name: "mailchimp_get_survey_report",
    description:
      "Get report for a specific survey",
    inputSchema: z.object({
      survey_id: z
        .string()
        .describe("The unique ID for the survey"),
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
      survey_id: string;
      fields?: string;
      exclude_fields?: string;
    }) => {
      return mailchimpRequest(
        "GET",
        `/reporting/surveys/${args.survey_id}`,
        undefined,
        {
          fields: args.fields,
          exclude_fields: args.exclude_fields,
        }
      );
    },
  },

  // 8. List survey question reports
  {
    name: "mailchimp_list_survey_question_reports",
    description:
      "Get reports for questions in a specific survey",
    inputSchema: z.object({
      survey_id: z
        .string()
        .describe("The unique ID for the survey"),
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
      survey_id: string;
      fields?: string;
      exclude_fields?: string;
    }) => {
      return mailchimpRequest(
        "GET",
        `/reporting/surveys/${args.survey_id}/questions`,
        undefined,
        {
          fields: args.fields,
          exclude_fields: args.exclude_fields,
        }
      );
    },
  },

  // 9. Get survey question report
  {
    name: "mailchimp_get_survey_question_report",
    description:
      "Get report for a specific question in a survey",
    inputSchema: z.object({
      survey_id: z
        .string()
        .describe("The unique ID for the survey"),
      question_id: z
        .string()
        .describe("The unique ID for the survey question"),
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
      survey_id: string;
      question_id: string;
      fields?: string;
      exclude_fields?: string;
    }) => {
      return mailchimpRequest(
        "GET",
        `/reporting/surveys/${args.survey_id}/questions/${args.question_id}`,
        undefined,
        {
          fields: args.fields,
          exclude_fields: args.exclude_fields,
        }
      );
    },
  },

  // 10. List survey question answers
  {
    name: "mailchimp_list_survey_question_answers",
    description:
      "Get answers for a specific question in a survey",
    inputSchema: z.object({
      survey_id: z
        .string()
        .describe("The unique ID for the survey"),
      question_id: z
        .string()
        .describe("The unique ID for the survey question"),
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
      survey_id: string;
      question_id: string;
      fields?: string;
      exclude_fields?: string;
    }) => {
      return mailchimpRequest(
        "GET",
        `/reporting/surveys/${args.survey_id}/questions/${args.question_id}/answers`,
        undefined,
        {
          fields: args.fields,
          exclude_fields: args.exclude_fields,
        }
      );
    },
  },

  // 11. List survey responses
  {
    name: "mailchimp_list_survey_responses",
    description:
      "Get responses to a specific survey",
    inputSchema: z.object({
      survey_id: z
        .string()
        .describe("The unique ID for the survey"),
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
      survey_id: string;
      fields?: string;
      exclude_fields?: string;
    }) => {
      return mailchimpRequest(
        "GET",
        `/reporting/surveys/${args.survey_id}/responses`,
        undefined,
        {
          fields: args.fields,
          exclude_fields: args.exclude_fields,
        }
      );
    },
  },

  // 12. Get survey response
  {
    name: "mailchimp_get_survey_response",
    description:
      "Get a specific response to a survey",
    inputSchema: z.object({
      survey_id: z
        .string()
        .describe("The unique ID for the survey"),
      response_id: z
        .string()
        .describe("The unique ID for the survey response"),
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
      survey_id: string;
      response_id: string;
      fields?: string;
      exclude_fields?: string;
    }) => {
      return mailchimpRequest(
        "GET",
        `/reporting/surveys/${args.survey_id}/responses/${args.response_id}`,
        undefined,
        {
          fields: args.fields,
          exclude_fields: args.exclude_fields,
        }
      );
    },
  },
];
