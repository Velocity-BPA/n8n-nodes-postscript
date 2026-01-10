/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { INodeProperties } from 'n8n-workflow';

export const campaignOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['campaign'],
      },
    },
    options: [
      {
        name: 'Get',
        value: 'get',
        description: 'Get a campaign by ID',
        action: 'Get campaign',
      },
      {
        name: 'Get All',
        value: 'getAll',
        description: 'Get all campaigns',
        action: 'Get all campaigns',
      },
      {
        name: 'Get Stats',
        value: 'getStats',
        description: 'Get campaign analytics',
        action: 'Get campaign stats',
      },
      {
        name: 'Schedule',
        value: 'schedule',
        description: 'Schedule a campaign for future send',
        action: 'Schedule campaign',
      },
    ],
    default: 'getAll',
  },
];

export const campaignFields: INodeProperties[] = [
  // ----------------------------------
  //         campaign: getAll
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['campaign'],
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
        resource: ['campaign'],
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
        resource: ['campaign'],
        operation: ['getAll'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Status',
        name: 'status',
        type: 'options',
        options: [
          { name: 'Draft', value: 'draft' },
          { name: 'Scheduled', value: 'scheduled' },
          { name: 'Sending', value: 'sending' },
          { name: 'Sent', value: 'sent' },
        ],
        default: 'sent',
        description: 'Filter by campaign status',
      },
      {
        displayName: 'Created After',
        name: 'created_after',
        type: 'dateTime',
        default: '',
        description: 'Filter campaigns created after this date',
      },
      {
        displayName: 'Created Before',
        name: 'created_before',
        type: 'dateTime',
        default: '',
        description: 'Filter campaigns created before this date',
      },
    ],
  },

  // ----------------------------------
  //         campaign: get / getStats
  // ----------------------------------
  {
    displayName: 'Campaign ID',
    name: 'campaignId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['campaign'],
        operation: ['get', 'getStats', 'schedule'],
      },
    },
    default: '',
    description: 'The ID of the campaign',
  },

  // ----------------------------------
  //         campaign: schedule
  // ----------------------------------
  {
    displayName: 'Send At',
    name: 'sendAt',
    type: 'dateTime',
    required: true,
    displayOptions: {
      show: {
        resource: ['campaign'],
        operation: ['schedule'],
      },
    },
    default: '',
    description: 'When to send the campaign (ISO 8601 format)',
  },
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    displayOptions: {
      show: {
        resource: ['campaign'],
        operation: ['schedule'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Segment ID',
        name: 'segment_id',
        type: 'string',
        default: '',
        description: 'Target segment for the campaign',
      },
      {
        displayName: 'Timezone',
        name: 'timezone',
        type: 'string',
        default: 'America/New_York',
        description: 'Timezone for send time',
      },
    ],
  },

  // ----------------------------------
  //         campaign: getStats date range
  // ----------------------------------
  {
    displayName: 'Include Detailed Stats',
    name: 'includeDetails',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['campaign'],
        operation: ['getStats'],
      },
    },
    default: true,
    description: 'Whether to include detailed click and conversion data',
  },
];
