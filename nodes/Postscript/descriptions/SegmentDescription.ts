/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { INodeProperties } from 'n8n-workflow';

export const segmentOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['segment'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new segment',
        action: 'Create segment',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get a segment by ID',
        action: 'Get segment',
      },
      {
        name: 'Get All',
        value: 'getAll',
        description: 'Get all segments',
        action: 'Get all segments',
      },
      {
        name: 'Get Count',
        value: 'getCount',
        description: 'Get segment subscriber count',
        action: 'Get segment count',
      },
      {
        name: 'Get Subscribers',
        value: 'getSubscribers',
        description: 'List segment members',
        action: 'Get segment subscribers',
      },
    ],
    default: 'getAll',
  },
];

export const segmentFields: INodeProperties[] = [
  // ----------------------------------
  //         segment: getAll
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['segment'],
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
        resource: ['segment'],
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
  //         segment: get / getSubscribers / getCount
  // ----------------------------------
  {
    displayName: 'Segment ID',
    name: 'segmentId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['segment'],
        operation: ['get', 'getSubscribers', 'getCount'],
      },
    },
    default: '',
    description: 'The ID of the segment',
  },

  // ----------------------------------
  //         segment: getSubscribers
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['segment'],
        operation: ['getSubscribers'],
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
        resource: ['segment'],
        operation: ['getSubscribers'],
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
  //         segment: create
  // ----------------------------------
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['segment'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'Name of the segment',
  },
  {
    displayName: 'Conditions',
    name: 'conditions',
    type: 'fixedCollection',
    typeOptions: {
      multipleValues: true,
    },
    displayOptions: {
      show: {
        resource: ['segment'],
        operation: ['create'],
      },
    },
    default: {},
    placeholder: 'Add Condition',
    description: 'Segment filter conditions',
    options: [
      {
        name: 'conditionValues',
        displayName: 'Condition',
        values: [
          {
            displayName: 'Field',
            name: 'field',
            type: 'options',
            options: [
              { name: 'Created At', value: 'created_at' },
              { name: 'Email', value: 'email' },
              { name: 'First Name', value: 'first_name' },
              { name: 'Last Name', value: 'last_name' },
              { name: 'Origin', value: 'origin' },
              { name: 'Phone Number', value: 'phone_number' },
              { name: 'Subscribed', value: 'subscribed' },
              { name: 'Tag', value: 'tag' },
            ],
            default: 'tag',
            description: 'Field to filter on',
          },
          {
            displayName: 'Operator',
            name: 'operator',
            type: 'options',
            options: [
              { name: 'Contains', value: 'contains' },
              { name: 'Does Not Contain', value: 'does_not_contain' },
              { name: 'Equals', value: 'equals' },
              { name: 'Greater Than', value: 'greater_than' },
              { name: 'Is Not', value: 'is_not' },
              { name: 'Is Set', value: 'is_set' },
              { name: 'Less Than', value: 'less_than' },
              { name: 'Not Set', value: 'not_set' },
            ],
            default: 'equals',
            description: 'Comparison operator',
          },
          {
            displayName: 'Value',
            name: 'value',
            type: 'string',
            default: '',
            description: 'Value to compare against',
          },
        ],
      },
    ],
  },
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    displayOptions: {
      show: {
        resource: ['segment'],
        operation: ['create'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Match Type',
        name: 'matchType',
        type: 'options',
        options: [
          { name: 'Match All Conditions', value: 'all' },
          { name: 'Match Any Condition', value: 'any' },
        ],
        default: 'all',
        description: 'How to combine multiple conditions',
      },
    ],
  },
];
