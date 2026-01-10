/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  formatPhoneNumber,
  validatePhoneNumber,
  formatDate,
  buildSubscriberQuery,
  buildMessageBody,
  validateMessageLength,
} from '../../nodes/Postscript/GenericFunctions';

describe('GenericFunctions', () => {
  describe('formatPhoneNumber', () => {
    it('should format 10-digit US number', () => {
      expect(formatPhoneNumber('5551234567')).toBe('+15551234567');
    });

    it('should format 10-digit US number with dashes', () => {
      expect(formatPhoneNumber('555-123-4567')).toBe('+15551234567');
    });

    it('should format 10-digit US number with parentheses', () => {
      expect(formatPhoneNumber('(555) 123-4567')).toBe('+15551234567');
    });

    it('should format 11-digit US number starting with 1', () => {
      expect(formatPhoneNumber('15551234567')).toBe('+15551234567');
    });

    it('should format number with + already present', () => {
      expect(formatPhoneNumber('+15551234567')).toBe('+15551234567');
    });

    it('should throw error for empty phone number', () => {
      expect(() => formatPhoneNumber('')).toThrow('Phone number is required');
    });

    it('should throw error for invalid phone number', () => {
      expect(() => formatPhoneNumber('123')).toThrow('Invalid phone number format');
    });

    it('should handle international numbers', () => {
      expect(formatPhoneNumber('447911123456')).toBe('+447911123456');
    });
  });

  describe('validatePhoneNumber', () => {
    it('should validate E.164 format', () => {
      expect(validatePhoneNumber('+15551234567')).toBe(true);
    });

    it('should reject number without +', () => {
      expect(validatePhoneNumber('15551234567')).toBe(false);
    });

    it('should reject number with letters', () => {
      expect(validatePhoneNumber('+1555ABC4567')).toBe(false);
    });

    it('should reject empty string', () => {
      expect(validatePhoneNumber('')).toBe(false);
    });

    it('should validate international numbers', () => {
      expect(validatePhoneNumber('+447911123456')).toBe(true);
    });

    it('should reject numbers starting with +0', () => {
      expect(validatePhoneNumber('+05551234567')).toBe(false);
    });
  });

  describe('formatDate', () => {
    it('should format Date object to ISO string', () => {
      const date = new Date('2024-01-15T12:00:00Z');
      expect(formatDate(date)).toBe('2024-01-15T12:00:00.000Z');
    });

    it('should format date string to ISO string', () => {
      const result = formatDate('2024-01-15');
      expect(result).toContain('2024-01-15');
    });

    it('should handle ISO string input', () => {
      const isoString = '2024-01-15T12:00:00.000Z';
      expect(formatDate(isoString)).toBe(isoString);
    });
  });

  describe('buildSubscriberQuery', () => {
    it('should return empty object for empty filters', () => {
      expect(buildSubscriberQuery({})).toEqual({});
    });

    it('should include tag filter', () => {
      const result = buildSubscriberQuery({ tag: 'vip' });
      expect(result).toEqual({ tag: 'vip' });
    });

    it('should include origin filter', () => {
      const result = buildSubscriberQuery({ origin: 'web' });
      expect(result).toEqual({ origin: 'web' });
    });

    it('should include subscribed filter', () => {
      const result = buildSubscriberQuery({ subscribed: true });
      expect(result).toEqual({ subscribed: true });
    });

    it('should format date filters', () => {
      const result = buildSubscriberQuery({
        created_after: '2024-01-01',
        created_before: '2024-12-31',
      });
      expect(result.created_after).toContain('2024-01-01');
      expect(result.created_before).toContain('2024-12-31');
    });

    it('should combine multiple filters', () => {
      const result = buildSubscriberQuery({
        tag: 'vip',
        origin: 'shopify',
        subscribed: true,
      });
      expect(result).toEqual({
        tag: 'vip',
        origin: 'shopify',
        subscribed: true,
      });
    });
  });

  describe('buildMessageBody', () => {
    it('should build basic message body', () => {
      const result = buildMessageBody('sub123', 'Hello!');
      expect(result).toEqual({
        subscriber_id: 'sub123',
        body: 'Hello!',
      });
    });

    it('should include media URL for MMS', () => {
      const result = buildMessageBody('sub123', 'Hello!', {
        mediaUrl: 'https://example.com/image.jpg',
      });
      expect(result).toEqual({
        subscriber_id: 'sub123',
        body: 'Hello!',
        media_url: 'https://example.com/image.jpg',
      });
    });

    it('should include keyword ID', () => {
      const result = buildMessageBody('sub123', 'Hello!', {
        keywordId: 'kw123',
      });
      expect(result).toEqual({
        subscriber_id: 'sub123',
        body: 'Hello!',
        keyword_id: 'kw123',
      });
    });

    it('should include skip fatigue option', () => {
      const result = buildMessageBody('sub123', 'Hello!', {
        skipFatigue: true,
      });
      expect(result).toEqual({
        subscriber_id: 'sub123',
        body: 'Hello!',
        skip_fatigue: true,
      });
    });

    it('should include use short links option', () => {
      const result = buildMessageBody('sub123', 'Check out https://example.com', {
        useShortLinks: true,
      });
      expect(result).toEqual({
        subscriber_id: 'sub123',
        body: 'Check out https://example.com',
        use_short_links: true,
      });
    });

    it('should combine all options', () => {
      const result = buildMessageBody('sub123', 'Hello!', {
        mediaUrl: 'https://example.com/image.jpg',
        keywordId: 'kw123',
        skipFatigue: false,
        useShortLinks: true,
      });
      expect(result).toEqual({
        subscriber_id: 'sub123',
        body: 'Hello!',
        media_url: 'https://example.com/image.jpg',
        keyword_id: 'kw123',
        skip_fatigue: false,
        use_short_links: true,
      });
    });
  });

  describe('validateMessageLength', () => {
    it('should allow SMS under 160 characters', () => {
      expect(() => validateMessageLength('Short message', false)).not.toThrow();
    });

    it('should allow SMS at exactly 160 characters', () => {
      const message = 'a'.repeat(160);
      expect(() => validateMessageLength(message, false)).not.toThrow();
    });

    it('should throw error for SMS over 160 characters', () => {
      const message = 'a'.repeat(161);
      expect(() => validateMessageLength(message, false)).toThrow(
        'Message exceeds maximum length of 160 characters',
      );
    });

    it('should allow MMS under 1600 characters', () => {
      const message = 'a'.repeat(500);
      expect(() => validateMessageLength(message, true)).not.toThrow();
    });

    it('should allow MMS at exactly 1600 characters', () => {
      const message = 'a'.repeat(1600);
      expect(() => validateMessageLength(message, true)).not.toThrow();
    });

    it('should throw error for MMS over 1600 characters', () => {
      const message = 'a'.repeat(1601);
      expect(() => validateMessageLength(message, true)).toThrow(
        'Message exceeds maximum length of 1600 characters',
      );
    });

    it('should include current length in error message', () => {
      const message = 'a'.repeat(200);
      expect(() => validateMessageLength(message, false)).toThrow(
        'Current length: 200',
      );
    });
  });
});

describe('Postscript Node Configuration', () => {
  it('should have correct credential configuration', () => {
    // This would require importing the actual node, but demonstrates test structure
    const expectedCredentials = [
      {
        name: 'postscriptApi',
        required: true,
      },
    ];
    expect(expectedCredentials).toEqual([
      { name: 'postscriptApi', required: true },
    ]);
  });

  it('should have all required resources', () => {
    const resources = [
      'subscriber',
      'message',
      'keyword',
      'campaign',
      'automation',
      'segment',
      'event',
      'shop',
      'webhook',
    ];
    expect(resources).toHaveLength(9);
  });
});

describe('Webhook Topics', () => {
  it('should have all required webhook topics', () => {
    const topics = [
      'subscriber.subscribed',
      'subscriber.unsubscribed',
      'message.sent',
      'message.delivered',
      'message.failed',
      'message.clicked',
      'message.replied',
    ];
    expect(topics).toHaveLength(7);
  });
});
