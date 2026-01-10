/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { INodeProperties } from 'n8n-workflow';

export const keywordOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['keyword'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new keyword',
        action: 'Create keyword',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a keyword',
        action: 'Delete keyword',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get a keyword by ID',
        action: 'Get keyword',
      },
      {
        name: 'Get All',
        value: 'getAll',
        description: 'Get all keywords',
        action: 'Get all keywords',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update a keyword',
        action: 'Update keyword',
      },
    ],
    default: 'getAll',
  },
];

export const keywordFields: INodeProperties[] = [
  // ----------------------------------
  //         keyword: getAll
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['keyword'],
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
        resource: ['keyword'],
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
        resource: ['keyword'],
        operation: ['getAll'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Active Only',
        name: 'active',
        type: 'boolean',
        default: true,
        description: 'Whether to only return active keywords',
      },
    ],
  },

  // ----------------------------------
  //         keyword: get / update / delete
  // ----------------------------------
  {
    displayName: 'Keyword ID',
    name: 'keywordId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['keyword'],
        operation: ['get', 'update', 'delete'],
      },
    },
    default: '',
    description: 'The ID of the keyword',
  },

  // ----------------------------------
  //         keyword: create
  // ----------------------------------
  {
    displayName: 'Keyword',
    name: 'keyword',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['keyword'],
        operation: ['create'],
      },
    },
    default: '',
    placeholder: 'JOIN',
    description: 'The keyword text (case-insensitive)',
  },
  {
    displayName: 'Response Message',
    name: 'responseMessage',
    type: 'string',
    typeOptions: {
      rows: 3,
    },
    required: true,
    displayOptions: {
      show: {
        resource: ['keyword'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'Auto-reply message when keyword is texted',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    displayOptions: {
      show: {
        resource: ['keyword'],
        operation: ['create'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Tag IDs',
        name: 'tag_ids',
        type: 'string',
        default: '',
        description: 'Comma-separated list of tag IDs to apply on opt-in',
      },
      {
        displayName: 'Automation ID',
        name: 'automation_id',
        type: 'string',
        default: '',
        description: 'Automation to trigger on keyword',
      },
      {
        displayName: 'Active',
        name: 'active',
        type: 'boolean',
        default: true,
        description: 'Whether the keyword is active',
      },
    ],
  },

  // ----------------------------------
  //         keyword: update
  // ----------------------------------
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    displayOptions: {
      show: {
        resource: ['keyword'],
        operation: ['update'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Keyword',
        name: 'keyword',
        type: 'string',
        default: '',
        description: 'The keyword text (case-insensitive)',
      },
      {
        displayName: 'Response Message',
        name: 'response_message',
        type: 'string',
        typeOptions: {
          rows: 3,
        },
        default: '',
        description: 'Auto-reply message when keyword is texted',
      },
      {
        displayName: 'Tag IDs',
        name: 'tag_ids',
        type: 'string',
        default: '',
        description: 'Comma-separated list of tag IDs to apply on opt-in',
      },
      {
        displayName: 'Automation ID',
        name: 'automation_id',
        type: 'string',
        default: '',
        description: 'Automation to trigger on keyword',
      },
      {
        displayName: 'Active',
        name: 'active',
        type: 'boolean',
        default: true,
        description: 'Whether the keyword is active',
      },
    ],
  },
];
