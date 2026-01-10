/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { INodeProperties } from 'n8n-workflow';

export const eventOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['event'],
      },
    },
    options: [
      {
        name: 'Get Types',
        value: 'getTypes',
        description: 'List available event types',
        action: 'Get event types',
      },
      {
        name: 'Track',
        value: 'track',
        description: 'Send a custom event',
        action: 'Track event',
      },
      {
        name: 'Track E-commerce',
        value: 'trackEcommerce',
        description: 'Send a purchase or cart event',
        action: 'Track e-commerce event',
      },
    ],
    default: 'track',
  },
];

export const eventFields: INodeProperties[] = [
  // ----------------------------------
  //         event: track
  // ----------------------------------
  {
    displayName: 'Identifier Type',
    name: 'identifierType',
    type: 'options',
    displayOptions: {
      show: {
        resource: ['event'],
        operation: ['track', 'trackEcommerce'],
      },
    },
    options: [
      { name: 'Phone Number', value: 'phone_number' },
      { name: 'Subscriber ID', value: 'subscriber_id' },
    ],
    default: 'subscriber_id',
    description: 'How to identify the subscriber',
  },
  {
    displayName: 'Subscriber ID',
    name: 'subscriberId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['event'],
        operation: ['track', 'trackEcommerce'],
        identifierType: ['subscriber_id'],
      },
    },
    default: '',
    description: 'The ID of the subscriber',
  },
  {
    displayName: 'Phone Number',
    name: 'phoneNumber',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['event'],
        operation: ['track', 'trackEcommerce'],
        identifierType: ['phone_number'],
      },
    },
    default: '',
    placeholder: '+15551234567',
    description: 'Phone number in E.164 format (+1XXXXXXXXXX)',
  },
  {
    displayName: 'Event Type',
    name: 'eventType',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['event'],
        operation: ['track'],
      },
    },
    default: '',
    placeholder: 'viewed_product',
    description: 'Name of the custom event',
  },
  {
    displayName: 'Properties',
    name: 'properties',
    type: 'json',
    displayOptions: {
      show: {
        resource: ['event'],
        operation: ['track'],
      },
    },
    default: '{}',
    description: 'Event data as JSON object',
  },
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    displayOptions: {
      show: {
        resource: ['event'],
        operation: ['track'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Occurred At',
        name: 'occurred_at',
        type: 'dateTime',
        default: '',
        description: 'When the event occurred (defaults to now)',
      },
    ],
  },

  // ----------------------------------
  //         event: trackEcommerce
  // ----------------------------------
  {
    displayName: 'E-commerce Event Type',
    name: 'ecommerceEventType',
    type: 'options',
    required: true,
    displayOptions: {
      show: {
        resource: ['event'],
        operation: ['trackEcommerce'],
      },
    },
    options: [
      { name: 'Added to Cart', value: 'added_to_cart' },
      { name: 'Browse Abandonment', value: 'browse_abandonment' },
      { name: 'Cart Abandonment', value: 'cart_abandonment' },
      { name: 'Checkout Started', value: 'checkout_started' },
      { name: 'Order Completed', value: 'order_completed' },
      { name: 'Product Viewed', value: 'product_viewed' },
    ],
    default: 'order_completed',
    description: 'Type of e-commerce event',
  },

  // ----------------------------------
  //         event: trackEcommerce - Order fields
  // ----------------------------------
  {
    displayName: 'Order ID',
    name: 'orderId',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['event'],
        operation: ['trackEcommerce'],
        ecommerceEventType: ['order_completed'],
      },
    },
    default: '',
    description: 'Unique order identifier',
  },
  {
    displayName: 'Order Total',
    name: 'orderTotal',
    type: 'number',
    typeOptions: {
      numberPrecision: 2,
    },
    displayOptions: {
      show: {
        resource: ['event'],
        operation: ['trackEcommerce'],
        ecommerceEventType: ['order_completed'],
      },
    },
    default: 0,
    description: 'Total order amount',
  },
  {
    displayName: 'Currency',
    name: 'currency',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['event'],
        operation: ['trackEcommerce'],
        ecommerceEventType: ['order_completed'],
      },
    },
    default: 'USD',
    description: 'Currency code (e.g., USD, EUR)',
  },

  // ----------------------------------
  //         event: trackEcommerce - Product fields
  // ----------------------------------
  {
    displayName: 'Product ID',
    name: 'productId',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['event'],
        operation: ['trackEcommerce'],
        ecommerceEventType: ['product_viewed', 'added_to_cart', 'browse_abandonment'],
      },
    },
    default: '',
    description: 'Product identifier',
  },
  {
    displayName: 'Product Name',
    name: 'productName',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['event'],
        operation: ['trackEcommerce'],
        ecommerceEventType: ['product_viewed', 'added_to_cart', 'browse_abandonment'],
      },
    },
    default: '',
    description: 'Name of the product',
  },
  {
    displayName: 'Product Price',
    name: 'productPrice',
    type: 'number',
    typeOptions: {
      numberPrecision: 2,
    },
    displayOptions: {
      show: {
        resource: ['event'],
        operation: ['trackEcommerce'],
        ecommerceEventType: ['product_viewed', 'added_to_cart', 'browse_abandonment'],
      },
    },
    default: 0,
    description: 'Price of the product',
  },
  {
    displayName: 'Product URL',
    name: 'productUrl',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['event'],
        operation: ['trackEcommerce'],
        ecommerceEventType: ['product_viewed', 'added_to_cart', 'browse_abandonment'],
      },
    },
    default: '',
    description: 'URL to the product page',
  },
  {
    displayName: 'Product Image URL',
    name: 'productImageUrl',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['event'],
        operation: ['trackEcommerce'],
        ecommerceEventType: ['product_viewed', 'added_to_cart', 'browse_abandonment'],
      },
    },
    default: '',
    description: 'URL to the product image',
  },

  // ----------------------------------
  //         event: trackEcommerce - Cart fields
  // ----------------------------------
  {
    displayName: 'Cart ID',
    name: 'cartId',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['event'],
        operation: ['trackEcommerce'],
        ecommerceEventType: ['cart_abandonment', 'checkout_started'],
      },
    },
    default: '',
    description: 'Cart identifier',
  },
  {
    displayName: 'Cart Total',
    name: 'cartTotal',
    type: 'number',
    typeOptions: {
      numberPrecision: 2,
    },
    displayOptions: {
      show: {
        resource: ['event'],
        operation: ['trackEcommerce'],
        ecommerceEventType: ['cart_abandonment', 'checkout_started'],
      },
    },
    default: 0,
    description: 'Total cart value',
  },
  {
    displayName: 'Cart URL',
    name: 'cartUrl',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['event'],
        operation: ['trackEcommerce'],
        ecommerceEventType: ['cart_abandonment', 'checkout_started'],
      },
    },
    default: '',
    description: 'URL to recover the cart',
  },

  // ----------------------------------
  //         event: trackEcommerce - Additional options
  // ----------------------------------
  {
    displayName: 'Additional Properties',
    name: 'additionalProperties',
    type: 'json',
    displayOptions: {
      show: {
        resource: ['event'],
        operation: ['trackEcommerce'],
      },
    },
    default: '{}',
    description: 'Additional event properties as JSON',
  },
];
