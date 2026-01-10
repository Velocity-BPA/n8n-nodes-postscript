/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

export interface IPostscriptSubscriber {
  id?: string;
  phone_number: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  tags?: string[];
  properties?: Record<string, any>;
  origin?: 'web' | 'api' | 'shopify';
  created_at?: string;
  updated_at?: string;
  subscribed?: boolean;
}

export interface IPostscriptMessage {
  id?: string;
  subscriber_id: string;
  body: string;
  media_url?: string;
  keyword_id?: string;
  skip_fatigue?: boolean;
  use_short_links?: boolean;
  status?: 'pending' | 'sent' | 'delivered' | 'failed';
  sent_at?: string;
  delivered_at?: string;
}

export interface IPostscriptKeyword {
  id?: string;
  keyword: string;
  response_message?: string;
  tag_ids?: string[];
  automation_id?: string;
  active?: boolean;
  created_at?: string;
}

export interface IPostscriptCampaign {
  id?: string;
  name: string;
  message?: string;
  segment_id?: string;
  send_at?: string;
  status?: 'draft' | 'scheduled' | 'sending' | 'sent';
  created_at?: string;
  updated_at?: string;
}

export interface IPostscriptAutomation {
  id?: string;
  name: string;
  trigger_type?: 'keyword' | 'event' | 'signup';
  status?: 'active' | 'paused' | 'draft';
  created_at?: string;
  updated_at?: string;
}

export interface IPostscriptSegment {
  id?: string;
  name: string;
  conditions?: ISegmentCondition[];
  subscriber_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ISegmentCondition {
  field: string;
  operator: string;
  value: any;
}

export interface IPostscriptEvent {
  subscriber_id?: string;
  phone_number?: string;
  event_type: string;
  properties?: Record<string, any>;
  occurred_at?: string;
}

export interface IPostscriptShop {
  id?: string;
  name: string;
  domain?: string;
  phone_number?: string;
  timezone?: string;
  created_at?: string;
}

export interface IPostscriptWebhook {
  id?: string;
  url: string;
  topic: WebhookTopic;
  format?: 'json';
  active?: boolean;
  created_at?: string;
}

export type WebhookTopic =
  | 'subscriber.subscribed'
  | 'subscriber.unsubscribed'
  | 'message.sent'
  | 'message.delivered'
  | 'message.failed'
  | 'message.clicked'
  | 'message.replied';

export interface IPostscriptApiResponse<T> {
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface IPostscriptError {
  error: {
    code: string;
    message: string;
  };
}

export interface IPostscriptStats {
  total_subscribers?: number;
  active_subscribers?: number;
  total_messages_sent?: number;
  total_revenue?: number;
  click_rate?: number;
  conversion_rate?: number;
}

export type PostscriptResource =
  | 'subscriber'
  | 'message'
  | 'keyword'
  | 'campaign'
  | 'automation'
  | 'segment'
  | 'event'
  | 'shop'
  | 'webhook';

export type SubscriberOperation =
  | 'getAll'
  | 'get'
  | 'create'
  | 'update'
  | 'unsubscribe'
  | 'getByPhone'
  | 'addTag'
  | 'removeTag'
  | 'updateProperties';

export type MessageOperation =
  | 'getAll'
  | 'get'
  | 'send'
  | 'sendMMS'
  | 'getStats';

export type KeywordOperation =
  | 'getAll'
  | 'get'
  | 'create'
  | 'update'
  | 'delete';

export type CampaignOperation =
  | 'getAll'
  | 'get'
  | 'getStats'
  | 'schedule';

export type AutomationOperation =
  | 'getAll'
  | 'get'
  | 'getStats'
  | 'trigger'
  | 'enable'
  | 'disable';

export type SegmentOperation =
  | 'getAll'
  | 'get'
  | 'create'
  | 'getSubscribers'
  | 'getCount';

export type EventOperation =
  | 'track'
  | 'trackEcommerce'
  | 'getTypes';

export type ShopOperation =
  | 'get'
  | 'getStats'
  | 'getComplianceSettings';

export type WebhookOperation =
  | 'getAll'
  | 'create'
  | 'update'
  | 'delete';
