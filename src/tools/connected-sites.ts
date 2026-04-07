import { z } from "zod";
import { mailchimpRequest } from "../client.js";

export const connectedSiteTools = [
  {
    name: "mailchimp_list_connected_sites",
    description: "List all connected sites for the account.",
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
      return mailchimpRequest("GET", "/connected-sites", undefined, args);
    },
  },
  {
    name: "mailchimp_create_connected_site",
    description:
      "Create a new connected site to enable e-commerce features.",
    inputSchema: z.object({
      foreign_id: z
        .string()
        .describe("The unique foreign ID of the connected site."),
      domain: z.string().describe("The domain of the connected site."),
    }),
    handler: async (args: { foreign_id: string; domain: string }) => {
      return mailchimpRequest("POST", "/connected-sites", args);
    },
  },
  {
    name: "mailchimp_delete_connected_site",
    description: "Remove a connected site from the account.",
    inputSchema: z.object({
      connected_site_id: z
        .string()
        .describe("The unique ID of the connected site."),
    }),
    handler: async (args: { connected_site_id: string }) => {
      return mailchimpRequest(
        "DELETE",
        `/connected-sites/${args.connected_site_id}`
      );
    },
  },
  {
    name: "mailchimp_get_connected_site",
    description: "Get information about a specific connected site.",
    inputSchema: z.object({
      connected_site_id: z
        .string()
        .describe("The unique ID of the connected site."),
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
      connected_site_id: string;
      fields?: string;
      exclude_fields?: string;
    }) => {
      const { connected_site_id, ...params } = args;
      return mailchimpRequest(
        "GET",
        `/connected-sites/${connected_site_id}`,
        undefined,
        params
      );
    },
  },
  {
    name: "mailchimp_verify_connected_site_script",
    description:
      "Verify that the connected site script has been installed on the domain.",
    inputSchema: z.object({
      connected_site_id: z
        .string()
        .describe("The unique ID of the connected site."),
    }),
    handler: async (args: { connected_site_id: string }) => {
      return mailchimpRequest(
        "POST",
        `/connected-sites/${args.connected_site_id}/actions/verify-script-installation`
      );
    },
  },
];
