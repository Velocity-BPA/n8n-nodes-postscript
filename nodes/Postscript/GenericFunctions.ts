/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  IExecuteFunctions,
  IHookFunctions,
  ILoadOptionsFunctions,
  IWebhookFunctions,
  IHttpRequestMethods,
  IHttpRequestOptions,
  IDataObject,
  NodeApiError,
  NodeOperationError,
} from 'n8n-workflow';

const BASE_URL = 'https://api.postscript.io/api/v2';
const PARTNER_API_URL = 'https://api.postscript.io/partners/api';

/**
 * Make an authenticated request to the Postscript API
 */
export async function postscriptApiRequest(
  this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions | IWebhookFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body: IDataObject = {},
  query: IDataObject = {},
  uri?: string,
): Promise<any> {
  const credentials = await this.getCredentials('postscriptApi');

  const options: IHttpRequestOptions = {
    method,
    url: uri || `${BASE_URL}${endpoint}`,
    headers: {
      'Authorization': `Bearer ${credentials.apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    json: true,
  };

  if (Object.keys(body).length > 0) {
    options.body = body;
  }

  if (Object.keys(query).length > 0) {
    options.qs = query;
  }

  try {
    const response = await this.helpers.httpRequest(options);
    return response;
  } catch (error: any) {
    if (error.response) {
      const errorMessage = error.response.body?.error?.message || 
                          error.response.body?.message ||
                          error.message;
      const errorCode = error.response.body?.error?.code || 
                       error.response.statusCode;
      
      throw new NodeApiError(this.getNode(), error, {
        message: `Postscript API Error: ${errorMessage}`,
        description: `Error Code: ${errorCode}`,
        httpCode: error.response.statusCode?.toString(),
      });
    }
    throw new NodeOperationError(this.getNode(), error);
  }
}

/**
 * Make a request to the Postscript Partner API
 */
export async function postscriptPartnerApiRequest(
  this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body: IDataObject = {},
  query: IDataObject = {},
): Promise<any> {
  return postscriptApiRequest.call(
    this,
    method,
    endpoint,
    body,
    query,
    `${PARTNER_API_URL}${endpoint}`,
  );
}

/**
 * Handle pagination and return all results
 */
export async function postscriptApiRequestAllItems(
  this: IExecuteFunctions | ILoadOptionsFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body: IDataObject = {},
  query: IDataObject = {},
  dataKey = 'data',
): Promise<any[]> {
  const returnData: any[] = [];
  let page = 1;
  const limit = 100;
  let hasMore = true;

  while (hasMore) {
    const response = await postscriptApiRequest.call(
      this,
      method,
      endpoint,
      body,
      { ...query, page, limit },
    );

    const items = response[dataKey] || response;
    if (Array.isArray(items)) {
      returnData.push(...items);
    }

    const meta = response.meta;
    if (meta) {
      hasMore = meta.page * meta.limit < meta.total;
      page++;
    } else {
      hasMore = false;
    }

    // Rate limiting protection
    if (hasMore) {
      await sleep(100);
    }
  }

  return returnData;
}

/**
 * Format phone number to E.164 format
 */
export function formatPhoneNumber(phone: string): string {
  if (!phone) {
    throw new Error('Phone number is required');
  }

  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');

  // Handle different formats
  if (cleaned.length === 10) {
    // US number without country code
    return `+1${cleaned}`;
  } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    // US number with country code but no +
    return `+${cleaned}`;
  } else if (cleaned.length > 10) {
    // International number
    return `+${cleaned}`;
  }

  throw new Error(`Invalid phone number format: ${phone}. Expected 10+ digits.`);
}

/**
 * Validate phone number is in E.164 format
 */
export function validatePhoneNumber(phone: string): boolean {
  const e164Regex = /^\+[1-9]\d{1,14}$/;
  return e164Regex.test(phone);
}

/**
 * Format date to ISO 8601 format
 */
export function formatDate(date: string | Date): string {
  if (date instanceof Date) {
    return date.toISOString();
  }
  return new Date(date).toISOString();
}

/**
 * Parse Postscript error response
 */
export function parsePostscriptError(error: any): { code: string; message: string } {
  if (error.error) {
    return {
      code: error.error.code || 'unknown_error',
      message: error.error.message || 'An unknown error occurred',
    };
  }
  return {
    code: 'unknown_error',
    message: error.message || 'An unknown error occurred',
  };
}

/**
 * Build query parameters for subscriber filtering
 */
export function buildSubscriberQuery(filters: IDataObject): IDataObject {
  const query: IDataObject = {};

  if (filters.tag) {
    query.tag = filters.tag;
  }
  if (filters.origin) {
    query.origin = filters.origin;
  }
  if (filters.subscribed !== undefined) {
    query.subscribed = filters.subscribed;
  }
  if (filters.created_after) {
    query.created_after = formatDate(filters.created_after as string);
  }
  if (filters.created_before) {
    query.created_before = formatDate(filters.created_before as string);
  }

  return query;
}

/**
 * Build message body with proper formatting
 */
export function buildMessageBody(
  subscriberId: string,
  message: string,
  options: IDataObject = {},
): IDataObject {
  const body: IDataObject = {
    subscriber_id: subscriberId,
    body: message,
  };

  if (options.mediaUrl) {
    body.media_url = options.mediaUrl;
  }
  if (options.keywordId) {
    body.keyword_id = options.keywordId;
  }
  if (options.skipFatigue !== undefined) {
    body.skip_fatigue = options.skipFatigue;
  }
  if (options.useShortLinks !== undefined) {
    body.use_short_links = options.useShortLinks;
  }

  return body;
}

/**
 * Validate message length
 */
export function validateMessageLength(message: string, isMMS: boolean): void {
  const maxLength = isMMS ? 1600 : 160;
  if (message.length > maxLength) {
    throw new Error(
      `Message exceeds maximum length of ${maxLength} characters. Current length: ${message.length}`,
    );
  }
}

/**
 * Sleep utility for rate limiting
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Simplify response data
 */
export function simplifyResponse(response: any, dataKey = 'data'): any {
  if (response && response[dataKey]) {
    return response[dataKey];
  }
  return response;
}

/**
 * Get webhook topics
 */
export function getWebhookTopics(): Array<{ name: string; value: string }> {
  return [
    { name: 'Subscriber Subscribed', value: 'subscriber.subscribed' },
    { name: 'Subscriber Unsubscribed', value: 'subscriber.unsubscribed' },
    { name: 'Message Sent', value: 'message.sent' },
    { name: 'Message Delivered', value: 'message.delivered' },
    { name: 'Message Failed', value: 'message.failed' },
    { name: 'Message Clicked', value: 'message.clicked' },
    { name: 'Message Replied', value: 'message.replied' },
  ];
}

/**
 * Log licensing notice (once per session)
 */
let licenseLogged = false;
export function logLicensingNotice(): void {
  if (!licenseLogged) {
    // eslint-disable-next-line no-console
    console.warn(`[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.`);
    licenseLogged = true;
  }
}
