import { z } from "zod";
import { mailchimpRequest } from "../client.js";

export const campaignFolderTools = [
  {
    name: "mailchimp_list_campaign_folders",
    description: "List all campaign folders for the account.",
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
      return mailchimpRequest("GET", "/campaign-folders", undefined, args);
    },
  },
  {
    name: "mailchimp_create_campaign_folder",
    description: "Create a new campaign folder.",
    inputSchema: z.object({
      name: z.string().describe("The name of the campaign folder."),
    }),
    handler: async (args: { name: string }) => {
      return mailchimpRequest("POST", "/campaign-folders", args);
    },
  },
  {
    name: "mailchimp_delete_campaign_folder",
    description: "Delete a campaign folder.",
    inputSchema: z.object({
      folder_id: z.string().describe("The unique ID of the campaign folder."),
    }),
    handler: async (args: { folder_id: string }) => {
      return mailchimpRequest(
        "DELETE",
        `/campaign-folders/${args.folder_id}`
      );
    },
  },
  {
    name: "mailchimp_get_campaign_folder",
    description: "Get information about a specific campaign folder.",
    inputSchema: z.object({
      folder_id: z.string().describe("The unique ID of the campaign folder."),
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
        `/campaign-folders/${folder_id}`,
        undefined,
        params
      );
    },
  },
  {
    name: "mailchimp_update_campaign_folder",
    description: "Update the name of a campaign folder.",
    inputSchema: z.object({
      folder_id: z.string().describe("The unique ID of the campaign folder."),
      name: z.string().describe("The new name for the campaign folder."),
    }),
    handler: async (args: { folder_id: string; name: string }) => {
      const { folder_id, ...body } = args;
      return mailchimpRequest(
        "PATCH",
        `/campaign-folders/${folder_id}`,
        body
      );
    },
  },
];
