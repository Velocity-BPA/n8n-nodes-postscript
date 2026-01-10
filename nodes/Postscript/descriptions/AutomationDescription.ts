/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { INodeProperties } from 'n8n-workflow';

export const automationOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['automation'],
      },
    },
    options: [
      {
        name: 'Disable',
        value: 'disable',
        description: 'Disable an automation',
        action: 'Disable automation',
      },
      {
        name: 'Enable',
        value: 'enable',
        description: 'Enable an automation',
        action: 'Enable automation',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get an automation by ID',
        action: 'Get automation',
      },
      {
        name: 'Get All',
        value: 'getAll',
        description: 'Get all automations',
        action: 'Get all automations',
      },
      {
        name: 'Get Stats',
        value: 'getStats',
        description: 'Get automation performance data',
        action: 'Get automation stats',
      },
      {
        name: 'Trigger',
        value: 'trigger',
        description: 'Manually trigger an automation for a subscriber',
        action: 'Trigger automation',
      },
    ],
    default: 'getAll',
  },
];

export const automationFields: INodeProperties[] = [
  // ----------------------------------
  //         automation: getAll
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['automation'],
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
        resource: ['automation'],
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
        resource: ['automation'],
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
          { name: 'Active', value: 'active' },
          { name: 'Draft', value: 'draft' },
          { name: 'Paused', value: 'paused' },
        ],
        default: 'active',
        description: 'Filter by automation status',
      },
      {
        displayName: 'Trigger Type',
        name: 'trigger_type',
        type: 'options',
        options: [
          { name: 'Event', value: 'event' },
          { name: 'Keyword', value: 'keyword' },
          { name: 'Signup', value: 'signup' },
        ],
        default: 'keyword',
        description: 'Filter by trigger type',
      },
    ],
  },

  // ----------------------------------
  //         automation: get / enable / disable / getStats
  // ----------------------------------
  {
    displayName: 'Automation ID',
    name: 'automationId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['automation'],
        operation: ['get', 'enable', 'disable', 'getStats', 'trigger'],
      },
    },
    default: '',
    description: 'The ID of the automation',
  },

  // ----------------------------------
  //         automation: trigger
  // ----------------------------------
  {
    displayName: 'Subscriber ID',
    name: 'subscriberId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['automation'],
        operation: ['trigger'],
      },
    },
    default: '',
    description: 'The ID of the subscriber to trigger automation for',
  },
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    displayOptions: {
      show: {
        resource: ['automation'],
        operation: ['trigger'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Event Properties',
        name: 'properties',
        type: 'json',
        default: '{}',
        description: 'Additional properties to pass to the automation',
      },
      {
        displayName: 'Skip Delay',
        name: 'skipDelay',
        type: 'boolean',
        default: false,
        description: 'Whether to skip any configured delays in the automation',
      },
    ],
  },

  // ----------------------------------
  //         automation: getStats
  // ----------------------------------
  {
    displayName: 'Date Range',
    name: 'dateRange',
    type: 'options',
    displayOptions: {
      show: {
        resource: ['automation'],
        operation: ['getStats'],
      },
    },
    options: [
      { name: 'Last 7 Days', value: 'last7days' },
      { name: 'Last 30 Days', value: 'last30days' },
      { name: 'Last 90 Days', value: 'last90days' },
      { name: 'All Time', value: 'allTime' },
    ],
    default: 'last30days',
    description: 'Date range for statistics',
  },
];
