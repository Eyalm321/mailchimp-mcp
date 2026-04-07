import { z } from "zod";
import { mailchimpRequest } from "../client.js";

export const batchTools = [
  {
    name: "mailchimp_list_batches",
    description: "List all batch operations that have been created for the account.",
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
      return mailchimpRequest("GET", "/batches", undefined, args);
    },
  },
  {
    name: "mailchimp_create_batch",
    description:
      "Create a new batch operation by providing a list of operations to execute.",
    inputSchema: z.object({
      operations: z
        .array(
          z.object({
            method: z
              .string()
              .describe("The HTTP method to use for the operation."),
            path: z.string().describe("The relative path of the operation."),
            body: z
              .string()
              .optional()
              .describe("The JSON body of the operation as a string."),
            operation_id: z
              .string()
              .optional()
              .describe(
                "An optional identifier for the operation to track results."
              ),
            params: z
              .record(z.string(), z.string())
              .optional()
              .describe("Query string parameters for the operation."),
          })
        )
        .describe("An array of objects that describe operations to perform."),
    }),
    handler: async (args: {
      operations: Array<{
        method: string;
        path: string;
        body?: string;
        operation_id?: string;
        params?: Record<string, string>;
      }>;
    }) => {
      return mailchimpRequest("POST", "/batches", args);
    },
  },
  {
    name: "mailchimp_delete_batch",
    description: "Stop a batch operation and remove it from the status list.",
    inputSchema: z.object({
      batch_id: z.string().describe("The unique ID of the batch operation."),
    }),
    handler: async (args: { batch_id: string }) => {
      return mailchimpRequest("DELETE", `/batches/${args.batch_id}`);
    },
  },
  {
    name: "mailchimp_get_batch",
    description: "Get the status of a specific batch operation.",
    inputSchema: z.object({
      batch_id: z.string().describe("The unique ID of the batch operation."),
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
      batch_id: string;
      fields?: string;
      exclude_fields?: string;
    }) => {
      const { batch_id, ...params } = args;
      return mailchimpRequest(
        "GET",
        `/batches/${batch_id}`,
        undefined,
        params
      );
    },
  },
];
