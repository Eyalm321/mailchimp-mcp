import { z } from "zod";
import { mailchimpRequest } from "../client.js";

export const conversationTools = [
  {
    name: "mailchimp_list_conversations",
    description: "List all conversations for the account.",
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
      has_unread_messages: z
        .string()
        .optional()
        .describe(
          "Whether the conversation has any unread messages (true or false)."
        ),
      list_id: z
        .string()
        .optional()
        .describe("The unique ID of the list to filter conversations by."),
      campaign_id: z
        .string()
        .optional()
        .describe(
          "The unique ID of the campaign to filter conversations by."
        ),
    }),
    handler: async (args: {
      fields?: string;
      exclude_fields?: string;
      count?: number;
      offset?: number;
      has_unread_messages?: string;
      list_id?: string;
      campaign_id?: string;
    }) => {
      return mailchimpRequest("GET", "/conversations", undefined, args);
    },
  },
  {
    name: "mailchimp_get_conversation",
    description: "Get details about a specific conversation.",
    inputSchema: z.object({
      conversation_id: z
        .string()
        .describe("The unique ID of the conversation."),
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
      conversation_id: string;
      fields?: string;
      exclude_fields?: string;
    }) => {
      const { conversation_id, ...params } = args;
      return mailchimpRequest(
        "GET",
        `/conversations/${conversation_id}`,
        undefined,
        params
      );
    },
  },
  {
    name: "mailchimp_list_conversation_messages",
    description: "List all messages for a specific conversation.",
    inputSchema: z.object({
      conversation_id: z
        .string()
        .describe("The unique ID of the conversation."),
      fields: z
        .string()
        .optional()
        .describe("A comma-separated list of fields to return."),
      exclude_fields: z
        .string()
        .optional()
        .describe("A comma-separated list of fields to exclude."),
      is_read: z
        .string()
        .optional()
        .describe(
          "Whether a conversation message has been marked as read (true or false)."
        ),
      before_timestamp: z
        .string()
        .optional()
        .describe(
          "Restrict the response to messages created before the set time."
        ),
      since_timestamp: z
        .string()
        .optional()
        .describe(
          "Restrict the response to messages created after the set time."
        ),
    }),
    handler: async (args: {
      conversation_id: string;
      fields?: string;
      exclude_fields?: string;
      is_read?: string;
      before_timestamp?: string;
      since_timestamp?: string;
    }) => {
      const { conversation_id, ...params } = args;
      return mailchimpRequest(
        "GET",
        `/conversations/${conversation_id}/messages`,
        undefined,
        params
      );
    },
  },
  {
    name: "mailchimp_get_conversation_message",
    description: "Get an individual message in a conversation.",
    inputSchema: z.object({
      conversation_id: z
        .string()
        .describe("The unique ID of the conversation."),
      message_id: z.string().describe("The unique ID of the message."),
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
      conversation_id: string;
      message_id: string;
      fields?: string;
      exclude_fields?: string;
    }) => {
      const { conversation_id, message_id, ...params } = args;
      return mailchimpRequest(
        "GET",
        `/conversations/${conversation_id}/messages/${message_id}`,
        undefined,
        params
      );
    },
  },
];
