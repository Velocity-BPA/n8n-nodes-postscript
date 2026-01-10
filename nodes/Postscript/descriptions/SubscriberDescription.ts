/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { INodeProperties } from 'n8n-workflow';

export const subscriberOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['subscriber'],
      },
    },
    options: [
      {
        name: 'Add Tag',
        value: 'addTag',
        description: 'Add a tag to a subscriber',
        action: 'Add tag to subscriber',
      },
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new subscriber with keyword opt-in',
        action: 'Create subscriber',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get a subscriber by ID',
        action: 'Get subscriber',
      },
      {
        name: 'Get All',
        value: 'getAll',
        description: 'Get all subscribers',
        action: 'Get all subscribers',
      },
      {
        name: 'Get by Phone',
        value: 'getByPhone',
        description: 'Find a subscriber by phone number',
        action: 'Get subscriber by phone',
      },
      {
        name: 'Remove Tag',
        value: 'removeTag',
        description: 'Remove a tag from a subscriber',
        action: 'Remove tag from subscriber',
      },
      {
        name: 'Unsubscribe',
        value: 'unsubscribe',
        description: 'Opt out a subscriber',
        action: 'Unsubscribe subscriber',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update subscriber details',
        action: 'Update subscriber',
      },
      {
        name: 'Update Properties',
        value: 'updateProperties',
        description: 'Update custom properties',
        action: 'Update subscriber properties',
      },
    ],
    default: 'getAll',
  },
];

export const subscriberFields: INodeProperties[] = [
  // ----------------------------------
  //         subscriber: getAll
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['subscriber'],
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
        resource: ['subscriber'],
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
        resource: ['subscriber'],
        operation: ['getAll'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Tag',
        name: 'tag',
        type: 'string',
        default: '',
        description: 'Filter by tag name',
      },
      {
        displayName: 'Origin',
        name: 'origin',
        type: 'options',
        options: [
          { name: 'API', value: 'api' },
          { name: 'Shopify', value: 'shopify' },
          { name: 'Web', value: 'web' },
        ],
        default: 'web',
        description: 'Filter by subscriber origin',
      },
      {
        displayName: 'Subscribed',
        name: 'subscribed',
        type: 'boolean',
        default: true,
        description: 'Whether to filter by subscription status',
      },
      {
        displayName: 'Created After',
        name: 'created_after',
        type: 'dateTime',
        default: '',
        description: 'Filter subscribers created after this date',
      },
      {
        displayName: 'Created Before',
        name: 'created_before',
        type: 'dateTime',
        default: '',
        description: 'Filter subscribers created before this date',
      },
    ],
  },

  // ----------------------------------
  //         subscriber: get
  // ----------------------------------
  {
    displayName: 'Subscriber ID',
    name: 'subscriberId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['subscriber'],
        operation: ['get', 'update', 'unsubscribe', 'addTag', 'removeTag', 'updateProperties'],
      },
    },
    default: '',
    description: 'The ID of the subscriber',
  },

  // ----------------------------------
  //         subscriber: getByPhone
  // ----------------------------------
  {
    displayName: 'Phone Number',
    name: 'phoneNumber',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['subscriber'],
        operation: ['getByPhone'],
      },
    },
    default: '',
    placeholder: '+15551234567',
    description: 'Phone number in E.164 format (+1XXXXXXXXXX)',
  },

  // ----------------------------------
  //         subscriber: create
  // ----------------------------------
  {
    displayName: 'Phone Number',
    name: 'phoneNumber',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['subscriber'],
        operation: ['create'],
      },
    },
    default: '',
    placeholder: '+15551234567',
    description: 'Phone number in E.164 format (+1XXXXXXXXXX)',
  },
  {
    displayName: 'Keyword ID',
    name: 'keywordId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['subscriber'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'Opt-in keyword ID (required for TCPA compliance)',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    displayOptions: {
      show: {
        resource: ['subscriber'],
        operation: ['create'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        placeholder: 'name@email.com',
        default: '',
        description: 'Email address of the subscriber',
      },
      {
        displayName: 'First Name',
        name: 'first_name',
        type: 'string',
        default: '',
        description: 'First name of the subscriber',
      },
      {
        displayName: 'Last Name',
        name: 'last_name',
        type: 'string',
        default: '',
        description: 'Last name of the subscriber',
      },
      {
        displayName: 'Tags',
        name: 'tags',
        type: 'string',
        default: '',
        description: 'Comma-separated list of tags to apply',
      },
      {
        displayName: 'Origin',
        name: 'origin',
        type: 'options',
        options: [
          { name: 'API', value: 'api' },
          { name: 'Shopify', value: 'shopify' },
          { name: 'Web', value: 'web' },
        ],
        default: 'api',
        description: 'Origin of the subscriber',
      },
      {
        displayName: 'Custom Properties',
        name: 'properties',
        type: 'json',
        default: '{}',
        description: 'Custom properties as JSON object',
      },
    ],
  },

  // ----------------------------------
  //         subscriber: update
  // ----------------------------------
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    displayOptions: {
      show: {
        resource: ['subscriber'],
        operation: ['update'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        placeholder: 'name@email.com',
        default: '',
        description: 'Email address of the subscriber',
      },
      {
        displayName: 'First Name',
        name: 'first_name',
        type: 'string',
        default: '',
        description: 'First name of the subscriber',
      },
      {
        displayName: 'Last Name',
        name: 'last_name',
        type: 'string',
        default: '',
        description: 'Last name of the subscriber',
      },
      {
        displayName: 'Phone Number',
        name: 'phone_number',
        type: 'string',
        default: '',
        description: 'Phone number in E.164 format',
      },
    ],
  },

  // ----------------------------------
  //         subscriber: addTag / removeTag
  // ----------------------------------
  {
    displayName: 'Tag Name',
    name: 'tagName',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['subscriber'],
        operation: ['addTag', 'removeTag'],
      },
    },
    default: '',
    description: 'Name of the tag to add or remove',
  },

  // ----------------------------------
  //         subscriber: updateProperties
  // ----------------------------------
  {
    displayName: 'Properties',
    name: 'properties',
    type: 'json',
    required: true,
    displayOptions: {
      show: {
        resource: ['subscriber'],
        operation: ['updateProperties'],
      },
    },
    default: '{}',
    description: 'Custom properties to update as JSON object',
  },
];
