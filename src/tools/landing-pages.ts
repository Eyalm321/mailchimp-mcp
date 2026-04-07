import { z } from "zod";
import { mailchimpRequest } from "../client.js";

export const landingPageTools = [
  {
    name: "mailchimp_list_landing_pages",
    description: "List all landing pages for the account.",
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
      sort_dir: z
        .string()
        .optional()
        .describe("The sort direction: ASC or DESC."),
      sort_field: z
        .string()
        .optional()
        .describe(
          "The field to sort by (e.g., created_at, updated_at)."
        ),
    }),
    handler: async (args: {
      fields?: string;
      exclude_fields?: string;
      count?: number;
      offset?: number;
      sort_dir?: string;
      sort_field?: string;
    }) => {
      return mailchimpRequest("GET", "/landing-pages", undefined, args);
    },
  },
  {
    name: "mailchimp_create_landing_page",
    description: "Create a new landing page.",
    inputSchema: z.object({
      name: z
        .string()
        .optional()
        .describe("The name of the landing page."),
      title: z
        .string()
        .optional()
        .describe("The title of the landing page shown in the browser tab."),
      description: z
        .string()
        .optional()
        .describe("A description of the landing page."),
      store_id: z
        .string()
        .optional()
        .describe("The ID of the store associated with this landing page."),
      list_id: z
        .string()
        .optional()
        .describe(
          "The ID of the list associated with this landing page."
        ),
      type: z
        .string()
        .optional()
        .describe("The type of landing page (e.g., signup, product)."),
      template_id: z
        .number()
        .optional()
        .describe("The template ID to use for the landing page."),
      tracking: z
        .object({
          track_with_mailchimp: z
            .boolean()
            .optional()
            .describe("Use Mailchimp tracking."),
          enable_restricted_data_processing: z
            .boolean()
            .optional()
            .describe("Enable restricted data processing."),
        })
        .optional()
        .describe("Tracking settings for the landing page."),
    }),
    handler: async (args: {
      name?: string;
      title?: string;
      description?: string;
      store_id?: string;
      list_id?: string;
      type?: string;
      template_id?: number;
      tracking?: {
        track_with_mailchimp?: boolean;
        enable_restricted_data_processing?: boolean;
      };
    }) => {
      return mailchimpRequest("POST", "/landing-pages", args);
    },
  },
  {
    name: "mailchimp_delete_landing_page",
    description: "Delete a landing page.",
    inputSchema: z.object({
      page_id: z.string().describe("The unique ID of the landing page."),
    }),
    handler: async (args: { page_id: string }) => {
      return mailchimpRequest(
        "DELETE",
        `/landing-pages/${args.page_id}`
      );
    },
  },
  {
    name: "mailchimp_get_landing_page",
    description: "Get information about a specific landing page.",
    inputSchema: z.object({
      page_id: z.string().describe("The unique ID of the landing page."),
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
      page_id: string;
      fields?: string;
      exclude_fields?: string;
    }) => {
      const { page_id, ...params } = args;
      return mailchimpRequest(
        "GET",
        `/landing-pages/${page_id}`,
        undefined,
        params
      );
    },
  },
  {
    name: "mailchimp_update_landing_page",
    description: "Update a landing page.",
    inputSchema: z.object({
      page_id: z.string().describe("The unique ID of the landing page."),
      name: z
        .string()
        .optional()
        .describe("The name of the landing page."),
      title: z
        .string()
        .optional()
        .describe("The title of the landing page shown in the browser tab."),
      description: z
        .string()
        .optional()
        .describe("A description of the landing page."),
      store_id: z
        .string()
        .optional()
        .describe("The ID of the store associated with this landing page."),
      list_id: z
        .string()
        .optional()
        .describe(
          "The ID of the list associated with this landing page."
        ),
      tracking: z
        .object({
          track_with_mailchimp: z
            .boolean()
            .optional()
            .describe("Use Mailchimp tracking."),
          enable_restricted_data_processing: z
            .boolean()
            .optional()
            .describe("Enable restricted data processing."),
        })
        .optional()
        .describe("Tracking settings for the landing page."),
    }),
    handler: async (args: {
      page_id: string;
      name?: string;
      title?: string;
      description?: string;
      store_id?: string;
      list_id?: string;
      tracking?: {
        track_with_mailchimp?: boolean;
        enable_restricted_data_processing?: boolean;
      };
    }) => {
      const { page_id, ...body } = args;
      return mailchimpRequest(
        "PATCH",
        `/landing-pages/${page_id}`,
        body
      );
    },
  },
  {
    name: "mailchimp_publish_landing_page",
    description: "Publish a landing page to make it publicly accessible.",
    inputSchema: z.object({
      page_id: z.string().describe("The unique ID of the landing page."),
    }),
    handler: async (args: { page_id: string }) => {
      return mailchimpRequest(
        "POST",
        `/landing-pages/${args.page_id}/actions/publish`
      );
    },
  },
  {
    name: "mailchimp_unpublish_landing_page",
    description:
      "Unpublish a landing page to remove it from public access.",
    inputSchema: z.object({
      page_id: z.string().describe("The unique ID of the landing page."),
    }),
    handler: async (args: { page_id: string }) => {
      return mailchimpRequest(
        "POST",
        `/landing-pages/${args.page_id}/actions/unpublish`
      );
    },
  },
  {
    name: "mailchimp_get_landing_page_content",
    description: "Get the content of a specific landing page.",
    inputSchema: z.object({
      page_id: z.string().describe("The unique ID of the landing page."),
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
      page_id: string;
      fields?: string;
      exclude_fields?: string;
    }) => {
      const { page_id, ...params } = args;
      return mailchimpRequest(
        "GET",
        `/landing-pages/${page_id}/content`,
        undefined,
        params
      );
    },
  },
];
