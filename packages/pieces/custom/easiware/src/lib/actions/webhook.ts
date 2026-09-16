import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { easiwareAuth, easiwareAuthType } from '../..';
import { buildHeaders, sanitize, base, webhookEventTypeOptions } from './common';

/************************************
 * WEBHOOKS
 ***********************************/
export const listWebhooks = createAction({
  auth: easiwareAuth,
  name: 'list_webhooks',
  displayName: 'List Webhooks',
  description: 'Retrieve all webhooks configured for the organization.',
  props: {},
  async run(ctx) {
    const { apiKey, appUrl } = ctx.auth as unknown as easiwareAuthType;
    const res = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url: `${base(appUrl)}/v1/webhooks`,
      headers: buildHeaders(apiKey),
    });
    return res.status === 200 ? res.body : res;
  },
});

export const getWebhook = createAction({
  auth: easiwareAuth,
  name: 'get_webhook',
  displayName: 'Get Webhook',
  description: 'Retrieve a webhook by its ID.',
  props: {
    id: Property.ShortText({ displayName: 'Webhook ID', required: true }),
  },
  async run(ctx) {
    const { apiKey, appUrl } = ctx.auth as unknown as easiwareAuthType;
    const res = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url: `${base(appUrl)}/v1/webhooks/${ctx.propsValue.id}`,
      headers: buildHeaders(apiKey),
    });
    return res.status === 200 ? res.body : res;
  },
});

export const createWebhook = createAction({
  auth: easiwareAuth,
  name: 'create_webhook',
  displayName: 'Create Webhook',
  description: 'Create a new webhook subscription.',
  props: {
    category: Property.StaticDropdown({
      displayName: 'Category',
      required: true,
      options: {
        disabled: false,
        options: [
          { label: 'Contact', value: 'contact' },
          { label: 'Ticket', value: 'ticket' },
        ],
      },
    }),
    eventType: Property.StaticDropdown({
      displayName: 'Event Type',
      required: false,
      options: {
        disabled: false,
        options: webhookEventTypeOptions,
      },
    }),
    url: Property.ShortText({
      displayName: 'URL',
      description: 'The URL that will receive webhook payloads (must be a valid URI).',
      required: true,
    }),
  },
  async run(ctx) {
    const { apiKey, appUrl } = ctx.auth as unknown as easiwareAuthType;
    const body = sanitize(ctx.propsValue);
    const res = await httpClient.sendRequest({
      method: HttpMethod.POST,
      url: `${base(appUrl)}/v1/webhooks`,
      headers: buildHeaders(apiKey),
      body,
    });
    return res.status === 201 ? res.body : res;
  },
});

export const updateWebhook = createAction({
  auth: easiwareAuth,
  name: 'update_webhook',
  displayName: 'Update Webhook',
  description: 'Partially update an existing webhook.',
  props: {
    id: Property.ShortText({ displayName: 'Webhook ID', required: true }),
    category: Property.StaticDropdown({
      displayName: 'Category',
      required: false,
      options: {
        disabled: false,
        options: [
          { label: 'Contact', value: 'contact' },
          { label: 'Ticket', value: 'ticket' },
        ],
      },
    }),
    eventType: Property.StaticDropdown({
      displayName: 'Event Type',
      required: false,
      options: {
        disabled: false,
        options: webhookEventTypeOptions,
      },
    }),
    url: Property.ShortText({
      displayName: 'URL',
      description: 'The URL that will receive webhook payloads (must be a valid URI).',
      required: false,
    }),
  },
  async run(ctx) {
    const { apiKey, appUrl } = ctx.auth as unknown as easiwareAuthType;
    const { id, ...rest } = ctx.propsValue;
    const body = sanitize(rest);
    const res = await httpClient.sendRequest({
      method: HttpMethod.PATCH,
      url: `${base(appUrl)}/v1/webhooks/${id}`,
      headers: buildHeaders(apiKey),
      body,
    });
    return res.status === 200 ? res.body : res;
  },
});

export const detachWebhook = createAction({
  auth: easiwareAuth,
  name: 'detach_webhook',
  displayName: 'Detach Webhook',
  description: 'Detach a webhook subscription (stops it from receiving events).',
  props: {
    id: Property.ShortText({ displayName: 'Webhook ID', required: true }),
  },
  async run(ctx) {
    const { apiKey, appUrl } = ctx.auth as unknown as easiwareAuthType;
    const res = await httpClient.sendRequest({
      method: HttpMethod.POST,
      url: `${base(appUrl)}/v1/webhooks/${ctx.propsValue.id}/detach`,
      headers: buildHeaders(apiKey),
    });
    return res.status === 201 ? true : res;
  },
});

export const deleteWebhook = createAction({
  auth: easiwareAuth,
  name: 'delete_webhook',
  displayName: 'Delete Webhook',
  description: 'Permanently delete a webhook.',
  props: {
    id: Property.ShortText({ displayName: 'Webhook ID', required: true }),
  },
  async run(ctx) {
    const { apiKey, appUrl } = ctx.auth as unknown as easiwareAuthType;
    const res = await httpClient.sendRequest({
      method: HttpMethod.DELETE,
      url: `${base(appUrl)}/v1/webhooks/${ctx.propsValue.id}`,
      headers: buildHeaders(apiKey),
    });
    return res.status === 200 ? res.body : res;
  },
});
