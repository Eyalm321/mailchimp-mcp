import { z } from "zod";
import { mailchimpRequest } from "../client.js";

export const templateTools = [
  {
    name: "mailchimp_list_templates",
    description: "List all templates for the account.",
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
      created_by: z
        .string()
        .optional()
        .describe("The Mailchimp account user who created the template."),
      since_date_created: z
        .string()
        .optional()
        .describe(
          "Restrict the response to templates created after the set date."
        ),
      before_date_created: z
        .string()
        .optional()
        .describe(
          "Restrict the response to templates created before the set date."
        ),
      type: z
        .string()
        .optional()
        .describe("The template type to filter by (e.g., user, base, gallery)."),
      category: z
        .string()
        .optional()
        .describe("The template category to filter by."),
      folder_id: z
        .string()
        .optional()
        .describe("The unique folder ID to filter templates by."),
      sort_field: z
        .string()
        .optional()
        .describe(
          "The field to sort by (e.g., date_created, date_edited, name)."
        ),
      sort_dir: z
        .string()
        .optional()
        .describe("The sort direction: ASC or DESC."),
      content_type: z
        .string()
        .optional()
        .describe("The content type to filter by (e.g., html, template, multichannel)."),
    }),
    handler: async (args: {
      fields?: string;
      exclude_fields?: string;
      count?: number;
      offset?: number;
      created_by?: string;
      since_date_created?: string;
      before_date_created?: string;
      type?: string;
      category?: string;
      folder_id?: string;
      sort_field?: string;
      sort_dir?: string;
      content_type?: string;
    }) => {
      return mailchimpRequest("GET", "/templates", undefined, args);
    },
  },
  {
    name: "mailchimp_create_template",
    description: "Create a new template for the account.",
    inputSchema: z.object({
      name: z.string().describe("The name of the template."),
      folder_id: z
        .string()
        .optional()
        .describe("The ID of the folder to store the template in."),
      html: z.string().describe("The raw HTML for the template."),
    }),
    handler: async (args: {
      name: string;
      folder_id?: string;
      html: string;
    }) => {
      return mailchimpRequest("POST", "/templates", args);
    },
  },
  {
    name: "mailchimp_delete_template",
    description: "Delete a specific template.",
    inputSchema: z.object({
      template_id: z.string().describe("The unique ID of the template."),
    }),
    handler: async (args: { template_id: string }) => {
      return mailchimpRequest(
        "DELETE",
        `/templates/${args.template_id}`
      );
    },
  },
  {
    name: "mailchimp_get_template",
    description: "Get information about a specific template.",
    inputSchema: z.object({
      template_id: z.string().describe("The unique ID of the template."),
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
      template_id: string;
      fields?: string;
      exclude_fields?: string;
    }) => {
      const { template_id, ...params } = args;
      return mailchimpRequest(
        "GET",
        `/templates/${template_id}`,
        undefined,
        params
      );
    },
  },
  {
    name: "mailchimp_update_template",
    description: "Update an existing template.",
    inputSchema: z.object({
      template_id: z.string().describe("The unique ID of the template."),
      name: z
        .string()
        .optional()
        .describe("The name of the template."),
      folder_id: z
        .string()
        .optional()
        .describe("The ID of the folder to store the template in."),
      html: z
        .string()
        .optional()
        .describe("The raw HTML for the template."),
    }),
    handler: async (args: {
      template_id: string;
      name?: string;
      folder_id?: string;
      html?: string;
    }) => {
      const { template_id, ...body } = args;
      return mailchimpRequest(
        "PATCH",
        `/templates/${template_id}`,
        body
      );
    },
  },
  {
    name: "mailchimp_get_template_default_content",
    description:
      "Get the default content for a specific template.",
    inputSchema: z.object({
      template_id: z.string().describe("The unique ID of the template."),
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
      template_id: string;
      fields?: string;
      exclude_fields?: string;
    }) => {
      const { template_id, ...params } = args;
      return mailchimpRequest(
        "GET",
        `/templates/${template_id}/default-content`,
        undefined,
        params
      );
    },
  },
];
