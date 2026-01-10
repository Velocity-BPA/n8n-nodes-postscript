/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  IDataObject,
} from 'n8n-workflow';

import {
  postscriptApiRequest,
  postscriptApiRequestAllItems,
  formatPhoneNumber,
  buildSubscriberQuery,
  buildMessageBody,
  validateMessageLength,
  logLicensingNotice,
  simplifyResponse,
  formatDate,
} from './GenericFunctions';

import {
  subscriberOperations,
  subscriberFields,
} from './descriptions/SubscriberDescription';
import {
  messageOperations,
  messageFields,
} from './descriptions/MessageDescription';
import {
  keywordOperations,
  keywordFields,
} from './descriptions/KeywordDescription';
import {
  campaignOperations,
  campaignFields,
} from './descriptions/CampaignDescription';
import {
  automationOperations,
  automationFields,
} from './descriptions/AutomationDescription';
import {
  segmentOperations,
  segmentFields,
} from './descriptions/SegmentDescription';
import {
  eventOperations,
  eventFields,
} from './descriptions/EventDescription';
import {
  shopOperations,
  shopFields,
} from './descriptions/ShopDescription';
import {
  webhookOperations,
  webhookFields,
} from './descriptions/WebhookDescription';

export class Postscript implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Postscript',
    name: 'postscript',
    icon: 'file:postscript.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with Postscript SMS marketing platform',
    defaults: {
      name: 'Postscript',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'postscriptApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Automation',
            value: 'automation',
          },
          {
            name: 'Campaign',
            value: 'campaign',
          },
          {
            name: 'Event',
            value: 'event',
          },
          {
            name: 'Keyword',
            value: 'keyword',
          },
          {
            name: 'Message',
            value: 'message',
          },
          {
            name: 'Segment',
            value: 'segment',
          },
          {
            name: 'Shop',
            value: 'shop',
          },
          {
            name: 'Subscriber',
            value: 'subscriber',
          },
          {
            name: 'Webhook',
            value: 'webhook',
          },
        ],
        default: 'subscriber',
      },
      // Subscriber
      ...subscriberOperations,
      ...subscriberFields,
      // Message
      ...messageOperations,
      ...messageFields,
      // Keyword
      ...keywordOperations,
      ...keywordFields,
      // Campaign
      ...campaignOperations,
      ...campaignFields,
      // Automation
      ...automationOperations,
      ...automationFields,
      // Segment
      ...segmentOperations,
      ...segmentFields,
      // Event
      ...eventOperations,
      ...eventFields,
      // Shop
      ...shopOperations,
      ...shopFields,
      // Webhook
      ...webhookOperations,
      ...webhookFields,
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    // Log licensing notice once per execution
    logLicensingNotice();

    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;

    for (let i = 0; i < items.length; i++) {
      try {
        let responseData: any;

        // ----------------------------------------
        //             Subscriber
        // ----------------------------------------
        if (resource === 'subscriber') {
          if (operation === 'getAll') {
            const returnAll = this.getNodeParameter('returnAll', i) as boolean;
            const filters = this.getNodeParameter('filters', i) as IDataObject;
            const query = buildSubscriberQuery(filters);

            if (returnAll) {
              responseData = await postscriptApiRequestAllItems.call(
                this,
                'GET',
                '/subscribers',
                {},
                query,
              );
            } else {
              const limit = this.getNodeParameter('limit', i) as number;
              query.limit = limit;
              const response = await postscriptApiRequest.call(
                this,
                'GET',
                '/subscribers',
                {},
                query,
              );
              responseData = simplifyResponse(response);
            }
          } else if (operation === 'get') {
            const subscriberId = this.getNodeParameter('subscriberId', i) as string;
            responseData = await postscriptApiRequest.call(
              this,
              'GET',
              `/subscribers/${subscriberId}`,
            );
            responseData = simplifyResponse(responseData);
          } else if (operation === 'getByPhone') {
            const phoneNumber = this.getNodeParameter('phoneNumber', i) as string;
            const formattedPhone = formatPhoneNumber(phoneNumber);
            responseData = await postscriptApiRequest.call(
              this,
              'GET',
              '/subscribers/search',
              {},
              { phone_number: formattedPhone },
            );
            responseData = simplifyResponse(responseData);
          } else if (operation === 'create') {
            const phoneNumber = this.getNodeParameter('phoneNumber', i) as string;
            const keywordId = this.getNodeParameter('keywordId', i) as string;
            const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

            const body: IDataObject = {
              phone_number: formatPhoneNumber(phoneNumber),
              keyword_id: keywordId,
              ...additionalFields,
            };

            if (additionalFields.tags) {
              body.tags = (additionalFields.tags as string).split(',').map((t) => t.trim());
            }

            if (additionalFields.properties) {
              body.properties = JSON.parse(additionalFields.properties as string);
            }

            responseData = await postscriptApiRequest.call(
              this,
              'POST',
              '/subscribers',
              body,
            );
            responseData = simplifyResponse(responseData);
          } else if (operation === 'update') {
            const subscriberId = this.getNodeParameter('subscriberId', i) as string;
            const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

            if (updateFields.phone_number) {
              updateFields.phone_number = formatPhoneNumber(updateFields.phone_number as string);
            }

            responseData = await postscriptApiRequest.call(
              this,
              'PATCH',
              `/subscribers/${subscriberId}`,
              updateFields,
            );
            responseData = simplifyResponse(responseData);
          } else if (operation === 'unsubscribe') {
            const subscriberId = this.getNodeParameter('subscriberId', i) as string;
            responseData = await postscriptApiRequest.call(
              this,
              'POST',
              `/subscribers/${subscriberId}/unsubscribe`,
            );
            responseData = simplifyResponse(responseData);
          } else if (operation === 'addTag') {
            const subscriberId = this.getNodeParameter('subscriberId', i) as string;
            const tagName = this.getNodeParameter('tagName', i) as string;
            responseData = await postscriptApiRequest.call(
              this,
              'POST',
              `/subscribers/${subscriberId}/tags`,
              { tag: tagName },
            );
            responseData = simplifyResponse(responseData);
          } else if (operation === 'removeTag') {
            const subscriberId = this.getNodeParameter('subscriberId', i) as string;
            const tagName = this.getNodeParameter('tagName', i) as string;
            responseData = await postscriptApiRequest.call(
              this,
              'DELETE',
              `/subscribers/${subscriberId}/tags/${encodeURIComponent(tagName)}`,
            );
            responseData = { success: true };
          } else if (operation === 'updateProperties') {
            const subscriberId = this.getNodeParameter('subscriberId', i) as string;
            const properties = this.getNodeParameter('properties', i) as string;
            responseData = await postscriptApiRequest.call(
              this,
              'PATCH',
              `/subscribers/${subscriberId}/properties`,
              JSON.parse(properties),
            );
            responseData = simplifyResponse(responseData);
          }
        }

        // ----------------------------------------
        //             Message
        // ----------------------------------------
        else if (resource === 'message') {
          if (operation === 'getAll') {
            const returnAll = this.getNodeParameter('returnAll', i) as boolean;
            const filters = this.getNodeParameter('filters', i) as IDataObject;
            const query: IDataObject = {};

            if (filters.subscriber_id) query.subscriber_id = filters.subscriber_id;
            if (filters.status) query.status = filters.status;
            if (filters.sent_after) query.sent_after = formatDate(filters.sent_after as string);
            if (filters.sent_before) query.sent_before = formatDate(filters.sent_before as string);

            if (returnAll) {
              responseData = await postscriptApiRequestAllItems.call(
                this,
                'GET',
                '/messages',
                {},
                query,
              );
            } else {
              const limit = this.getNodeParameter('limit', i) as number;
              query.limit = limit;
              const response = await postscriptApiRequest.call(
                this,
                'GET',
                '/messages',
                {},
                query,
              );
              responseData = simplifyResponse(response);
            }
          } else if (operation === 'get') {
            const messageId = this.getNodeParameter('messageId', i) as string;
            responseData = await postscriptApiRequest.call(
              this,
              'GET',
              `/messages/${messageId}`,
            );
            responseData = simplifyResponse(responseData);
          } else if (operation === 'send') {
            const subscriberId = this.getNodeParameter('subscriberId', i) as string;
            const body = this.getNodeParameter('body', i) as string;
            const options = this.getNodeParameter('options', i) as IDataObject;

            validateMessageLength(body, false);
            const messageBody = buildMessageBody(subscriberId, body, options);

            responseData = await postscriptApiRequest.call(
              this,
              'POST',
              '/messages',
              messageBody,
            );
            responseData = simplifyResponse(responseData);
          } else if (operation === 'sendMMS') {
            const subscriberId = this.getNodeParameter('subscriberId', i) as string;
            const body = this.getNodeParameter('body', i) as string;
            const mediaUrl = this.getNodeParameter('mediaUrl', i) as string;
            const options = this.getNodeParameter('options', i) as IDataObject;

            validateMessageLength(body, true);
            const messageBody = buildMessageBody(subscriberId, body, {
              ...options,
              mediaUrl,
            });

            responseData = await postscriptApiRequest.call(
              this,
              'POST',
              '/messages',
              messageBody,
            );
            responseData = simplifyResponse(responseData);
          } else if (operation === 'getStats') {
            const dateRange = this.getNodeParameter('dateRange', i) as string;
            const query: IDataObject = { range: dateRange };

            if (dateRange === 'custom') {
              query.start_date = this.getNodeParameter('startDate', i) as string;
              query.end_date = this.getNodeParameter('endDate', i) as string;
            }

            responseData = await postscriptApiRequest.call(
              this,
              'GET',
              '/messages/stats',
              {},
              query,
            );
            responseData = simplifyResponse(responseData);
          }
        }

        // ----------------------------------------
        //             Keyword
        // ----------------------------------------
        else if (resource === 'keyword') {
          if (operation === 'getAll') {
            const returnAll = this.getNodeParameter('returnAll', i) as boolean;
            const filters = this.getNodeParameter('filters', i) as IDataObject;
            const query: IDataObject = {};

            if (filters.active !== undefined) query.active = filters.active;

            if (returnAll) {
              responseData = await postscriptApiRequestAllItems.call(
                this,
                'GET',
                '/keywords',
                {},
                query,
              );
            } else {
              const limit = this.getNodeParameter('limit', i) as number;
              query.limit = limit;
              const response = await postscriptApiRequest.call(
                this,
                'GET',
                '/keywords',
                {},
                query,
              );
              responseData = simplifyResponse(response);
            }
          } else if (operation === 'get') {
            const keywordId = this.getNodeParameter('keywordId', i) as string;
            responseData = await postscriptApiRequest.call(
              this,
              'GET',
              `/keywords/${keywordId}`,
            );
            responseData = simplifyResponse(responseData);
          } else if (operation === 'create') {
            const keyword = this.getNodeParameter('keyword', i) as string;
            const responseMessage = this.getNodeParameter('responseMessage', i) as string;
            const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

            const body: IDataObject = {
              keyword,
              response_message: responseMessage,
              ...additionalFields,
            };

            if (additionalFields.tag_ids) {
              body.tag_ids = (additionalFields.tag_ids as string).split(',').map((t) => t.trim());
            }

            responseData = await postscriptApiRequest.call(
              this,
              'POST',
              '/keywords',
              body,
            );
            responseData = simplifyResponse(responseData);
          } else if (operation === 'update') {
            const keywordId = this.getNodeParameter('keywordId', i) as string;
            const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

            if (updateFields.tag_ids) {
              updateFields.tag_ids = (updateFields.tag_ids as string).split(',').map((t) => t.trim());
            }

            responseData = await postscriptApiRequest.call(
              this,
              'PATCH',
              `/keywords/${keywordId}`,
              updateFields,
            );
            responseData = simplifyResponse(responseData);
          } else if (operation === 'delete') {
            const keywordId = this.getNodeParameter('keywordId', i) as string;
            await postscriptApiRequest.call(
              this,
              'DELETE',
              `/keywords/${keywordId}`,
            );
            responseData = { success: true };
          }
        }

        // ----------------------------------------
        //             Campaign
        // ----------------------------------------
        else if (resource === 'campaign') {
          if (operation === 'getAll') {
            const returnAll = this.getNodeParameter('returnAll', i) as boolean;
            const filters = this.getNodeParameter('filters', i) as IDataObject;
            const query: IDataObject = {};

            if (filters.status) query.status = filters.status;
            if (filters.created_after) query.created_after = formatDate(filters.created_after as string);
            if (filters.created_before) query.created_before = formatDate(filters.created_before as string);

            if (returnAll) {
              responseData = await postscriptApiRequestAllItems.call(
                this,
                'GET',
                '/campaigns',
                {},
                query,
              );
            } else {
              const limit = this.getNodeParameter('limit', i) as number;
              query.limit = limit;
              const response = await postscriptApiRequest.call(
                this,
                'GET',
                '/campaigns',
                {},
                query,
              );
              responseData = simplifyResponse(response);
            }
          } else if (operation === 'get') {
            const campaignId = this.getNodeParameter('campaignId', i) as string;
            responseData = await postscriptApiRequest.call(
              this,
              'GET',
              `/campaigns/${campaignId}`,
            );
            responseData = simplifyResponse(responseData);
          } else if (operation === 'getStats') {
            const campaignId = this.getNodeParameter('campaignId', i) as string;
            const includeDetails = this.getNodeParameter('includeDetails', i) as boolean;
            responseData = await postscriptApiRequest.call(
              this,
              'GET',
              `/campaigns/${campaignId}/stats`,
              {},
              { include_details: includeDetails },
            );
            responseData = simplifyResponse(responseData);
          } else if (operation === 'schedule') {
            const campaignId = this.getNodeParameter('campaignId', i) as string;
            const sendAt = this.getNodeParameter('sendAt', i) as string;
            const options = this.getNodeParameter('options', i) as IDataObject;

            const body: IDataObject = {
              send_at: formatDate(sendAt),
              ...options,
            };

            responseData = await postscriptApiRequest.call(
              this,
              'POST',
              `/campaigns/${campaignId}/schedule`,
              body,
            );
            responseData = simplifyResponse(responseData);
          }
        }

        // ----------------------------------------
        //             Automation
        // ----------------------------------------
        else if (resource === 'automation') {
          if (operation === 'getAll') {
            const returnAll = this.getNodeParameter('returnAll', i) as boolean;
            const filters = this.getNodeParameter('filters', i) as IDataObject;
            const query: IDataObject = {};

            if (filters.status) query.status = filters.status;
            if (filters.trigger_type) query.trigger_type = filters.trigger_type;

            if (returnAll) {
              responseData = await postscriptApiRequestAllItems.call(
                this,
                'GET',
                '/automations',
                {},
                query,
              );
            } else {
              const limit = this.getNodeParameter('limit', i) as number;
              query.limit = limit;
              const response = await postscriptApiRequest.call(
                this,
                'GET',
                '/automations',
                {},
                query,
              );
              responseData = simplifyResponse(response);
            }
          } else if (operation === 'get') {
            const automationId = this.getNodeParameter('automationId', i) as string;
            responseData = await postscriptApiRequest.call(
              this,
              'GET',
              `/automations/${automationId}`,
            );
            responseData = simplifyResponse(responseData);
          } else if (operation === 'getStats') {
            const automationId = this.getNodeParameter('automationId', i) as string;
            const dateRange = this.getNodeParameter('dateRange', i) as string;
            responseData = await postscriptApiRequest.call(
              this,
              'GET',
              `/automations/${automationId}/stats`,
              {},
              { range: dateRange },
            );
            responseData = simplifyResponse(responseData);
          } else if (operation === 'trigger') {
            const automationId = this.getNodeParameter('automationId', i) as string;
            const subscriberId = this.getNodeParameter('subscriberId', i) as string;
            const options = this.getNodeParameter('options', i) as IDataObject;

            const body: IDataObject = {
              subscriber_id: subscriberId,
            };

            if (options.properties) {
              body.properties = JSON.parse(options.properties as string);
            }
            if (options.skipDelay !== undefined) {
              body.skip_delay = options.skipDelay;
            }

            responseData = await postscriptApiRequest.call(
              this,
              'POST',
              `/automations/${automationId}/trigger`,
              body,
            );
            responseData = simplifyResponse(responseData);
          } else if (operation === 'enable') {
            const automationId = this.getNodeParameter('automationId', i) as string;
            responseData = await postscriptApiRequest.call(
              this,
              'POST',
              `/automations/${automationId}/enable`,
            );
            responseData = simplifyResponse(responseData);
          } else if (operation === 'disable') {
            const automationId = this.getNodeParameter('automationId', i) as string;
            responseData = await postscriptApiRequest.call(
              this,
              'POST',
              `/automations/${automationId}/disable`,
            );
            responseData = simplifyResponse(responseData);
          }
        }

        // ----------------------------------------
        //             Segment
        // ----------------------------------------
        else if (resource === 'segment') {
          if (operation === 'getAll') {
            const returnAll = this.getNodeParameter('returnAll', i) as boolean;

            if (returnAll) {
              responseData = await postscriptApiRequestAllItems.call(
                this,
                'GET',
                '/segments',
              );
            } else {
              const limit = this.getNodeParameter('limit', i) as number;
              const response = await postscriptApiRequest.call(
                this,
                'GET',
                '/segments',
                {},
                { limit },
              );
              responseData = simplifyResponse(response);
            }
          } else if (operation === 'get') {
            const segmentId = this.getNodeParameter('segmentId', i) as string;
            responseData = await postscriptApiRequest.call(
              this,
              'GET',
              `/segments/${segmentId}`,
            );
            responseData = simplifyResponse(responseData);
          } else if (operation === 'create') {
            const name = this.getNodeParameter('name', i) as string;
            const conditions = this.getNodeParameter('conditions', i) as IDataObject;
            const options = this.getNodeParameter('options', i) as IDataObject;

            const body: IDataObject = {
              name,
              match_type: options.matchType || 'all',
            };

            if (conditions.conditionValues) {
              body.conditions = (conditions.conditionValues as IDataObject[]).map((c) => ({
                field: c.field,
                operator: c.operator,
                value: c.value,
              }));
            }

            responseData = await postscriptApiRequest.call(
              this,
              'POST',
              '/segments',
              body,
            );
            responseData = simplifyResponse(responseData);
          } else if (operation === 'getSubscribers') {
            const segmentId = this.getNodeParameter('segmentId', i) as string;
            const returnAll = this.getNodeParameter('returnAll', i) as boolean;

            if (returnAll) {
              responseData = await postscriptApiRequestAllItems.call(
                this,
                'GET',
                `/segments/${segmentId}/subscribers`,
              );
            } else {
              const limit = this.getNodeParameter('limit', i) as number;
              const response = await postscriptApiRequest.call(
                this,
                'GET',
                `/segments/${segmentId}/subscribers`,
                {},
                { limit },
              );
              responseData = simplifyResponse(response);
            }
          } else if (operation === 'getCount') {
            const segmentId = this.getNodeParameter('segmentId', i) as string;
            responseData = await postscriptApiRequest.call(
              this,
              'GET',
              `/segments/${segmentId}/count`,
            );
            responseData = simplifyResponse(responseData);
          }
        }

        // ----------------------------------------
        //             Event
        // ----------------------------------------
        else if (resource === 'event') {
          if (operation === 'track') {
            const identifierType = this.getNodeParameter('identifierType', i) as string;
            const eventType = this.getNodeParameter('eventType', i) as string;
            const properties = this.getNodeParameter('properties', i) as string;
            const options = this.getNodeParameter('options', i) as IDataObject;

            const body: IDataObject = {
              event_type: eventType,
              properties: JSON.parse(properties),
            };

            if (identifierType === 'subscriber_id') {
              body.subscriber_id = this.getNodeParameter('subscriberId', i) as string;
            } else {
              const phoneNumber = this.getNodeParameter('phoneNumber', i) as string;
              body.phone_number = formatPhoneNumber(phoneNumber);
            }

            if (options.occurred_at) {
              body.occurred_at = formatDate(options.occurred_at as string);
            }

            responseData = await postscriptApiRequest.call(
              this,
              'POST',
              '/events',
              body,
            );
            responseData = simplifyResponse(responseData);
          } else if (operation === 'trackEcommerce') {
            const identifierType = this.getNodeParameter('identifierType', i) as string;
            const ecommerceEventType = this.getNodeParameter('ecommerceEventType', i) as string;
            const additionalProperties = this.getNodeParameter('additionalProperties', i) as string;

            const body: IDataObject = {
              event_type: ecommerceEventType,
            };

            if (identifierType === 'subscriber_id') {
              body.subscriber_id = this.getNodeParameter('subscriberId', i) as string;
            } else {
              const phoneNumber = this.getNodeParameter('phoneNumber', i) as string;
              body.phone_number = formatPhoneNumber(phoneNumber);
            }

            const properties: IDataObject = {};

            // Order fields
            if (ecommerceEventType === 'order_completed') {
              const orderId = this.getNodeParameter('orderId', i, '') as string;
              const orderTotal = this.getNodeParameter('orderTotal', i, 0) as number;
              const currency = this.getNodeParameter('currency', i, 'USD') as string;
              if (orderId) properties.order_id = orderId;
              if (orderTotal) properties.order_total = orderTotal;
              if (currency) properties.currency = currency;
            }

            // Product fields
            if (['product_viewed', 'added_to_cart', 'browse_abandonment'].includes(ecommerceEventType)) {
              const productId = this.getNodeParameter('productId', i, '') as string;
              const productName = this.getNodeParameter('productName', i, '') as string;
              const productPrice = this.getNodeParameter('productPrice', i, 0) as number;
              const productUrl = this.getNodeParameter('productUrl', i, '') as string;
              const productImageUrl = this.getNodeParameter('productImageUrl', i, '') as string;
              if (productId) properties.product_id = productId;
              if (productName) properties.product_name = productName;
              if (productPrice) properties.product_price = productPrice;
              if (productUrl) properties.product_url = productUrl;
              if (productImageUrl) properties.product_image_url = productImageUrl;
            }

            // Cart fields
            if (['cart_abandonment', 'checkout_started'].includes(ecommerceEventType)) {
              const cartId = this.getNodeParameter('cartId', i, '') as string;
              const cartTotal = this.getNodeParameter('cartTotal', i, 0) as number;
              const cartUrl = this.getNodeParameter('cartUrl', i, '') as string;
              if (cartId) properties.cart_id = cartId;
              if (cartTotal) properties.cart_total = cartTotal;
              if (cartUrl) properties.cart_url = cartUrl;
            }

            // Merge additional properties
            if (additionalProperties) {
              Object.assign(properties, JSON.parse(additionalProperties));
            }

            body.properties = properties;

            responseData = await postscriptApiRequest.call(
              this,
              'POST',
              '/events',
              body,
            );
            responseData = simplifyResponse(responseData);
          } else if (operation === 'getTypes') {
            responseData = await postscriptApiRequest.call(
              this,
              'GET',
              '/events/types',
            );
            responseData = simplifyResponse(responseData);
          }
        }

        // ----------------------------------------
        //             Shop
        // ----------------------------------------
        else if (resource === 'shop') {
          if (operation === 'get') {
            responseData = await postscriptApiRequest.call(
              this,
              'GET',
              '/shop',
            );
            responseData = simplifyResponse(responseData);
          } else if (operation === 'getStats') {
            const dateRange = this.getNodeParameter('dateRange', i) as string;
            const includeBreakdown = this.getNodeParameter('includeBreakdown', i) as boolean;
            const query: IDataObject = { range: dateRange, include_breakdown: includeBreakdown };

            if (dateRange === 'custom') {
              query.start_date = this.getNodeParameter('startDate', i) as string;
              query.end_date = this.getNodeParameter('endDate', i) as string;
            }

            responseData = await postscriptApiRequest.call(
              this,
              'GET',
              '/shop/stats',
              {},
              query,
            );
            responseData = simplifyResponse(responseData);
          } else if (operation === 'getComplianceSettings') {
            responseData = await postscriptApiRequest.call(
              this,
              'GET',
              '/shop/compliance',
            );
            responseData = simplifyResponse(responseData);
          }
        }

        // ----------------------------------------
        //             Webhook
        // ----------------------------------------
        else if (resource === 'webhook') {
          if (operation === 'getAll') {
            const returnAll = this.getNodeParameter('returnAll', i) as boolean;

            if (returnAll) {
              responseData = await postscriptApiRequestAllItems.call(
                this,
                'GET',
                '/webhooks',
              );
            } else {
              const limit = this.getNodeParameter('limit', i) as number;
              const response = await postscriptApiRequest.call(
                this,
                'GET',
                '/webhooks',
                {},
                { limit },
              );
              responseData = simplifyResponse(response);
            }
          } else if (operation === 'create') {
            const url = this.getNodeParameter('url', i) as string;
            const topic = this.getNodeParameter('topic', i) as string;
            const options = this.getNodeParameter('options', i) as IDataObject;

            const body: IDataObject = {
              url,
              topic,
              format: 'json',
              ...options,
            };

            responseData = await postscriptApiRequest.call(
              this,
              'POST',
              '/webhooks',
              body,
            );
            responseData = simplifyResponse(responseData);
          } else if (operation === 'update') {
            const webhookId = this.getNodeParameter('webhookId', i) as string;
            const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

            responseData = await postscriptApiRequest.call(
              this,
              'PATCH',
              `/webhooks/${webhookId}`,
              updateFields,
            );
            responseData = simplifyResponse(responseData);
          } else if (operation === 'delete') {
            const webhookId = this.getNodeParameter('webhookId', i) as string;
            await postscriptApiRequest.call(
              this,
              'DELETE',
              `/webhooks/${webhookId}`,
            );
            responseData = { success: true };
          }
        }

        // Return results
        const executionData = this.helpers.constructExecutionMetaData(
          this.helpers.returnJsonArray(responseData as IDataObject[]),
          { itemData: { item: i } },
        );
        returnData.push(...executionData);
      } catch (error) {
        if (this.continueOnFail()) {
          const executionErrorData = this.helpers.constructExecutionMetaData(
            this.helpers.returnJsonArray({ error: (error as Error).message }),
            { itemData: { item: i } },
          );
          returnData.push(...executionErrorData);
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}
