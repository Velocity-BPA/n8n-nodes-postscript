/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  IHookFunctions,
  IWebhookFunctions,
  INodeType,
  INodeTypeDescription,
  IWebhookResponseData,
  IDataObject,
} from 'n8n-workflow';

import {
  postscriptApiRequest,
  logLicensingNotice,
  getWebhookTopics,
} from './GenericFunctions';

export class PostscriptTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Postscript Trigger',
    name: 'postscriptTrigger',
    icon: 'file:postscript.svg',
    group: ['trigger'],
    version: 1,
    subtitle: '={{$parameter["event"]}}',
    description: 'Starts workflow when a Postscript event occurs',
    defaults: {
      name: 'Postscript Trigger',
    },
    inputs: [],
    outputs: ['main'],
    credentials: [
      {
        name: 'postscriptApi',
        required: true,
      },
    ],
    webhooks: [
      {
        name: 'default',
        httpMethod: 'POST',
        responseMode: 'onReceived',
        path: 'webhook',
      },
    ],
    properties: [
      {
        displayName: 'Event',
        name: 'event',
        type: 'options',
        required: true,
        options: getWebhookTopics(),
        default: 'subscriber.subscribed',
        description: 'The event to listen for',
      },
    ],
  };

  webhookMethods = {
    default: {
      async checkExists(this: IHookFunctions): Promise<boolean> {
        logLicensingNotice();

        const webhookUrl = this.getNodeWebhookUrl('default');
        const event = this.getNodeParameter('event') as string;

        try {
          const response = await postscriptApiRequest.call(
            this,
            'GET',
            '/webhooks',
          );

          const webhooks = response.data || response;
          if (Array.isArray(webhooks)) {
            const existingWebhook = webhooks.find(
              (webhook: IDataObject) =>
                webhook.url === webhookUrl && webhook.topic === event,
            );

            if (existingWebhook) {
              const webhookData = this.getWorkflowStaticData('node');
              webhookData.webhookId = existingWebhook.id;
              return true;
            }
          }
          return false;
        } catch (error) {
          return false;
        }
      },

      async create(this: IHookFunctions): Promise<boolean> {
        logLicensingNotice();

        const webhookUrl = this.getNodeWebhookUrl('default');
        const event = this.getNodeParameter('event') as string;

        const body: IDataObject = {
          url: webhookUrl,
          topic: event,
          format: 'json',
          active: true,
        };

        try {
          const response = await postscriptApiRequest.call(
            this,
            'POST',
            '/webhooks',
            body,
          );

          const webhookData = this.getWorkflowStaticData('node');
          const webhookResponse = response.data || response;
          webhookData.webhookId = webhookResponse.id;

          return true;
        } catch (error) {
          return false;
        }
      },

      async delete(this: IHookFunctions): Promise<boolean> {
        const webhookData = this.getWorkflowStaticData('node');
        const webhookId = webhookData.webhookId;

        if (!webhookId) {
          return true;
        }

        try {
          await postscriptApiRequest.call(
            this,
            'DELETE',
            `/webhooks/${webhookId}`,
          );
          delete webhookData.webhookId;
          return true;
        } catch (error) {
          return false;
        }
      },
    },
  };

  async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
    logLicensingNotice();

    const bodyData = this.getBodyData();
    const headerData = this.getHeaderData() as IDataObject;
    const req = this.getRequestObject();

    // Build comprehensive webhook payload
    const webhookPayload: IDataObject = {
      body: bodyData,
      headers: headerData,
      query: req.query,
    };

    // Extract key information from the body
    const event = this.getNodeParameter('event') as string;

    // Add event metadata
    webhookPayload.event = event;
    webhookPayload.receivedAt = new Date().toISOString();

    // Parse common fields from webhook payload
    if (typeof bodyData === 'object' && bodyData !== null) {
      const data = bodyData as IDataObject;

      // Subscriber data
      if (data.subscriber) {
        webhookPayload.subscriber = data.subscriber;
      }

      // Message data
      if (data.message) {
        webhookPayload.message = data.message;
      }

      // Event-specific data
      if (data.data) {
        webhookPayload.data = data.data;
      }
    }

    return {
      workflowData: [
        this.helpers.returnJsonArray(webhookPayload),
      ],
    };
  }
}
