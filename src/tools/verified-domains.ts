import { z } from "zod";
import { mailchimpRequest } from "../client.js";

export const verifiedDomainTools = [
  {
    name: "mailchimp_list_verified_domains",
    description: "List all verified sending domains for the account.",
    inputSchema: z.object({}),
    handler: async () => {
      return mailchimpRequest("GET", "/verified-domains");
    },
  },
  {
    name: "mailchimp_create_verified_domain",
    description:
      "Add a domain to the account for verification.",
    inputSchema: z.object({
      verification_email: z
        .string()
        .describe(
          "The email address to use for domain verification."
        ),
    }),
    handler: async (args: { verification_email: string }) => {
      return mailchimpRequest("POST", "/verified-domains", args);
    },
  },
  {
    name: "mailchimp_delete_verified_domain",
    description: "Delete a verified domain from the account.",
    inputSchema: z.object({
      domain_name: z
        .string()
        .describe("The domain name to delete."),
    }),
    handler: async (args: { domain_name: string }) => {
      return mailchimpRequest(
        "DELETE",
        `/verified-domains/${args.domain_name}`
      );
    },
  },
  {
    name: "mailchimp_get_verified_domain",
    description: "Get information about a specific verified domain.",
    inputSchema: z.object({
      domain_name: z
        .string()
        .describe("The domain name to retrieve."),
    }),
    handler: async (args: { domain_name: string }) => {
      return mailchimpRequest(
        "GET",
        `/verified-domains/${args.domain_name}`
      );
    },
  },
  {
    name: "mailchimp_verify_domain",
    description:
      "Verify a domain using the verification code sent to the verification email.",
    inputSchema: z.object({
      domain_name: z
        .string()
        .describe("The domain name to verify."),
      code: z
        .string()
        .describe("The verification code sent to the verification email."),
    }),
    handler: async (args: { domain_name: string; code: string }) => {
      const { domain_name, code } = args;
      return mailchimpRequest(
        "POST",
        `/verified-domains/${domain_name}/actions/verify`,
        { code }
      );
    },
  },
];
