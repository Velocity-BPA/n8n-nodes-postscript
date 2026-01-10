/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { INodeProperties } from 'n8n-workflow';

export const webhookOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['webhook'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Register a new webhook',
        action: 'Create webhook',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Remove a webhook',
        action: 'Delete webhook',
      },
      {
        name: 'Get All',
        value: 'getAll',
        description: 'List all webhooks',
        action: 'Get all webhooks',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Modify a webhook',
        action: 'Update webhook',
      },
    ],
    default: 'getAll',
  },
];

export const webhookFields: INodeProperties[] = [
  // ----------------------------------
  //         webhook: getAll
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['webhook'],
        operation: ['getAll'],
      },
    },
    default: false,
    description: 'Whether to return all results or only up to a given limit',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    displayOptions: {
      show: {
        resource: ['webhook'],
        operation: ['getAll'],
        returnAll: [false],
      },
    },
    typeOptions: {
      minValue: 1,
      maxValue: 100,
    },
    default: 50,
    description: 'Max number of results to return',
  },

  // ----------------------------------
  //         webhook: create
  // ----------------------------------
  {
    displayName: 'URL',
    name: 'url',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['webhook'],
        operation: ['create'],
      },
    },
    default: '',
    placeholder: 'https://example.com/webhook',
    description: 'URL to receive webhook events',
  },
  {
    displayName: 'Topic',
    name: 'topic',
    type: 'options',
    required: true,
    displayOptions: {
      show: {
        resource: ['webhook'],
        operation: ['create'],
      },
    },
    options: [
      { name: 'Message Clicked', value: 'message.clicked' },
      { name: 'Message Delivered', value: 'message.delivered' },
      { name: 'Message Failed', value: 'message.failed' },
      { name: 'Message Replied', value: 'message.replied' },
      { name: 'Message Sent', value: 'message.sent' },
      { name: 'Subscriber Subscribed', value: 'subscriber.subscribed' },
      { name: 'Subscriber Unsubscribed', value: 'subscriber.unsubscribed' },
    ],
    default: 'subscriber.subscribed',
    description: 'Event type to listen for',
  },
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    displayOptions: {
      show: {
        resource: ['webhook'],
        operation: ['create'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Active',
        name: 'active',
        type: 'boolean',
        default: true,
        description: 'Whether the webhook is active',
      },
    ],
  },

  // ----------------------------------
  //         webhook: update / delete
  // ----------------------------------
  {
    displayName: 'Webhook ID',
    name: 'webhookId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['webhook'],
        operation: ['update', 'delete'],
      },
    },
    default: '',
    description: 'The ID of the webhook',
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    displayOptions: {
      show: {
        resource: ['webhook'],
        operation: ['update'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'URL',
        name: 'url',
        type: 'string',
        default: '',
        description: 'URL to receive webhook events',
      },
      {
        displayName: 'Topic',
        name: 'topic',
        type: 'options',
        options: [
          { name: 'Message Clicked', value: 'message.clicked' },
          { name: 'Message Delivered', value: 'message.delivered' },
          { name: 'Message Failed', value: 'message.failed' },
          { name: 'Message Replied', value: 'message.replied' },
          { name: 'Message Sent', value: 'message.sent' },
          { name: 'Subscriber Subscribed', value: 'subscriber.subscribed' },
          { name: 'Subscriber Unsubscribed', value: 'subscriber.unsubscribed' },
        ],
        default: 'subscriber.subscribed',
        description: 'Event type to listen for',
      },
      {
        displayName: 'Active',
        name: 'active',
        type: 'boolean',
        default: true,
        description: 'Whether the webhook is active',
      },
    ],
  },
];
