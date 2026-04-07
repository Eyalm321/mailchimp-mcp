import { z } from "zod";
import { mailchimpRequest } from "../client.js";

export const fileManagerTools = [
  {
    name: "mailchimp_list_files",
    description: "List all files in the file manager.",
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
      type: z
        .string()
        .optional()
        .describe("The file type to filter by (e.g., image, file)."),
      created_by: z
        .string()
        .optional()
        .describe("The Mailchimp account user who created the file."),
      before_created_at: z
        .string()
        .optional()
        .describe(
          "Restrict the response to files created before the set date."
        ),
      since_created_at: z
        .string()
        .optional()
        .describe(
          "Restrict the response to files created after the set date."
        ),
      sort_field: z
        .string()
        .optional()
        .describe(
          "The field to sort by (e.g., added_date)."
        ),
      sort_dir: z
        .string()
        .optional()
        .describe("The sort direction: ASC or DESC."),
    }),
    handler: async (args: {
      fields?: string;
      exclude_fields?: string;
      count?: number;
      offset?: number;
      type?: string;
      created_by?: string;
      before_created_at?: string;
      since_created_at?: string;
      sort_field?: string;
      sort_dir?: string;
    }) => {
      return mailchimpRequest(
        "GET",
        "/file-manager/files",
        undefined,
        args
      );
    },
  },
  {
    name: "mailchimp_upload_file",
    description: "Upload a new file to the file manager.",
    inputSchema: z.object({
      name: z.string().describe("The name of the file."),
      file_data: z
        .string()
        .describe("The base64-encoded contents of the file."),
    }),
    handler: async (args: { name: string; file_data: string }) => {
      return mailchimpRequest("POST", "/file-manager/files", args);
    },
  },
  {
    name: "mailchimp_delete_file",
    description: "Delete a specific file from the file manager.",
    inputSchema: z.object({
      file_id: z.string().describe("The unique ID of the file."),
    }),
    handler: async (args: { file_id: string }) => {
      return mailchimpRequest(
        "DELETE",
        `/file-manager/files/${args.file_id}`
      );
    },
  },
  {
    name: "mailchimp_get_file",
    description: "Get information about a specific file in the file manager.",
    inputSchema: z.object({
      file_id: z.string().describe("The unique ID of the file."),
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
      file_id: string;
      fields?: string;
      exclude_fields?: string;
    }) => {
      const { file_id, ...params } = args;
      return mailchimpRequest(
        "GET",
        `/file-manager/files/${file_id}`,
        undefined,
        params
      );
    },
  },
  {
    name: "mailchimp_update_file",
    description:
      "Update a file in the file manager (e.g., rename or move to a folder).",
    inputSchema: z.object({
      file_id: z.string().describe("The unique ID of the file."),
      name: z
        .string()
        .optional()
        .describe("The new name of the file."),
      folder_id: z
        .number()
        .optional()
        .describe("The ID of the folder to move the file to."),
    }),
    handler: async (args: {
      file_id: string;
      name?: string;
      folder_id?: number;
    }) => {
      const { file_id, ...body } = args;
      return mailchimpRequest(
        "PATCH",
        `/file-manager/files/${file_id}`,
        body
      );
    },
  },
  {
    name: "mailchimp_list_file_folders",
    description: "List all folders in the file manager.",
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
        .describe("The Mailchimp account user who created the folder."),
      before_created_at: z
        .string()
        .optional()
        .describe(
          "Restrict the response to folders created before the set date."
        ),
      since_created_at: z
        .string()
        .optional()
        .describe(
          "Restrict the response to folders created after the set date."
        ),
    }),
    handler: async (args: {
      fields?: string;
      exclude_fields?: string;
      count?: number;
      offset?: number;
      created_by?: string;
      before_created_at?: string;
      since_created_at?: string;
    }) => {
      return mailchimpRequest(
        "GET",
        "/file-manager/folders",
        undefined,
        args
      );
    },
  },
  {
    name: "mailchimp_create_file_folder",
    description: "Create a new folder in the file manager.",
    inputSchema: z.object({
      name: z.string().describe("The name of the folder."),
    }),
    handler: async (args: { name: string }) => {
      return mailchimpRequest("POST", "/file-manager/folders", args);
    },
  },
  {
    name: "mailchimp_delete_file_folder",
    description: "Delete a folder from the file manager.",
    inputSchema: z.object({
      folder_id: z.string().describe("The unique ID of the folder."),
    }),
    handler: async (args: { folder_id: string }) => {
      return mailchimpRequest(
        "DELETE",
        `/file-manager/folders/${args.folder_id}`
      );
    },
  },
  {
    name: "mailchimp_get_file_folder",
    description:
      "Get information about a specific folder in the file manager.",
    inputSchema: z.object({
      folder_id: z.string().describe("The unique ID of the folder."),
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
        `/file-manager/folders/${folder_id}`,
        undefined,
        params
      );
    },
  },
  {
    name: "mailchimp_update_file_folder",
    description: "Update the name of a folder in the file manager.",
    inputSchema: z.object({
      folder_id: z.string().describe("The unique ID of the folder."),
      name: z.string().describe("The new name for the folder."),
    }),
    handler: async (args: { folder_id: string; name: string }) => {
      const { folder_id, ...body } = args;
      return mailchimpRequest(
        "PATCH",
        `/file-manager/folders/${folder_id}`,
        body
      );
    },
  },
  {
    name: "mailchimp_list_folder_files",
    description: "List all files within a specific folder in the file manager.",
    inputSchema: z.object({
      folder_id: z.string().describe("The unique ID of the folder."),
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
      type: z
        .string()
        .optional()
        .describe("The file type to filter by (e.g., image, file)."),
      created_by: z
        .string()
        .optional()
        .describe("The Mailchimp account user who created the file."),
      before_created_at: z
        .string()
        .optional()
        .describe(
          "Restrict the response to files created before the set date."
        ),
      since_created_at: z
        .string()
        .optional()
        .describe(
          "Restrict the response to files created after the set date."
        ),
      sort_field: z
        .string()
        .optional()
        .describe(
          "The field to sort by (e.g., added_date)."
        ),
      sort_dir: z
        .string()
        .optional()
        .describe("The sort direction: ASC or DESC."),
    }),
    handler: async (args: {
      folder_id: string;
      fields?: string;
      exclude_fields?: string;
      count?: number;
      offset?: number;
      type?: string;
      created_by?: string;
      before_created_at?: string;
      since_created_at?: string;
      sort_field?: string;
      sort_dir?: string;
    }) => {
      const { folder_id, ...params } = args;
      return mailchimpRequest(
        "GET",
        `/file-manager/folders/${folder_id}/files`,
        undefined,
        params
      );
    },
  },
];
