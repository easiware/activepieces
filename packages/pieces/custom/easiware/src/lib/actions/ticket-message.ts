import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { easiwareAuth, easiwareAuthType } from '../..';
import { buildHeaders, sanitize, base, pageProp, limitProp } from './common';

/************************************
 * TICKET MESSAGES
 ***********************************/
export const searchTicketMessages = createAction({
  auth: easiwareAuth,
  name: 'search_ticket_messages',
  displayName: 'Search Ticket Messages',
  description: 'Search ticket messages with filters and pagination.',
  props: {
    agentId: Property.ShortText({
      displayName: 'Agent IDs',
      description: 'Comma-separated list of agent UUIDs.',
      required: false,
    }),
    page: pageProp,
    limit: limitProp,
    sort: Property.StaticDropdown({
      displayName: 'Sort',
      required: false,
      options: {
        disabled: false,
        options: [
          { label: 'Created At (ASC)', value: 'createdAt:ASC' },
          { label: 'Created At (DESC)', value: 'createdAt:DESC' },
          { label: 'Updated At (ASC)', value: 'updatedAt:ASC' },
          { label: 'Updated At (DESC)', value: 'updatedAt:DESC' },
        ],
      },
    }),
    search: Property.ShortText({ displayName: 'Search', required: false }),
    ticketId: Property.ShortText({ displayName: 'Ticket ID', required: false }),
    createdAfter: Property.DateTime({
      displayName: 'Created after',
      description: 'Return messages created after this date.',
      required: false,
    }),
    createdBefore: Property.DateTime({
      displayName: 'Created before',
      description: 'Return messages created before this date.',
      required: false,
    }),
    source: Property.StaticMultiSelectDropdown({
      displayName: 'Source',
      required: false,
      options: {
        disabled: false,
        options: [
          { label: 'Chat', value: 'chat' },
          { label: 'Email', value: 'email' },
          { label: 'Phone', value: 'phone' },
          { label: 'Webform', value: 'webform' },
          { label: 'WhatsApp', value: 'whatsapp' },
          { label: 'Suggestion', value: 'suggestion' },
        ],
      },
    }),
  },
  async run(ctx) {
    const { apiKey, appUrl } = ctx.auth as unknown as easiwareAuthType;
    const queryParams = sanitize(ctx.propsValue);
    const res = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url: `${base(appUrl)}/v1/ticket-messages`,
      headers: buildHeaders(apiKey),
      queryParams,
    });
    return res.status === 200 ? res.body : res;
  },
});

export const getTicketMessage = createAction({
  auth: easiwareAuth,
  name: 'get_ticket_message',
  displayName: 'Get Ticket Message',
  description: 'Retrieve a ticket message by its numeric ID.',
  props: {
    id: Property.Number({
      displayName: 'Message ID',
      description: 'The numeric identifier of the ticket message.',
      required: true,
    }),
  },
  async run(ctx) {
    const { apiKey, appUrl } = ctx.auth as unknown as easiwareAuthType;
    const res = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url: `${base(appUrl)}/v1/ticket-messages/${ctx.propsValue.id}`,
      headers: buildHeaders(apiKey),
    });
    return res.status === 200 ? res.body : res;
  },
});
