import { z } from "zod";
import { mailchimpRequest } from "../client.js";

export const templateFolderTools = [
  {
    name: "mailchimp_list_template_folders",
    description: "List all template folders for the account.",
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
      return mailchimpRequest("GET", "/template-folders", undefined, args);
    },
  },
  {
    name: "mailchimp_create_template_folder",
    description: "Create a new template folder.",
    inputSchema: z.object({
      name: z.string().describe("The name of the template folder."),
    }),
    handler: async (args: { name: string }) => {
      return mailchimpRequest("POST", "/template-folders", args);
    },
  },
  {
    name: "mailchimp_delete_template_folder",
    description: "Delete a template folder.",
    inputSchema: z.object({
      folder_id: z.string().describe("The unique ID of the template folder."),
    }),
    handler: async (args: { folder_id: string }) => {
      return mailchimpRequest(
        "DELETE",
        `/template-folders/${args.folder_id}`
      );
    },
  },
  {
    name: "mailchimp_get_template_folder",
    description: "Get information about a specific template folder.",
    inputSchema: z.object({
      folder_id: z.string().describe("The unique ID of the template folder."),
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
      folder_id: string;
      fields?: string;
      exclude_fields?: string;
    }) => {
      const { folder_id, ...params } = args;
      return mailchimpRequest(
        "GET",
        `/template-folders/${folder_id}`,
        undefined,
        params
      );
    },
  },
  {
    name: "mailchimp_update_template_folder",
    description: "Update the name of a template folder.",
    inputSchema: z.object({
      folder_id: z.string().describe("The unique ID of the template folder."),
      name: z.string().describe("The new name for the template folder."),
    }),
    handler: async (args: { folder_id: string; name: string }) => {
      const { folder_id, ...body } = args;
      return mailchimpRequest(
        "PATCH",
        `/template-folders/${folder_id}`,
        body
      );
    },
  },
];
