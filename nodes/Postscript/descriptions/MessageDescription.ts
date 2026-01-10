/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { INodeProperties } from 'n8n-workflow';

export const messageOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['message'],
      },
    },
    options: [
      {
        name: 'Get',
        value: 'get',
        description: 'Get a message by ID',
        action: 'Get message',
      },
      {
        name: 'Get All',
        value: 'getAll',
        description: 'Get all sent messages',
        action: 'Get all messages',
      },
      {
        name: 'Get Stats',
        value: 'getStats',
        description: 'Get delivery statistics',
        action: 'Get message stats',
      },
      {
        name: 'Send SMS',
        value: 'send',
        description: 'Send SMS to a subscriber',
        action: 'Send SMS',
      },
      {
        name: 'Send MMS',
        value: 'sendMMS',
        description: 'Send multimedia message',
        action: 'Send MMS',
      },
    ],
    default: 'send',
  },
];

export const messageFields: INodeProperties[] = [
  // ----------------------------------
  //         message: getAll
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['message'],
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
        resource: ['message'],
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
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    displayOptions: {
      show: {
        resource: ['message'],
        operation: ['getAll'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Subscriber ID',
        name: 'subscriber_id',
        type: 'string',
        default: '',
        description: 'Filter by subscriber ID',
      },
      {
        displayName: 'Status',
        name: 'status',
        type: 'options',
        options: [
          { name: 'Delivered', value: 'delivered' },
          { name: 'Failed', value: 'failed' },
          { name: 'Pending', value: 'pending' },
          { name: 'Sent', value: 'sent' },
        ],
        default: 'sent',
        description: 'Filter by message status',
      },
      {
        displayName: 'Sent After',
        name: 'sent_after',
        type: 'dateTime',
        default: '',
        description: 'Filter messages sent after this date',
      },
      {
        displayName: 'Sent Before',
        name: 'sent_before',
        type: 'dateTime',
        default: '',
        description: 'Filter messages sent before this date',
      },
    ],
  },

  // ----------------------------------
  //         message: get
  // ----------------------------------
  {
    displayName: 'Message ID',
    name: 'messageId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['message'],
        operation: ['get'],
      },
    },
    default: '',
    description: 'The ID of the message',
  },

  // ----------------------------------
  //         message: send
  // ----------------------------------
  {
    displayName: 'Subscriber ID',
    name: 'subscriberId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['message'],
        operation: ['send', 'sendMMS'],
      },
    },
    default: '',
    description: 'The ID of the subscriber to message',
  },
  {
    displayName: 'Message Body',
    name: 'body',
    type: 'string',
    typeOptions: {
      rows: 4,
    },
    required: true,
    displayOptions: {
      show: {
        resource: ['message'],
        operation: ['send'],
      },
    },
    default: '',
    description: 'The message text (max 160 characters for SMS)',
  },
  {
    displayName: 'Message Body',
    name: 'body',
    type: 'string',
    typeOptions: {
      rows: 4,
    },
    required: true,
    displayOptions: {
      show: {
        resource: ['message'],
        operation: ['sendMMS'],
      },
    },
    default: '',
    description: 'The message text (max 1600 characters for MMS)',
  },

  // ----------------------------------
  //         message: sendMMS
  // ----------------------------------
  {
    displayName: 'Media URL',
    name: 'mediaUrl',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['message'],
        operation: ['sendMMS'],
      },
    },
    default: '',
    placeholder: 'https://example.com/image.jpg',
    description: 'URL of the media to send (JPG, PNG, or GIF)',
  },

  // ----------------------------------
  //         message: send/sendMMS options
  // ----------------------------------
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    displayOptions: {
      show: {
        resource: ['message'],
        operation: ['send', 'sendMMS'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Keyword ID',
        name: 'keywordId',
        type: 'string',
        default: '',
        description: 'Associate message with a keyword',
      },
      {
        displayName: 'Skip Fatigue Rules',
        name: 'skipFatigue',
        type: 'boolean',
        default: false,
        description: 'Whether to skip message frequency rules',
      },
      {
        displayName: 'Use Short Links',
        name: 'useShortLinks',
        type: 'boolean',
        default: true,
        description: 'Whether to shorten URLs in the message',
      },
    ],
  },

  // ----------------------------------
  //         message: getStats
  // ----------------------------------
  {
    displayName: 'Date Range',
    name: 'dateRange',
    type: 'options',
    displayOptions: {
      show: {
        resource: ['message'],
        operation: ['getStats'],
      },
    },
    options: [
      { name: 'Today', value: 'today' },
      { name: 'Yesterday', value: 'yesterday' },
      { name: 'Last 7 Days', value: 'last7days' },
      { name: 'Last 30 Days', value: 'last30days' },
      { name: 'This Month', value: 'thisMonth' },
      { name: 'Custom', value: 'custom' },
    ],
    default: 'last7days',
    description: 'Date range for statistics',
  },
  {
    displayName: 'Start Date',
    name: 'startDate',
    type: 'dateTime',
    displayOptions: {
      show: {
        resource: ['message'],
        operation: ['getStats'],
        dateRange: ['custom'],
      },
    },
    default: '',
    description: 'Start date for custom range',
  },
  {
    displayName: 'End Date',
    name: 'endDate',
    type: 'dateTime',
    displayOptions: {
      show: {
        resource: ['message'],
        operation: ['getStats'],
        dateRange: ['custom'],
      },
    },
    default: '',
    description: 'End date for custom range',
  },
];
