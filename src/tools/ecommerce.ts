import { z } from "zod";
import { mailchimpRequest } from "../client.js";

// Reusable schema fragments
const fieldsParams = {
  fields: z
    .string()
    .optional()
    .describe("A comma-separated list of fields to return."),
  exclude_fields: z
    .string()
    .optional()
    .describe("A comma-separated list of fields to exclude."),
};

const paginationParams = {
  ...fieldsParams,
  count: z
    .number()
    .optional()
    .describe("The number of records to return. Default is 10."),
  offset: z
    .number()
    .optional()
    .describe("The number of records to skip. Default is 0."),
};

type FieldsArgs = {
  fields?: string;
  exclude_fields?: string;
};

type PaginationArgs = FieldsArgs & {
  count?: number;
  offset?: number;
};

export const ecommerceTools = [
  // ============================================================
  // Orders (top-level)
  // ============================================================
  {
    name: "mailchimp_list_ecommerce_orders",
    description:
      "List all e-commerce orders across all stores in the account.",
    inputSchema: z.object({
      ...paginationParams,
      campaign_id: z
        .string()
        .optional()
        .describe("Restrict results to orders with a specific campaign_id."),
      outreach_id: z
        .string()
        .optional()
        .describe(
          "Restrict results to orders with a specific outreach_id."
        ),
      customer_id: z
        .string()
        .optional()
        .describe(
          "Restrict results to orders made by a specific customer_id."
        ),
      has_outreach: z
        .boolean()
        .optional()
        .describe(
          "Restrict results to orders that have an outreach attached."
        ),
    }),
    handler: async (
      args: PaginationArgs & {
        campaign_id?: string;
        outreach_id?: string;
        customer_id?: string;
        has_outreach?: boolean;
      }
    ) => {
      return mailchimpRequest("GET", "/ecommerce/orders", undefined, args);
    },
  },

  // ============================================================
  // Stores
  // ============================================================
  {
    name: "mailchimp_list_stores",
    description: "List all e-commerce stores in the account.",
    inputSchema: z.object({ ...paginationParams }),
    handler: async (args: PaginationArgs) => {
      return mailchimpRequest("GET", "/ecommerce/stores", undefined, args);
    },
  },
  {
    name: "mailchimp_create_store",
    description: "Create a new e-commerce store.",
    inputSchema: z.object({
      id: z.string().describe("The unique identifier for the store."),
      list_id: z
        .string()
        .describe("The unique identifier for the Mailchimp list associated with the store."),
      name: z.string().describe("The name of the store."),
      currency_code: z
        .string()
        .describe("The three-letter ISO 4217 currency code for the store."),
      platform: z
        .string()
        .optional()
        .describe("The e-commerce platform of the store."),
      domain: z.string().optional().describe("The store domain."),
      is_syncing: z
        .boolean()
        .optional()
        .describe("Whether the store is currently syncing."),
      email_address: z
        .string()
        .optional()
        .describe("The email address for the store."),
      money_format: z
        .string()
        .optional()
        .describe("The currency format for the store (e.g. $)."),
      primary_locale: z
        .string()
        .optional()
        .describe("The primary locale for the store."),
      timezone: z
        .string()
        .optional()
        .describe("The timezone for the store."),
      phone: z.string().optional().describe("The store phone number."),
      address: z
        .record(z.string(), z.unknown())
        .optional()
        .describe(
          "The store address object with fields like address1, address2, city, province, province_code, postal_code, country, country_code, longitude, latitude."
        ),
    }),
    handler: async (args: {
      id: string;
      list_id: string;
      name: string;
      currency_code: string;
      platform?: string;
      domain?: string;
      is_syncing?: boolean;
      email_address?: string;
      money_format?: string;
      primary_locale?: string;
      timezone?: string;
      phone?: string;
      address?: Record<string, unknown>;
    }) => {
      return mailchimpRequest("POST", "/ecommerce/stores", args);
    },
  },
  {
    name: "mailchimp_delete_store",
    description:
      "Delete an e-commerce store. This will also delete all data associated with the store.",
    inputSchema: z.object({
      store_id: z.string().describe("The unique identifier for the store."),
    }),
    handler: async (args: { store_id: string }) => {
      return mailchimpRequest(
        "DELETE",
        `/ecommerce/stores/${args.store_id}`
      );
    },
  },
  {
    name: "mailchimp_get_store",
    description: "Get information about a specific e-commerce store.",
    inputSchema: z.object({
      store_id: z.string().describe("The unique identifier for the store."),
      ...fieldsParams,
    }),
    handler: async (args: { store_id: string } & FieldsArgs) => {
      const { store_id, ...params } = args;
      return mailchimpRequest(
        "GET",
        `/ecommerce/stores/${store_id}`,
        undefined,
        params
      );
    },
  },
  {
    name: "mailchimp_update_store",
    description: "Update an e-commerce store.",
    inputSchema: z.object({
      store_id: z.string().describe("The unique identifier for the store."),
      name: z.string().optional().describe("The name of the store."),
      platform: z
        .string()
        .optional()
        .describe("The e-commerce platform of the store."),
      domain: z.string().optional().describe("The store domain."),
      is_syncing: z
        .boolean()
        .optional()
        .describe("Whether the store is currently syncing."),
      email_address: z
        .string()
        .optional()
        .describe("The email address for the store."),
      currency_code: z
        .string()
        .optional()
        .describe("The three-letter ISO 4217 currency code."),
      money_format: z
        .string()
        .optional()
        .describe("The currency format for the store."),
      primary_locale: z
        .string()
        .optional()
        .describe("The primary locale for the store."),
      timezone: z.string().optional().describe("The timezone for the store."),
      phone: z.string().optional().describe("The store phone number."),
      address: z
        .record(z.string(), z.unknown())
        .optional()
        .describe("The store address object."),
    }),
    handler: async (args: {
      store_id: string;
      name?: string;
      platform?: string;
      domain?: string;
      is_syncing?: boolean;
      email_address?: string;
      currency_code?: string;
      money_format?: string;
      primary_locale?: string;
      timezone?: string;
      phone?: string;
      address?: Record<string, unknown>;
    }) => {
      const { store_id, ...body } = args;
      return mailchimpRequest(
        "PATCH",
        `/ecommerce/stores/${store_id}`,
        body
      );
    },
  },

  // ============================================================
  // Carts
  // ============================================================
  {
    name: "mailchimp_list_store_carts",
    description: "List all carts for a specific e-commerce store.",
    inputSchema: z.object({
      store_id: z.string().describe("The unique identifier for the store."),
      ...paginationParams,
    }),
    handler: async (args: { store_id: string } & PaginationArgs) => {
      const { store_id, ...params } = args;
      return mailchimpRequest(
        "GET",
        `/ecommerce/stores/${store_id}/carts`,
        undefined,
        params
      );
    },
  },
  {
    name: "mailchimp_create_store_cart",
    description: "Create a new cart for a specific e-commerce store.",
    inputSchema: z.object({
      store_id: z.string().describe("The unique identifier for the store."),
      id: z.string().describe("A unique identifier for the cart."),
      customer: z
        .object({
          id: z.string().describe("A unique identifier for the customer."),
        })
        .describe("Information about the customer associated with this cart."),
      currency_code: z
        .string()
        .describe("The three-letter ISO 4217 currency code."),
      order_total: z.number().describe("The order total for the cart."),
      lines: z
        .array(z.record(z.string(), z.unknown()))
        .describe(
          "An array of cart line items. Each item should have id, product_id, product_variant_id, quantity, and price."
        ),
      campaign_id: z
        .string()
        .optional()
        .describe("A string that uniquely identifies the campaign."),
      checkout_url: z
        .string()
        .optional()
        .describe("The URL for the cart checkout."),
      tax_total: z
        .number()
        .optional()
        .describe("The total tax for the cart."),
    }),
    handler: async (args: {
      store_id: string;
      id: string;
      customer: { id: string };
      currency_code: string;
      order_total: number;
      lines: Record<string, unknown>[];
      campaign_id?: string;
      checkout_url?: string;
      tax_total?: number;
    }) => {
      const { store_id, ...body } = args;
      return mailchimpRequest(
        "POST",
        `/ecommerce/stores/${store_id}/carts`,
        body
      );
    },
  },
  {
    name: "mailchimp_delete_store_cart",
    description: "Delete a cart from a specific e-commerce store.",
    inputSchema: z.object({
      store_id: z.string().describe("The unique identifier for the store."),
      cart_id: z.string().describe("The unique identifier for the cart."),
    }),
    handler: async (args: { store_id: string; cart_id: string }) => {
      return mailchimpRequest(
        "DELETE",
        `/ecommerce/stores/${args.store_id}/carts/${args.cart_id}`
      );
    },
  },
  {
    name: "mailchimp_get_store_cart",
    description: "Get information about a specific cart in a store.",
    inputSchema: z.object({
      store_id: z.string().describe("The unique identifier for the store."),
      cart_id: z.string().describe("The unique identifier for the cart."),
      ...fieldsParams,
    }),
    handler: async (
      args: { store_id: string; cart_id: string } & FieldsArgs
    ) => {
      const { store_id, cart_id, ...params } = args;
      return mailchimpRequest(
        "GET",
        `/ecommerce/stores/${store_id}/carts/${cart_id}`,
        undefined,
        params
      );
    },
  },
  {
    name: "mailchimp_update_store_cart",
    description: "Update a specific cart in a store.",
    inputSchema: z.object({
      store_id: z.string().describe("The unique identifier for the store."),
      cart_id: z.string().describe("The unique identifier for the cart."),
      customer: z
        .record(z.string(), z.unknown())
        .optional()
        .describe("The customer associated with the cart."),
      currency_code: z
        .string()
        .optional()
        .describe("The three-letter ISO 4217 currency code."),
      order_total: z
        .number()
        .optional()
        .describe("The order total for the cart."),
      lines: z
        .array(z.record(z.string(), z.unknown()))
        .optional()
        .describe("An array of cart line items."),
      campaign_id: z
        .string()
        .optional()
        .describe("A string that uniquely identifies the campaign."),
      checkout_url: z
        .string()
        .optional()
        .describe("The URL for the cart checkout."),
      tax_total: z
        .number()
        .optional()
        .describe("The total tax for the cart."),
    }),
    handler: async (args: {
      store_id: string;
      cart_id: string;
      customer?: Record<string, unknown>;
      currency_code?: string;
      order_total?: number;
      lines?: Record<string, unknown>[];
      campaign_id?: string;
      checkout_url?: string;
      tax_total?: number;
    }) => {
      const { store_id, cart_id, ...body } = args;
      return mailchimpRequest(
        "PATCH",
        `/ecommerce/stores/${store_id}/carts/${cart_id}`,
        body
      );
    },
  },

  // ============================================================
  // Cart Lines
  // ============================================================
  {
    name: "mailchimp_list_cart_lines",
    description: "List all lines for a specific cart in a store.",
    inputSchema: z.object({
      store_id: z.string().describe("The unique identifier for the store."),
      cart_id: z.string().describe("The unique identifier for the cart."),
      ...paginationParams,
    }),
    handler: async (
      args: { store_id: string; cart_id: string } & PaginationArgs
    ) => {
      const { store_id, cart_id, ...params } = args;
      return mailchimpRequest(
        "GET",
        `/ecommerce/stores/${store_id}/carts/${cart_id}/lines`,
        undefined,
        params
      );
    },
  },
  {
    name: "mailchimp_create_cart_line",
    description: "Add a new line item to a cart.",
    inputSchema: z.object({
      store_id: z.string().describe("The unique identifier for the store."),
      cart_id: z.string().describe("The unique identifier for the cart."),
      id: z.string().describe("A unique identifier for the cart line item."),
      product_id: z
        .string()
        .describe("A unique identifier for the product associated with the line item."),
      product_variant_id: z
        .string()
        .describe("A unique identifier for the product variant."),
      quantity: z.number().describe("The quantity of the cart line item."),
      price: z
        .number()
        .describe("The price of a cart line item."),
    }),
    handler: async (args: {
      store_id: string;
      cart_id: string;
      id: string;
      product_id: string;
      product_variant_id: string;
      quantity: number;
      price: number;
    }) => {
      const { store_id, cart_id, ...body } = args;
      return mailchimpRequest(
        "POST",
        `/ecommerce/stores/${store_id}/carts/${cart_id}/lines`,
        body
      );
    },
  },
  {
    name: "mailchimp_delete_cart_line",
    description: "Delete a specific cart line item.",
    inputSchema: z.object({
      store_id: z.string().describe("The unique identifier for the store."),
      cart_id: z.string().describe("The unique identifier for the cart."),
      line_id: z
        .string()
        .describe("The unique identifier for the cart line item."),
    }),
    handler: async (args: {
      store_id: string;
      cart_id: string;
      line_id: string;
    }) => {
      return mailchimpRequest(
        "DELETE",
        `/ecommerce/stores/${args.store_id}/carts/${args.cart_id}/lines/${args.line_id}`
      );
    },
  },
  {
    name: "mailchimp_get_cart_line",
    description: "Get information about a specific cart line item.",
    inputSchema: z.object({
      store_id: z.string().describe("The unique identifier for the store."),
      cart_id: z.string().describe("The unique identifier for the cart."),
      line_id: z
        .string()
        .describe("The unique identifier for the cart line item."),
      ...fieldsParams,
    }),
    handler: async (
      args: {
        store_id: string;
        cart_id: string;
        line_id: string;
      } & FieldsArgs
    ) => {
      const { store_id, cart_id, line_id, ...params } = args;
      return mailchimpRequest(
        "GET",
        `/ecommerce/stores/${store_id}/carts/${cart_id}/lines/${line_id}`,
        undefined,
        params
      );
    },
  },
  {
    name: "mailchimp_update_cart_line",
    description: "Update a specific cart line item.",
    inputSchema: z.object({
      store_id: z.string().describe("The unique identifier for the store."),
      cart_id: z.string().describe("The unique identifier for the cart."),
      line_id: z
        .string()
        .describe("The unique identifier for the cart line item."),
      product_id: z
        .string()
        .optional()
        .describe("A unique identifier for the product."),
      product_variant_id: z
        .string()
        .optional()
        .describe("A unique identifier for the product variant."),
      quantity: z
        .number()
        .optional()
        .describe("The quantity of the cart line item."),
      price: z
        .number()
        .optional()
        .describe("The price of a cart line item."),
    }),
    handler: async (args: {
      store_id: string;
      cart_id: string;
      line_id: string;
      product_id?: string;
      product_variant_id?: string;
      quantity?: number;
      price?: number;
    }) => {
      const { store_id, cart_id, line_id, ...body } = args;
      return mailchimpRequest(
        "PATCH",
        `/ecommerce/stores/${store_id}/carts/${cart_id}/lines/${line_id}`,
        body
      );
    },
  },

  // ============================================================
  // Customers
  // ============================================================
  {
    name: "mailchimp_list_store_customers",
    description: "List all customers for a specific e-commerce store.",
    inputSchema: z.object({
      store_id: z.string().describe("The unique identifier for the store."),
      ...paginationParams,
      email_address: z
        .string()
        .optional()
        .describe(
          "Restrict results to customers with a specific email address."
        ),
    }),
    handler: async (
      args: { store_id: string; email_address?: string } & PaginationArgs
    ) => {
      const { store_id, ...params } = args;
      return mailchimpRequest(
        "GET",
        `/ecommerce/stores/${store_id}/customers`,
        undefined,
        params
      );
    },
  },
  {
    name: "mailchimp_create_store_customer",
    description: "Add a new customer to a store.",
    inputSchema: z.object({
      store_id: z.string().describe("The unique identifier for the store."),
      id: z.string().describe("A unique identifier for the customer."),
      email_address: z
        .string()
        .describe("The customer's email address."),
      opt_in_status: z
        .boolean()
        .describe("The customer's opt-in status."),
      company: z
        .string()
        .optional()
        .describe("The customer's company."),
      first_name: z
        .string()
        .optional()
        .describe("The customer's first name."),
      last_name: z
        .string()
        .optional()
        .describe("The customer's last name."),
      address: z
        .record(z.string(), z.unknown())
        .optional()
        .describe(
          "The customer's address object with address1, address2, city, province, province_code, postal_code, country, country_code."
        ),
    }),
    handler: async (args: {
      store_id: string;
      id: string;
      email_address: string;
      opt_in_status: boolean;
      company?: string;
      first_name?: string;
      last_name?: string;
      address?: Record<string, unknown>;
    }) => {
      const { store_id, ...body } = args;
      return mailchimpRequest(
        "POST",
        `/ecommerce/stores/${store_id}/customers`,
        body
      );
    },
  },
  {
    name: "mailchimp_delete_store_customer",
    description: "Delete a customer from a store.",
    inputSchema: z.object({
      store_id: z.string().describe("The unique identifier for the store."),
      customer_id: z
        .string()
        .describe("The unique identifier for the customer."),
    }),
    handler: async (args: { store_id: string; customer_id: string }) => {
      return mailchimpRequest(
        "DELETE",
        `/ecommerce/stores/${args.store_id}/customers/${args.customer_id}`
      );
    },
  },
  {
    name: "mailchimp_get_store_customer",
    description: "Get information about a specific customer in a store.",
    inputSchema: z.object({
      store_id: z.string().describe("The unique identifier for the store."),
      customer_id: z
        .string()
        .describe("The unique identifier for the customer."),
      ...fieldsParams,
    }),
    handler: async (
      args: { store_id: string; customer_id: string } & FieldsArgs
    ) => {
      const { store_id, customer_id, ...params } = args;
      return mailchimpRequest(
        "GET",
        `/ecommerce/stores/${store_id}/customers/${customer_id}`,
        undefined,
        params
      );
    },
  },
  {
    name: "mailchimp_update_store_customer",
    description: "Update a customer in a store.",
    inputSchema: z.object({
      store_id: z.string().describe("The unique identifier for the store."),
      customer_id: z
        .string()
        .describe("The unique identifier for the customer."),
      opt_in_status: z
        .boolean()
        .optional()
        .describe("The customer's opt-in status."),
      company: z.string().optional().describe("The customer's company."),
      first_name: z
        .string()
        .optional()
        .describe("The customer's first name."),
      last_name: z
        .string()
        .optional()
        .describe("The customer's last name."),
      address: z
        .record(z.string(), z.unknown())
        .optional()
        .describe("The customer's address object."),
    }),
    handler: async (args: {
      store_id: string;
      customer_id: string;
      opt_in_status?: boolean;
      company?: string;
      first_name?: string;
      last_name?: string;
      address?: Record<string, unknown>;
    }) => {
      const { store_id, customer_id, ...body } = args;
      return mailchimpRequest(
        "PATCH",
        `/ecommerce/stores/${store_id}/customers/${customer_id}`,
        body
      );
    },
  },
  {
    name: "mailchimp_upsert_store_customer",
    description:
      "Add or update a customer in a store. If the customer exists, it will be updated; otherwise, it will be created.",
    inputSchema: z.object({
      store_id: z.string().describe("The unique identifier for the store."),
      customer_id: z
        .string()
        .describe("The unique identifier for the customer."),
      id: z.string().describe("A unique identifier for the customer."),
      email_address: z.string().describe("The customer's email address."),
      opt_in_status: z.boolean().describe("The customer's opt-in status."),
      company: z.string().optional().describe("The customer's company."),
      first_name: z
        .string()
        .optional()
        .describe("The customer's first name."),
      last_name: z
        .string()
        .optional()
        .describe("The customer's last name."),
      address: z
        .record(z.string(), z.unknown())
        .optional()
        .describe("The customer's address object."),
    }),
    handler: async (args: {
      store_id: string;
      customer_id: string;
      id: string;
      email_address: string;
      opt_in_status: boolean;
      company?: string;
      first_name?: string;
      last_name?: string;
      address?: Record<string, unknown>;
    }) => {
      const { store_id, customer_id, ...body } = args;
      return mailchimpRequest(
        "PUT",
        `/ecommerce/stores/${store_id}/customers/${customer_id}`,
        body
      );
    },
  },

  // ============================================================
  // Orders (store-level)
  // ============================================================
  {
    name: "mailchimp_list_store_orders",
    description: "List all orders for a specific e-commerce store.",
    inputSchema: z.object({
      store_id: z.string().describe("The unique identifier for the store."),
      ...paginationParams,
      customer_id: z
        .string()
        .optional()
        .describe("Restrict results to orders made by a specific customer."),
      has_outreach: z
        .boolean()
        .optional()
        .describe("Restrict results to orders that have an outreach attached."),
      campaign_id: z
        .string()
        .optional()
        .describe("Restrict results to orders with a specific campaign_id."),
      outreach_id: z
        .string()
        .optional()
        .describe("Restrict results to orders with a specific outreach_id."),
    }),
    handler: async (
      args: {
        store_id: string;
        customer_id?: string;
        has_outreach?: boolean;
        campaign_id?: string;
        outreach_id?: string;
      } & PaginationArgs
    ) => {
      const { store_id, ...params } = args;
      return mailchimpRequest(
        "GET",
        `/ecommerce/stores/${store_id}/orders`,
        undefined,
        params
      );
    },
  },
  {
    name: "mailchimp_create_store_order",
    description: "Create a new order for a store.",
    inputSchema: z.object({
      store_id: z.string().describe("The unique identifier for the store."),
      id: z.string().describe("A unique identifier for the order."),
      customer: z
        .object({
          id: z.string().describe("A unique identifier for the customer."),
          email_address: z
            .string()
            .optional()
            .describe("The customer's email address."),
          opt_in_status: z
            .boolean()
            .optional()
            .describe("The customer's opt-in status."),
        })
        .describe("Information about the customer for this order."),
      currency_code: z
        .string()
        .describe("The three-letter ISO 4217 currency code."),
      order_total: z.number().describe("The total for the order."),
      lines: z
        .array(z.record(z.string(), z.unknown()))
        .describe(
          "An array of order line items. Each should have id, product_id, product_variant_id, quantity, and price."
        ),
      campaign_id: z
        .string()
        .optional()
        .describe("A string that uniquely identifies the campaign associated with an order."),
      financial_status: z
        .string()
        .optional()
        .describe("The financial status of the order (e.g. paid, pending, refunded, cancelled)."),
      fulfillment_status: z
        .string()
        .optional()
        .describe("The fulfillment status of the order (e.g. fulfilled, partial, not_fulfilled)."),
      order_url: z
        .string()
        .optional()
        .describe("The URL for the order."),
      discount_total: z
        .number()
        .optional()
        .describe("The total amount of discounts applied to the order."),
      tax_total: z
        .number()
        .optional()
        .describe("The tax total for the order."),
      shipping_total: z
        .number()
        .optional()
        .describe("The shipping total for the order."),
      tracking_code: z
        .string()
        .optional()
        .describe("The Mailchimp tracking code for the order (e.g. prec)."),
      processed_at_foreign: z
        .string()
        .optional()
        .describe("The date and time when the order was processed in ISO 8601 format."),
      cancelled_at_foreign: z
        .string()
        .optional()
        .describe("The date and time when the order was cancelled in ISO 8601 format."),
      updated_at_foreign: z
        .string()
        .optional()
        .describe("The date and time when the order was updated in ISO 8601 format."),
      shipping_address: z
        .record(z.string(), z.unknown())
        .optional()
        .describe("The shipping address for the order."),
      billing_address: z
        .record(z.string(), z.unknown())
        .optional()
        .describe("The billing address for the order."),
      outreach: z
        .record(z.string(), z.unknown())
        .optional()
        .describe("The outreach associated with this order (e.g. id of the outreach)."),
      promos: z
        .array(z.record(z.string(), z.unknown()))
        .optional()
        .describe("An array of promotional discounts applied to the order."),
    }),
    handler: async (args: {
      store_id: string;
      id: string;
      customer: { id: string; email_address?: string; opt_in_status?: boolean };
      currency_code: string;
      order_total: number;
      lines: Record<string, unknown>[];
      campaign_id?: string;
      financial_status?: string;
      fulfillment_status?: string;
      order_url?: string;
      discount_total?: number;
      tax_total?: number;
      shipping_total?: number;
      tracking_code?: string;
      processed_at_foreign?: string;
      cancelled_at_foreign?: string;
      updated_at_foreign?: string;
      shipping_address?: Record<string, unknown>;
      billing_address?: Record<string, unknown>;
      outreach?: Record<string, unknown>;
      promos?: Record<string, unknown>[];
    }) => {
      const { store_id, ...body } = args;
      return mailchimpRequest(
        "POST",
        `/ecommerce/stores/${store_id}/orders`,
        body
      );
    },
  },
  {
    name: "mailchimp_delete_store_order",
    description: "Delete an order from a store.",
    inputSchema: z.object({
      store_id: z.string().describe("The unique identifier for the store."),
      order_id: z.string().describe("The unique identifier for the order."),
    }),
    handler: async (args: { store_id: string; order_id: string }) => {
      return mailchimpRequest(
        "DELETE",
        `/ecommerce/stores/${args.store_id}/orders/${args.order_id}`
      );
    },
  },
  {
    name: "mailchimp_get_store_order",
    description: "Get information about a specific order in a store.",
    inputSchema: z.object({
      store_id: z.string().describe("The unique identifier for the store."),
      order_id: z.string().describe("The unique identifier for the order."),
      ...fieldsParams,
    }),
    handler: async (
      args: { store_id: string; order_id: string } & FieldsArgs
    ) => {
      const { store_id, order_id, ...params } = args;
      return mailchimpRequest(
        "GET",
        `/ecommerce/stores/${store_id}/orders/${order_id}`,
        undefined,
        params
      );
    },
  },
  {
    name: "mailchimp_update_store_order",
    description: "Update a specific order in a store.",
    inputSchema: z.object({
      store_id: z.string().describe("The unique identifier for the store."),
      order_id: z.string().describe("The unique identifier for the order."),
      customer: z
        .record(z.string(), z.unknown())
        .optional()
        .describe("Information about the customer for this order."),
      campaign_id: z.string().optional().describe("The campaign ID."),
      financial_status: z
        .string()
        .optional()
        .describe("The financial status of the order."),
      fulfillment_status: z
        .string()
        .optional()
        .describe("The fulfillment status of the order."),
      currency_code: z
        .string()
        .optional()
        .describe("The three-letter ISO 4217 currency code."),
      order_total: z.number().optional().describe("The total for the order."),
      order_url: z
        .string()
        .optional()
        .describe("The URL for the order."),
      discount_total: z
        .number()
        .optional()
        .describe("The total amount of discounts."),
      tax_total: z.number().optional().describe("The tax total."),
      shipping_total: z
        .number()
        .optional()
        .describe("The shipping total."),
      tracking_code: z
        .string()
        .optional()
        .describe("The Mailchimp tracking code for the order."),
      processed_at_foreign: z
        .string()
        .optional()
        .describe("The date and time when the order was processed in ISO 8601 format."),
      cancelled_at_foreign: z
        .string()
        .optional()
        .describe("The date and time when the order was cancelled in ISO 8601 format."),
      updated_at_foreign: z
        .string()
        .optional()
        .describe("The date and time when the order was updated in ISO 8601 format."),
      shipping_address: z
        .record(z.string(), z.unknown())
        .optional()
        .describe("The shipping address for the order."),
      billing_address: z
        .record(z.string(), z.unknown())
        .optional()
        .describe("The billing address for the order."),
      lines: z
        .array(z.record(z.string(), z.unknown()))
        .optional()
        .describe("An array of order line items."),
      outreach: z
        .record(z.string(), z.unknown())
        .optional()
        .describe("The outreach associated with this order."),
      promos: z
        .array(z.record(z.string(), z.unknown()))
        .optional()
        .describe("An array of promotional discounts."),
    }),
    handler: async (args: {
      store_id: string;
      order_id: string;
      [key: string]: unknown;
    }) => {
      const { store_id, order_id, ...body } = args;
      return mailchimpRequest(
        "PATCH",
        `/ecommerce/stores/${store_id}/orders/${order_id}`,
        body
      );
    },
  },
  {
    name: "mailchimp_upsert_store_order",
    description:
      "Add or update an order in a store. If the order exists, it will be updated; otherwise, it will be created.",
    inputSchema: z.object({
      store_id: z.string().describe("The unique identifier for the store."),
      order_id: z
        .string()
        .describe("The unique identifier for the order."),
      id: z.string().describe("A unique identifier for the order."),
      customer: z
        .object({
          id: z.string().describe("A unique identifier for the customer."),
          email_address: z
            .string()
            .optional()
            .describe("The customer's email address."),
          opt_in_status: z
            .boolean()
            .optional()
            .describe("The customer's opt-in status."),
        })
        .describe("Information about the customer for this order."),
      currency_code: z
        .string()
        .describe("The three-letter ISO 4217 currency code."),
      order_total: z.number().describe("The total for the order."),
      lines: z
        .array(z.record(z.string(), z.unknown()))
        .describe("An array of order line items."),
      campaign_id: z.string().optional().describe("The campaign ID."),
      financial_status: z
        .string()
        .optional()
        .describe("The financial status of the order."),
      fulfillment_status: z
        .string()
        .optional()
        .describe("The fulfillment status of the order."),
      order_url: z.string().optional().describe("The URL for the order."),
      discount_total: z.number().optional().describe("The total discounts."),
      tax_total: z.number().optional().describe("The tax total."),
      shipping_total: z.number().optional().describe("The shipping total."),
      tracking_code: z.string().optional().describe("The tracking code."),
      processed_at_foreign: z.string().optional().describe("Processed date in ISO 8601 format."),
      cancelled_at_foreign: z.string().optional().describe("Cancelled date in ISO 8601 format."),
      updated_at_foreign: z.string().optional().describe("Updated date in ISO 8601 format."),
      shipping_address: z.record(z.string(), z.unknown()).optional().describe("The shipping address."),
      billing_address: z.record(z.string(), z.unknown()).optional().describe("The billing address."),
      outreach: z.record(z.string(), z.unknown()).optional().describe("The outreach info."),
      promos: z.array(z.record(z.string(), z.unknown())).optional().describe("Promotional discounts."),
    }),
    handler: async (args: {
      store_id: string;
      order_id: string;
      [key: string]: unknown;
    }) => {
      const { store_id, order_id, ...body } = args;
      return mailchimpRequest(
        "PUT",
        `/ecommerce/stores/${store_id}/orders/${order_id}`,
        body
      );
    },
  },

  // ============================================================
  // Order Lines
  // ============================================================
  {
    name: "mailchimp_list_order_lines",
    description: "List all lines for a specific order in a store.",
    inputSchema: z.object({
      store_id: z.string().describe("The unique identifier for the store."),
      order_id: z.string().describe("The unique identifier for the order."),
      ...paginationParams,
    }),
    handler: async (
      args: { store_id: string; order_id: string } & PaginationArgs
    ) => {
      const { store_id, order_id, ...params } = args;
      return mailchimpRequest(
        "GET",
        `/ecommerce/stores/${store_id}/orders/${order_id}/lines`,
        undefined,
        params
      );
    },
  },
  {
    name: "mailchimp_create_order_line",
    description: "Add a new line item to an order.",
    inputSchema: z.object({
      store_id: z.string().describe("The unique identifier for the store."),
      order_id: z.string().describe("The unique identifier for the order."),
      id: z.string().describe("A unique identifier for the order line item."),
      product_id: z.string().describe("A unique identifier for the product."),
      product_variant_id: z
        .string()
        .describe("A unique identifier for the product variant."),
      quantity: z.number().describe("The quantity of the order line item."),
      price: z.number().describe("The price of an order line item."),
      discount: z
        .number()
        .optional()
        .describe("The total discount amount applied to this line item."),
    }),
    handler: async (args: {
      store_id: string;
      order_id: string;
      id: string;
      product_id: string;
      product_variant_id: string;
      quantity: number;
      price: number;
      discount?: number;
    }) => {
      const { store_id, order_id, ...body } = args;
      return mailchimpRequest(
        "POST",
        `/ecommerce/stores/${store_id}/orders/${order_id}/lines`,
        body
      );
    },
  },
  {
    name: "mailchimp_delete_order_line",
    description: "Delete a specific order line item.",
    inputSchema: z.object({
      store_id: z.string().describe("The unique identifier for the store."),
      order_id: z.string().describe("The unique identifier for the order."),
      line_id: z
        .string()
        .describe("The unique identifier for the order line item."),
    }),
    handler: async (args: {
      store_id: string;
      order_id: string;
      line_id: string;
    }) => {
      return mailchimpRequest(
        "DELETE",
        `/ecommerce/stores/${args.store_id}/orders/${args.order_id}/lines/${args.line_id}`
      );
    },
  },
  {
    name: "mailchimp_get_order_line",
    description: "Get information about a specific order line item.",
    inputSchema: z.object({
      store_id: z.string().describe("The unique identifier for the store."),
      order_id: z.string().describe("The unique identifier for the order."),
      line_id: z
        .string()
        .describe("The unique identifier for the order line item."),
      ...fieldsParams,
    }),
    handler: async (
      args: {
        store_id: string;
        order_id: string;
        line_id: string;
      } & FieldsArgs
    ) => {
      const { store_id, order_id, line_id, ...params } = args;
      return mailchimpRequest(
        "GET",
        `/ecommerce/stores/${store_id}/orders/${order_id}/lines/${line_id}`,
        undefined,
        params
      );
    },
  },
  {
    name: "mailchimp_update_order_line",
    description: "Update a specific order line item.",
    inputSchema: z.object({
      store_id: z.string().describe("The unique identifier for the store."),
      order_id: z.string().describe("The unique identifier for the order."),
      line_id: z
        .string()
        .describe("The unique identifier for the order line item."),
      product_id: z
        .string()
        .optional()
        .describe("A unique identifier for the product."),
      product_variant_id: z
        .string()
        .optional()
        .describe("A unique identifier for the product variant."),
      quantity: z.number().optional().describe("The quantity."),
      price: z.number().optional().describe("The price."),
      discount: z
        .number()
        .optional()
        .describe("The total discount amount applied to this line item."),
    }),
    handler: async (args: {
      store_id: string;
      order_id: string;
      line_id: string;
      product_id?: string;
      product_variant_id?: string;
      quantity?: number;
      price?: number;
      discount?: number;
    }) => {
      const { store_id, order_id, line_id, ...body } = args;
      return mailchimpRequest(
        "PATCH",
        `/ecommerce/stores/${store_id}/orders/${order_id}/lines/${line_id}`,
        body
      );
    },
  },

  // ============================================================
  // Products
  // ============================================================
  {
    name: "mailchimp_list_store_products",
    description: "List all products for a specific e-commerce store.",
    inputSchema: z.object({
      store_id: z.string().describe("The unique identifier for the store."),
      ...paginationParams,
    }),
    handler: async (args: { store_id: string } & PaginationArgs) => {
      const { store_id, ...params } = args;
      return mailchimpRequest(
        "GET",
        `/ecommerce/stores/${store_id}/products`,
        undefined,
        params
      );
    },
  },
  {
    name: "mailchimp_create_store_product",
    description: "Add a new product to a store.",
    inputSchema: z.object({
      store_id: z.string().describe("The unique identifier for the store."),
      id: z.string().describe("A unique identifier for the product."),
      title: z.string().describe("The title of the product."),
      variants: z
        .array(z.record(z.string(), z.unknown()))
        .describe(
          "An array of product variants. Each should have at least id and title."
        ),
      handle: z
        .string()
        .optional()
        .describe("The handle of the product."),
      url: z.string().optional().describe("The URL for the product."),
      description: z
        .string()
        .optional()
        .describe("The description of the product."),
      type: z.string().optional().describe("The type of the product."),
      vendor: z.string().optional().describe("The vendor of the product."),
      image_url: z
        .string()
        .optional()
        .describe("The image URL for the product."),
      published_at_foreign: z
        .string()
        .optional()
        .describe("The date and time the product was published in ISO 8601 format."),
    }),
    handler: async (args: {
      store_id: string;
      id: string;
      title: string;
      variants: Record<string, unknown>[];
      handle?: string;
      url?: string;
      description?: string;
      type?: string;
      vendor?: string;
      image_url?: string;
      published_at_foreign?: string;
    }) => {
      const { store_id, ...body } = args;
      return mailchimpRequest(
        "POST",
        `/ecommerce/stores/${store_id}/products`,
        body
      );
    },
  },
  {
    name: "mailchimp_delete_store_product",
    description:
      "Delete a product from a store. This will also delete all variants for the product.",
    inputSchema: z.object({
      store_id: z.string().describe("The unique identifier for the store."),
      product_id: z
        .string()
        .describe("The unique identifier for the product."),
    }),
    handler: async (args: { store_id: string; product_id: string }) => {
      return mailchimpRequest(
        "DELETE",
        `/ecommerce/stores/${args.store_id}/products/${args.product_id}`
      );
    },
  },
  {
    name: "mailchimp_get_store_product",
    description: "Get information about a specific product in a store.",
    inputSchema: z.object({
      store_id: z.string().describe("The unique identifier for the store."),
      product_id: z
        .string()
        .describe("The unique identifier for the product."),
      ...fieldsParams,
    }),
    handler: async (
      args: { store_id: string; product_id: string } & FieldsArgs
    ) => {
      const { store_id, product_id, ...params } = args;
      return mailchimpRequest(
        "GET",
        `/ecommerce/stores/${store_id}/products/${product_id}`,
        undefined,
        params
      );
    },
  },
  {
    name: "mailchimp_update_store_product",
    description: "Update a specific product in a store.",
    inputSchema: z.object({
      store_id: z.string().describe("The unique identifier for the store."),
      product_id: z
        .string()
        .describe("The unique identifier for the product."),
      title: z.string().optional().describe("The title of the product."),
      handle: z.string().optional().describe("The handle of the product."),
      url: z.string().optional().describe("The URL for the product."),
      description: z
        .string()
        .optional()
        .describe("The description of the product."),
      type: z.string().optional().describe("The type of the product."),
      vendor: z.string().optional().describe("The vendor of the product."),
      image_url: z
        .string()
        .optional()
        .describe("The image URL for the product."),
      variants: z
        .array(z.record(z.string(), z.unknown()))
        .optional()
        .describe("An array of product variants."),
      published_at_foreign: z
        .string()
        .optional()
        .describe("Published date in ISO 8601 format."),
    }),
    handler: async (args: {
      store_id: string;
      product_id: string;
      [key: string]: unknown;
    }) => {
      const { store_id, product_id, ...body } = args;
      return mailchimpRequest(
        "PATCH",
        `/ecommerce/stores/${store_id}/products/${product_id}`,
        body
      );
    },
  },
  {
    name: "mailchimp_upsert_store_product",
    description:
      "Add or update a product in a store. If the product exists, it will be updated; otherwise, it will be created.",
    inputSchema: z.object({
      store_id: z.string().describe("The unique identifier for the store."),
      product_id: z
        .string()
        .describe("The unique identifier for the product."),
      id: z.string().describe("A unique identifier for the product."),
      title: z.string().describe("The title of the product."),
      variants: z
        .array(z.record(z.string(), z.unknown()))
        .describe("An array of product variants."),
      handle: z.string().optional().describe("The handle of the product."),
      url: z.string().optional().describe("The URL for the product."),
      description: z.string().optional().describe("The description of the product."),
      type: z.string().optional().describe("The type of the product."),
      vendor: z.string().optional().describe("The vendor of the product."),
      image_url: z.string().optional().describe("The image URL for the product."),
      published_at_foreign: z.string().optional().describe("Published date in ISO 8601 format."),
    }),
    handler: async (args: {
      store_id: string;
      product_id: string;
      [key: string]: unknown;
    }) => {
      const { store_id, product_id, ...body } = args;
      return mailchimpRequest(
        "PUT",
        `/ecommerce/stores/${store_id}/products/${product_id}`,
        body
      );
    },
  },

  // ============================================================
  // Product Images
  // ============================================================
  {
    name: "mailchimp_list_product_images",
    description: "List all images for a specific product in a store.",
    inputSchema: z.object({
      store_id: z.string().describe("The unique identifier for the store."),
      product_id: z
        .string()
        .describe("The unique identifier for the product."),
      ...paginationParams,
    }),
    handler: async (
      args: { store_id: string; product_id: string } & PaginationArgs
    ) => {
      const { store_id, product_id, ...params } = args;
      return mailchimpRequest(
        "GET",
        `/ecommerce/stores/${store_id}/products/${product_id}/images`,
        undefined,
        params
      );
    },
  },
  {
    name: "mailchimp_create_product_image",
    description: "Add a new image to a product.",
    inputSchema: z.object({
      store_id: z.string().describe("The unique identifier for the store."),
      product_id: z
        .string()
        .describe("The unique identifier for the product."),
      id: z.string().describe("A unique identifier for the product image."),
      url: z.string().describe("The URL for the product image."),
      variant_ids: z
        .array(z.string())
        .optional()
        .describe("An array of variant IDs associated with this image."),
    }),
    handler: async (args: {
      store_id: string;
      product_id: string;
      id: string;
      url: string;
      variant_ids?: string[];
    }) => {
      const { store_id, product_id, ...body } = args;
      return mailchimpRequest(
        "POST",
        `/ecommerce/stores/${store_id}/products/${product_id}/images`,
        body
      );
    },
  },
  {
    name: "mailchimp_delete_product_image",
    description: "Delete a product image.",
    inputSchema: z.object({
      store_id: z.string().describe("The unique identifier for the store."),
      product_id: z
        .string()
        .describe("The unique identifier for the product."),
      image_id: z
        .string()
        .describe("The unique identifier for the product image."),
    }),
    handler: async (args: {
      store_id: string;
      product_id: string;
      image_id: string;
    }) => {
      return mailchimpRequest(
        "DELETE",
        `/ecommerce/stores/${args.store_id}/products/${args.product_id}/images/${args.image_id}`
      );
    },
  },
  {
    name: "mailchimp_get_product_image",
    description: "Get information about a specific product image.",
    inputSchema: z.object({
      store_id: z.string().describe("The unique identifier for the store."),
      product_id: z
        .string()
        .describe("The unique identifier for the product."),
      image_id: z
        .string()
        .describe("The unique identifier for the product image."),
      ...fieldsParams,
    }),
    handler: async (
      args: {
        store_id: string;
        product_id: string;
        image_id: string;
      } & FieldsArgs
    ) => {
      const { store_id, product_id, image_id, ...params } = args;
      return mailchimpRequest(
        "GET",
        `/ecommerce/stores/${store_id}/products/${product_id}/images/${image_id}`,
        undefined,
        params
      );
    },
  },
  {
    name: "mailchimp_update_product_image",
    description: "Update a product image.",
    inputSchema: z.object({
      store_id: z.string().describe("The unique identifier for the store."),
      product_id: z
        .string()
        .describe("The unique identifier for the product."),
      image_id: z
        .string()
        .describe("The unique identifier for the product image."),
      id: z
        .string()
        .optional()
        .describe("A unique identifier for the product image."),
      url: z.string().optional().describe("The URL for the product image."),
      variant_ids: z
        .array(z.string())
        .optional()
        .describe("An array of variant IDs associated with this image."),
    }),
    handler: async (args: {
      store_id: string;
      product_id: string;
      image_id: string;
      id?: string;
      url?: string;
      variant_ids?: string[];
    }) => {
      const { store_id, product_id, image_id, ...body } = args;
      return mailchimpRequest(
        "PATCH",
        `/ecommerce/stores/${store_id}/products/${product_id}/images/${image_id}`,
        body
      );
    },
  },

  // ============================================================
  // Product Variants
  // ============================================================
  {
    name: "mailchimp_list_product_variants",
    description: "List all variants for a specific product in a store.",
    inputSchema: z.object({
      store_id: z.string().describe("The unique identifier for the store."),
      product_id: z
        .string()
        .describe("The unique identifier for the product."),
      ...paginationParams,
    }),
    handler: async (
      args: { store_id: string; product_id: string } & PaginationArgs
    ) => {
      const { store_id, product_id, ...params } = args;
      return mailchimpRequest(
        "GET",
        `/ecommerce/stores/${store_id}/products/${product_id}/variants`,
        undefined,
        params
      );
    },
  },
  {
    name: "mailchimp_create_product_variant",
    description: "Add a new variant to a product.",
    inputSchema: z.object({
      store_id: z.string().describe("The unique identifier for the store."),
      product_id: z
        .string()
        .describe("The unique identifier for the product."),
      id: z.string().describe("A unique identifier for the product variant."),
      title: z.string().describe("The title of the product variant."),
      url: z.string().optional().describe("The URL for the product variant."),
      sku: z.string().optional().describe("The SKU of the product variant."),
      price: z
        .number()
        .optional()
        .describe("The price of the product variant."),
      inventory_quantity: z
        .number()
        .optional()
        .describe("The inventory quantity of the product variant."),
      image_url: z
        .string()
        .optional()
        .describe("The image URL for the product variant."),
      backorders: z
        .string()
        .optional()
        .describe("The backorder status for the product variant."),
      visibility: z
        .string()
        .optional()
        .describe("The visibility of the product variant."),
    }),
    handler: async (args: {
      store_id: string;
      product_id: string;
      id: string;
      title: string;
      url?: string;
      sku?: string;
      price?: number;
      inventory_quantity?: number;
      image_url?: string;
      backorders?: string;
      visibility?: string;
    }) => {
      const { store_id, product_id, ...body } = args;
      return mailchimpRequest(
        "POST",
        `/ecommerce/stores/${store_id}/products/${product_id}/variants`,
        body
      );
    },
  },
  {
    name: "mailchimp_delete_product_variant",
    description: "Delete a product variant.",
    inputSchema: z.object({
      store_id: z.string().describe("The unique identifier for the store."),
      product_id: z
        .string()
        .describe("The unique identifier for the product."),
      variant_id: z
        .string()
        .describe("The unique identifier for the product variant."),
    }),
    handler: async (args: {
      store_id: string;
      product_id: string;
      variant_id: string;
    }) => {
      return mailchimpRequest(
        "DELETE",
        `/ecommerce/stores/${args.store_id}/products/${args.product_id}/variants/${args.variant_id}`
      );
    },
  },
  {
    name: "mailchimp_get_product_variant",
    description: "Get information about a specific product variant.",
    inputSchema: z.object({
      store_id: z.string().describe("The unique identifier for the store."),
      product_id: z
        .string()
        .describe("The unique identifier for the product."),
      variant_id: z
        .string()
        .describe("The unique identifier for the product variant."),
      ...fieldsParams,
    }),
    handler: async (
      args: {
        store_id: string;
        product_id: string;
        variant_id: string;
      } & FieldsArgs
    ) => {
      const { store_id, product_id, variant_id, ...params } = args;
      return mailchimpRequest(
        "GET",
        `/ecommerce/stores/${store_id}/products/${product_id}/variants/${variant_id}`,
        undefined,
        params
      );
    },
  },
  {
    name: "mailchimp_update_product_variant",
    description: "Update a product variant.",
    inputSchema: z.object({
      store_id: z.string().describe("The unique identifier for the store."),
      product_id: z
        .string()
        .describe("The unique identifier for the product."),
      variant_id: z
        .string()
        .describe("The unique identifier for the product variant."),
      title: z
        .string()
        .optional()
        .describe("The title of the product variant."),
      url: z.string().optional().describe("The URL for the product variant."),
      sku: z.string().optional().describe("The SKU of the product variant."),
      price: z
        .number()
        .optional()
        .describe("The price of the product variant."),
      inventory_quantity: z
        .number()
        .optional()
        .describe("The inventory quantity."),
      image_url: z
        .string()
        .optional()
        .describe("The image URL for the product variant."),
      backorders: z
        .string()
        .optional()
        .describe("The backorder status."),
      visibility: z
        .string()
        .optional()
        .describe("The visibility of the product variant."),
    }),
    handler: async (args: {
      store_id: string;
      product_id: string;
      variant_id: string;
      title?: string;
      url?: string;
      sku?: string;
      price?: number;
      inventory_quantity?: number;
      image_url?: string;
      backorders?: string;
      visibility?: string;
    }) => {
      const { store_id, product_id, variant_id, ...body } = args;
      return mailchimpRequest(
        "PATCH",
        `/ecommerce/stores/${store_id}/products/${product_id}/variants/${variant_id}`,
        body
      );
    },
  },
  {
    name: "mailchimp_upsert_product_variant",
    description:
      "Add or update a product variant. If the variant exists, it will be updated; otherwise, it will be created.",
    inputSchema: z.object({
      store_id: z.string().describe("The unique identifier for the store."),
      product_id: z
        .string()
        .describe("The unique identifier for the product."),
      variant_id: z
        .string()
        .describe("The unique identifier for the product variant."),
      id: z.string().describe("A unique identifier for the product variant."),
      title: z.string().describe("The title of the product variant."),
      url: z.string().optional().describe("The URL for the product variant."),
      sku: z.string().optional().describe("The SKU of the product variant."),
      price: z.number().optional().describe("The price of the product variant."),
      inventory_quantity: z.number().optional().describe("The inventory quantity."),
      image_url: z.string().optional().describe("The image URL for the product variant."),
      backorders: z.string().optional().describe("The backorder status."),
      visibility: z.string().optional().describe("The visibility of the product variant."),
    }),
    handler: async (args: {
      store_id: string;
      product_id: string;
      variant_id: string;
      [key: string]: unknown;
    }) => {
      const { store_id, product_id, variant_id, ...body } = args;
      return mailchimpRequest(
        "PUT",
        `/ecommerce/stores/${store_id}/products/${product_id}/variants/${variant_id}`,
        body
      );
    },
  },

  // ============================================================
  // Promo Rules
  // ============================================================
  {
    name: "mailchimp_list_promo_rules",
    description: "List all promo rules for a specific e-commerce store.",
    inputSchema: z.object({
      store_id: z.string().describe("The unique identifier for the store."),
      ...paginationParams,
    }),
    handler: async (args: { store_id: string } & PaginationArgs) => {
      const { store_id, ...params } = args;
      return mailchimpRequest(
        "GET",
        `/ecommerce/stores/${store_id}/promo-rules`,
        undefined,
        params
      );
    },
  },
  {
    name: "mailchimp_create_promo_rule",
    description: "Create a new promo rule for a store.",
    inputSchema: z.object({
      store_id: z.string().describe("The unique identifier for the store."),
      id: z.string().describe("A unique identifier for the promo rule."),
      title: z.string().describe("The title of the promo rule."),
      description: z
        .string()
        .describe("The description of the promo rule."),
      amount: z
        .number()
        .describe("The amount of the promo (percentage or fixed amount)."),
      type: z
        .enum(["fixed", "percentage"])
        .describe("The type of discount: fixed or percentage."),
      target: z
        .enum(["per_item", "total", "shipping"])
        .describe("The target of the promo: per_item, total, or shipping."),
      starts_at: z
        .string()
        .optional()
        .describe("The date and time when the promo starts in ISO 8601 format."),
      ends_at: z
        .string()
        .optional()
        .describe("The date and time when the promo ends in ISO 8601 format."),
      enabled: z
        .boolean()
        .optional()
        .describe("Whether the promo rule is currently enabled."),
      created_at_foreign: z
        .string()
        .optional()
        .describe("The creation date in ISO 8601 format from the external platform."),
      updated_at_foreign: z
        .string()
        .optional()
        .describe("The update date in ISO 8601 format from the external platform."),
    }),
    handler: async (args: {
      store_id: string;
      id: string;
      title: string;
      description: string;
      amount: number;
      type: "fixed" | "percentage";
      target: "per_item" | "total" | "shipping";
      starts_at?: string;
      ends_at?: string;
      enabled?: boolean;
      created_at_foreign?: string;
      updated_at_foreign?: string;
    }) => {
      const { store_id, ...body } = args;
      return mailchimpRequest(
        "POST",
        `/ecommerce/stores/${store_id}/promo-rules`,
        body
      );
    },
  },
  {
    name: "mailchimp_delete_promo_rule",
    description: "Delete a promo rule from a store.",
    inputSchema: z.object({
      store_id: z.string().describe("The unique identifier for the store."),
      promo_rule_id: z
        .string()
        .describe("The unique identifier for the promo rule."),
    }),
    handler: async (args: { store_id: string; promo_rule_id: string }) => {
      return mailchimpRequest(
        "DELETE",
        `/ecommerce/stores/${args.store_id}/promo-rules/${args.promo_rule_id}`
      );
    },
  },
  {
    name: "mailchimp_get_promo_rule",
    description: "Get information about a specific promo rule.",
    inputSchema: z.object({
      store_id: z.string().describe("The unique identifier for the store."),
      promo_rule_id: z
        .string()
        .describe("The unique identifier for the promo rule."),
      ...fieldsParams,
    }),
    handler: async (
      args: { store_id: string; promo_rule_id: string } & FieldsArgs
    ) => {
      const { store_id, promo_rule_id, ...params } = args;
      return mailchimpRequest(
        "GET",
        `/ecommerce/stores/${store_id}/promo-rules/${promo_rule_id}`,
        undefined,
        params
      );
    },
  },
  {
    name: "mailchimp_update_promo_rule",
    description: "Update a promo rule for a store.",
    inputSchema: z.object({
      store_id: z.string().describe("The unique identifier for the store."),
      promo_rule_id: z
        .string()
        .describe("The unique identifier for the promo rule."),
      title: z.string().optional().describe("The title of the promo rule."),
      description: z
        .string()
        .optional()
        .describe("The description of the promo rule."),
      starts_at: z
        .string()
        .optional()
        .describe("The start date in ISO 8601 format."),
      ends_at: z
        .string()
        .optional()
        .describe("The end date in ISO 8601 format."),
      amount: z.number().optional().describe("The discount amount."),
      type: z
        .enum(["fixed", "percentage"])
        .optional()
        .describe("The type of discount: fixed or percentage."),
      target: z
        .enum(["per_item", "total", "shipping"])
        .optional()
        .describe("The target: per_item, total, or shipping."),
      enabled: z
        .boolean()
        .optional()
        .describe("Whether the promo rule is currently enabled."),
    }),
    handler: async (args: {
      store_id: string;
      promo_rule_id: string;
      title?: string;
      description?: string;
      starts_at?: string;
      ends_at?: string;
      amount?: number;
      type?: "fixed" | "percentage";
      target?: "per_item" | "total" | "shipping";
      enabled?: boolean;
    }) => {
      const { store_id, promo_rule_id, ...body } = args;
      return mailchimpRequest(
        "PATCH",
        `/ecommerce/stores/${store_id}/promo-rules/${promo_rule_id}`,
        body
      );
    },
  },

  // ============================================================
  // Promo Codes
  // ============================================================
  {
    name: "mailchimp_list_promo_codes",
    description: "List all promo codes for a specific promo rule in a store.",
    inputSchema: z.object({
      store_id: z.string().describe("The unique identifier for the store."),
      promo_rule_id: z
        .string()
        .describe("The unique identifier for the promo rule."),
      ...paginationParams,
    }),
    handler: async (
      args: { store_id: string; promo_rule_id: string } & PaginationArgs
    ) => {
      const { store_id, promo_rule_id, ...params } = args;
      return mailchimpRequest(
        "GET",
        `/ecommerce/stores/${store_id}/promo-rules/${promo_rule_id}/promo-codes`,
        undefined,
        params
      );
    },
  },
  {
    name: "mailchimp_create_promo_code",
    description: "Create a new promo code for a promo rule.",
    inputSchema: z.object({
      store_id: z.string().describe("The unique identifier for the store."),
      promo_rule_id: z
        .string()
        .describe("The unique identifier for the promo rule."),
      id: z.string().describe("A unique identifier for the promo code."),
      code: z.string().describe("The discount code (e.g. SAVE20)."),
      redemption_url: z
        .string()
        .describe("The URL that can be used to apply the promo code."),
      usage_count: z
        .number()
        .optional()
        .describe("The number of times the promo code has been used."),
      enabled: z
        .boolean()
        .optional()
        .describe("Whether the promo code is currently enabled."),
      created_at_foreign: z
        .string()
        .optional()
        .describe("The creation date in ISO 8601 format from the external platform."),
      updated_at_foreign: z
        .string()
        .optional()
        .describe("The update date in ISO 8601 format from the external platform."),
    }),
    handler: async (args: {
      store_id: string;
      promo_rule_id: string;
      id: string;
      code: string;
      redemption_url: string;
      usage_count?: number;
      enabled?: boolean;
      created_at_foreign?: string;
      updated_at_foreign?: string;
    }) => {
      const { store_id, promo_rule_id, ...body } = args;
      return mailchimpRequest(
        "POST",
        `/ecommerce/stores/${store_id}/promo-rules/${promo_rule_id}/promo-codes`,
        body
      );
    },
  },
  {
    name: "mailchimp_delete_promo_code",
    description: "Delete a promo code.",
    inputSchema: z.object({
      store_id: z.string().describe("The unique identifier for the store."),
      promo_rule_id: z
        .string()
        .describe("The unique identifier for the promo rule."),
      promo_code_id: z
        .string()
        .describe("The unique identifier for the promo code."),
    }),
    handler: async (args: {
      store_id: string;
      promo_rule_id: string;
      promo_code_id: string;
    }) => {
      return mailchimpRequest(
        "DELETE",
        `/ecommerce/stores/${args.store_id}/promo-rules/${args.promo_rule_id}/promo-codes/${args.promo_code_id}`
      );
    },
  },
  {
    name: "mailchimp_get_promo_code",
    description: "Get information about a specific promo code.",
    inputSchema: z.object({
      store_id: z.string().describe("The unique identifier for the store."),
      promo_rule_id: z
        .string()
        .describe("The unique identifier for the promo rule."),
      promo_code_id: z
        .string()
        .describe("The unique identifier for the promo code."),
      ...fieldsParams,
    }),
    handler: async (
      args: {
        store_id: string;
        promo_rule_id: string;
        promo_code_id: string;
      } & FieldsArgs
    ) => {
      const { store_id, promo_rule_id, promo_code_id, ...params } = args;
      return mailchimpRequest(
        "GET",
        `/ecommerce/stores/${store_id}/promo-rules/${promo_rule_id}/promo-codes/${promo_code_id}`,
        undefined,
        params
      );
    },
  },
  {
    name: "mailchimp_update_promo_code",
    description: "Update a promo code.",
    inputSchema: z.object({
      store_id: z.string().describe("The unique identifier for the store."),
      promo_rule_id: z
        .string()
        .describe("The unique identifier for the promo rule."),
      promo_code_id: z
        .string()
        .describe("The unique identifier for the promo code."),
      code: z
        .string()
        .optional()
        .describe("The discount code."),
      redemption_url: z
        .string()
        .optional()
        .describe("The URL that can be used to apply the promo code."),
      usage_count: z
        .number()
        .optional()
        .describe("The number of times the promo code has been used."),
      enabled: z
        .boolean()
        .optional()
        .describe("Whether the promo code is currently enabled."),
    }),
    handler: async (args: {
      store_id: string;
      promo_rule_id: string;
      promo_code_id: string;
      code?: string;
      redemption_url?: string;
      usage_count?: number;
      enabled?: boolean;
    }) => {
      const { store_id, promo_rule_id, promo_code_id, ...body } = args;
      return mailchimpRequest(
        "PATCH",
        `/ecommerce/stores/${store_id}/promo-rules/${promo_rule_id}/promo-codes/${promo_code_id}`,
        body
      );
    },
  },
];
