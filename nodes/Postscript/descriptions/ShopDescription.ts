/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { INodeProperties } from 'n8n-workflow';

export const shopOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['shop'],
      },
    },
    options: [
      {
        name: 'Get',
        value: 'get',
        description: 'Get shop details',
        action: 'Get shop',
      },
      {
        name: 'Get Compliance Settings',
        value: 'getComplianceSettings',
        description: 'Get TCPA compliance settings',
        action: 'Get compliance settings',
      },
      {
        name: 'Get Stats',
        value: 'getStats',
        description: 'Get overall shop statistics',
        action: 'Get shop stats',
      },
    ],
    default: 'get',
  },
];

export const shopFields: INodeProperties[] = [
  // ----------------------------------
  //         shop: getStats
  // ----------------------------------
  {
    displayName: 'Date Range',
    name: 'dateRange',
    type: 'options',
    displayOptions: {
      show: {
        resource: ['shop'],
        operation: ['getStats'],
      },
    },
    options: [
      { name: 'Today', value: 'today' },
      { name: 'Yesterday', value: 'yesterday' },
      { name: 'Last 7 Days', value: 'last7days' },
      { name: 'Last 30 Days', value: 'last30days' },
      { name: 'This Month', value: 'thisMonth' },
      { name: 'Last Month', value: 'lastMonth' },
      { name: 'This Year', value: 'thisYear' },
      { name: 'All Time', value: 'allTime' },
      { name: 'Custom', value: 'custom' },
    ],
    default: 'last30days',
    description: 'Date range for statistics',
  },
  {
    displayName: 'Start Date',
    name: 'startDate',
    type: 'dateTime',
    displayOptions: {
      show: {
        resource: ['shop'],
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
        resource: ['shop'],
        operation: ['getStats'],
        dateRange: ['custom'],
      },
    },
    default: '',
    description: 'End date for custom range',
  },
  {
    displayName: 'Include Breakdown',
    name: 'includeBreakdown',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['shop'],
        operation: ['getStats'],
      },
    },
    default: false,
    description: 'Whether to include daily breakdown',
  },
];
