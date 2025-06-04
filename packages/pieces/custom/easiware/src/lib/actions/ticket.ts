import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { easiwareAuth } from '../..';

export const getTicketFromID = createAction({
  auth: easiwareAuth,
  name: 'get_ticket_from_id',
  displayName: 'Get a Ticket',
  description: 'Retrieve a ticket by its ID.',
  props: {
    ticketId: Property.ShortText({
      displayName: 'Ticket ID',
      description: 'The ID number of the ticket',
      required: true,
    }),
  },
  async run(context) {
    const token = context.auth.apiKey;
    const id = context.propsValue.ticketId;
    const baseUrl = context.auth.appUrl.replace(/\/$/, '');
    const url = `${baseUrl}/v1/tickets/${id}`;

    const response = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url,
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    });
    return response.status === 200 ? response.body : response;
  },
});


export const searchTickets = createAction({
  auth: easiwareAuth,
  name: 'search_tickets',
  displayName: 'Search Tickets',
  description: 'Search your organization’s tickets with all available filters.',
  props: {
    search: Property.ShortText({
      displayName: 'Free text',
      description: 'Full-text search on subject, messages and contact fields.',
      required: false,
    }),
    contactId: Property.ShortText({
      displayName: 'Contact IDs',
      description: 'Comma-separated list of contact IDs.',
      required: false,
    }),
    agentId: Property.ShortText({
      displayName: 'Agent IDs',
      description: 'Comma-separated list of agent IDs.',
      required: false,
    }),
    categoryId: Property.ShortText({
      displayName: 'Category IDs',
      description: 'Comma-separated list of category IDs.',
      required: false,
    }),
    originalRecipientEmailAddress: Property.ShortText({
      displayName: 'Original recipient emails',
      description: 'Filter email tickets by the original “To:” address.',
      required: false,
    }),

    status: Property.StaticMultiSelectDropdown({
      displayName: 'Status',
      description: 'Ticket status: new, in_progress, waiting, closed.',
      required: false,
      options: {
        options: [
          { label: 'New', value: 'new' },
          { label: 'In progress', value: 'in_progress' },
          { label: 'Waiting', value: 'waiting' },
          { label: 'Closed', value: 'closed' },
        ],
      },
    }),
    priority: Property.StaticMultiSelectDropdown({
      displayName: 'Priority',
      description: 'Ticket priority: low, medium, high.',
      required: false,
      options: {
        options: [
          { label: 'Low', value: 'low' },
          { label: 'Medium', value: 'medium' },
          { label: 'High', value: 'high' },
        ],
      },
    }),
    source: Property.StaticMultiSelectDropdown({
      displayName: 'Source',
      description: 'Channel that created the ticket.',
      required: false,
      options: {
        options: [
      { label: 'Chat', value: 'chat' },
          { label: 'Email', value: 'email' },
          { label: 'Phone', value: 'phone' },
          { label: 'Webform', value: 'webform' },
        ],
      },
    }),

    deleted: Property.StaticDropdown({
      displayName: 'Include deleted tickets',
      description: 'true = include soft-deleted tickets.',
      required: false,
      options: {
        options: [
          { label: 'False (default)', value: 'false' },
          { label: 'True', value: 'true' },
        ],
      },
    }),
    unassigned: Property.StaticDropdown({
      displayName: 'Only unassigned',
      description: 'true = tickets with no agent assigned.',
      required: false,
      options: {
        options: [
          { label: 'False (default)', value: 'false' },
          { label: 'True', value: 'true' },
        ],
      },
    }),

    createdAfter: Property.ShortText({
      displayName: 'Created after',
      description: 'ISO-8601 date-time (e.g. 2025-05-01T00:00:00Z).',
      required: false,
    }),
    createdBefore: Property.ShortText({
      displayName: 'Created before',
      description: 'ISO-8601 date-time.',
      required: false,
    }),
    updatedAfter: Property.ShortText({
      displayName: 'Updated after',
      description: 'ISO-8601 date-time.',
      required: false,
    }),
    updatedBefore: Property.ShortText({
      displayName: 'Updated before',
      description: 'ISO-8601 date-time.',
      required: false,
    }),

    customFieldsValues: Property.Json({
      displayName: 'Custom fields (JSON)',
      description:
        'Key-value filters on custom ticket fields (must exist beforehand).',
      required: false,
      defaultValue: {},
    }),
  },

  async run(context) {
    const token = context.auth.apiKey;
    const props = context.propsValue;
    const baseUrl = context.auth.appUrl.replace(/\/$/, '');

    // Création d'un tableau pour les paramètres de requête
    const queryParams: Array<{ key: string; value: string }> = [];

    // Helper pour les valeurs CSV
    const parseCsv = (val?: string): string[] =>
      val?.split(',').map(v => v.trim()).filter(Boolean) || [];

    // Fonction pour ajouter des paramètres
    const addParam = (key: string, value: string | string[] | undefined) => {
      if (!value) return;

      if (Array.isArray(value)) {
        value.forEach(v => queryParams.push({ key, value: v }));
      } else {
        queryParams.push({ key, value });
      }
    };

    // Gestion des paramètres textuels
    if (props.search) addParam('search', props.search);

    // Gestion des paramètres CSV
    const csvFields = [
      { key: 'contactId', value: props.contactId },
      { key: 'agentId', value: props.agentId },
      { key: 'categoryId', value: props.categoryId },
      { key: 'originalRecipientEmailAddress', value: props.originalRecipientEmailAddress }
    ];

    csvFields.forEach(({ key, value }) => {
      if (value) addParam(key, parseCsv(value));
    });

    // Gestion des multi-selects
    const multiSelects = [
      { key: 'status', value: props.status },
      { key: 'priority', value: props.priority },
      { key: 'source', value: props.source }
    ];

    multiSelects.forEach(({ key, value }) => {
      if (value && value.length > 0) addParam(key, value);
    });

    // Gestion des booléens
    if (props.deleted) addParam('deleted', props.deleted);
    if (props.unassigned) addParam('unassigned', props.unassigned);

    // Gestion des dates
    const dateFields = [
      { key: 'createdAfter', value: props.createdAfter },
      { key: 'createdBefore', value: props.createdBefore },
      { key: 'updatedAfter', value: props.updatedAfter },
      { key: 'updatedBefore', value: props.updatedBefore }
    ];

    dateFields.forEach(({ key, value }) => {
      if (value) addParam(key, value);
    });

    // Gestion des champs personnalisés
    if (props.customFieldsValues && Object.keys(props.customFieldsValues).length > 0) {
      addParam('customFieldsValues', JSON.stringify(props.customFieldsValues));
    }

    // Conversion en format attendu par Activepieces
    const formattedQueryParams: Record<string, string> = {};
    queryParams.forEach(param => {
      if (formattedQueryParams[param.key]) {
        formattedQueryParams[param.key] += `,${param.value}`;
      } else {
        formattedQueryParams[param.key] = param.value;
      }
    });

    const url = `${baseUrl}/v1/tickets`;

    const response = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      queryParams: formattedQueryParams,
    });

    return response.status === 200 ? response.body : response;
  },
});


export const createTicket = createAction({
  auth: easiwareAuth,
  name: 'create_ticket',
  displayName: 'Create Ticket',
  description: 'Create a new ticket in easiware.',

  props: {
    source: Property.StaticDropdown({
      displayName: 'Source*',
      description: 'Channel that originated the ticket.',
      required: true,
      options: {
        options: [
          { label: 'Chat', value: 'chat' },
          { label: 'Email', value: 'email' },
          { label: 'Phone', value: 'phone' },
          { label: 'Webform', value: 'webform' },
        ],
      },
    }),

    subject: Property.ShortText({
      displayName: 'Subject',
      description: 'Ticket title or subject line.',
      required: false,
    }),

    status: Property.StaticDropdown({
      displayName: 'Status',
      description: 'Initial workflow status of the ticket.',
      required: false,
      options: {
        options: [
          { label: 'New', value: 'new' },
          { label: 'In progress', value: 'in_progress' },
          { label: 'Waiting', value: 'waiting' },
          { label: 'Closed', value: 'closed' },
        ],
      },
    }),

    priority: Property.StaticDropdown({
      displayName: 'Priority',
      description: 'Initial importance level of the ticket.',
      required: false,
      options: {
        options: [
          { label: 'Low', value: 'low' },
          { label: 'Medium', value: 'medium' },
          { label: 'High', value: 'high' },
        ],
      },
    }),

    contactId: Property.ShortText({
      displayName: 'Contact ID',
      description: 'Identifier of the contact linked to the ticket.',
      required: false,
    }),

    agentId: Property.ShortText({
      displayName: 'Agent ID',
      description: 'Identifier of the agent assigned to the ticket (optional).',
      required: false,
    }),

    categoryId: Property.ShortText({
      displayName: 'Category ID',
      description: 'Identifier of the category assigned to the ticket.',
      required: false,
    }),

    originalRecipientEmailAddress: Property.ShortText({
      displayName: 'Original recipient (email)',
      description: 'Original “To” address when the source is Email.',
      required: false,
    }),

    customFieldsValues: Property.Json({
      displayName: 'Custom fields (JSON)',
      description: 'Key-value map of custom field values. The fields must exist in easiware beforehand.',
      required: false,
      defaultValue: {},
    }),
  },

  async run(context) {
    const token = context.auth.apiKey;
    const baseUrl = context.auth.appUrl.replace(/\/$/, '');

    // Build request body with only provided props
    const body: Record<string, unknown> = { source: context.propsValue.source };
    [
      'subject',
      'status',
      'priority',
      'contactId',
      'agentId',
      'categoryId',
      'originalRecipientEmailAddress',
      'customFieldsValues',
    ].forEach((k) => {
      const v = (context.propsValue as any)[k];
      if (v !== undefined && v !== null && v !== '') body[k] = v;
    });

    const response = await httpClient.sendRequest({
      method: HttpMethod.POST,
      url: `${baseUrl}/v1/tickets`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body,
    });

    return response.status === 201 ? response.body : response;
  },
});



export const updateTicket = createAction({
  auth: easiwareAuth,
  name: 'update_ticket',
  displayName: 'Update Ticket',
  description: 'Partially update an existing ticket.',
  props: {
    ticketId: Property.ShortText({
      displayName: 'Ticket ID',
      description: 'Unique identifier of the ticket to update.',
      required: true,
    }),
    subject: Property.ShortText({
      displayName: 'Subject',
      description: 'New subject of the ticket (leave empty to keep current one).',
      required: false,
    }),
    status: Property.StaticDropdown({
      displayName: 'Status',
      description: 'Lifecycle status to set for the ticket.',
      required: false,
      options: {
        options: [
          { label: 'New', value: 'new' },
          { label: 'In progress', value: 'in_progress' },
          { label: 'Waiting', value: 'waiting' },
          { label: 'Closed', value: 'closed' },
        ],
      },
    }),
    priority: Property.StaticDropdown({
      displayName: 'Priority',
      description: 'Priority level to apply.',
      required: false,
      options: {
        options: [
          { label: 'Low', value: 'low' },
          { label: 'Medium', value: 'medium' },
          { label: 'High', value: 'high' },
        ],
      },
    }),
    contactId: Property.ShortText({
      displayName: 'Contact ID',
      description: 'Identifier of the contact linked to the ticket.',
      required: false,
    }),
    categoryId: Property.ShortText({
      displayName: 'Category ID',
      description: 'Identifier of the category (folder) in which the ticket is filed.',
      required: false,
    }),
    customFieldsValues: Property.Json({
      displayName: 'Custom fields (JSON)',
      description: 'Key–value map of custom field identifiers and their new values.',
      required: false,
      defaultValue: {},
    }),
  },

  async run(context) {
    const token = context.auth.apiKey;
    const id = context.propsValue.ticketId;
    const baseUrl = context.auth.appUrl.replace(/\/$/, '');

    /* Build PATCH payload with only provided fields */
    const body: Record<string, unknown> = {};
    [
      'subject',
      'status',
      'priority',
      'contactId',
      'categoryId',
      'customFieldsValues',
    ].forEach((k) => {
      const v = (context.propsValue as any)[k];
      if (v !== undefined && v !== null && v !== '') body[k] = v;
    });

    const response = await httpClient.sendRequest({
      method: HttpMethod.PATCH,
      url: `${baseUrl}/v1/tickets/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body,
    });

    return response.status === 200 ? response.body : response;
  },
});


export const getTicketMessages = createAction({
  auth: easiwareAuth,
  name: 'get_ticket_messages',
  displayName: 'Get Ticket Messages',
  description:
    "Retrieve every message (emails, chats, notes, etc.) that belongs to a ticket by its easiware ID.",

  props: {
    ticketId: Property.ShortText({
      displayName: 'Ticket ID',
      description:
        "The easiware internal identifier of the ticket whose message history you wish to fetch.",
      required: true,
    }),
  },

  async run(context) {
    const token = context.auth.apiKey;
    const id = context.propsValue.ticketId;

    const baseUrl = context.auth.appUrl.replace(/\/$/, '');
    const url = `${baseUrl}/v1/tickets/${id}/messages`;

    const response = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.status === 200 ? response.body : response;
  },
});


export const addMessageToTicket = createAction({
  auth: easiwareAuth,
  name: 'add_ticket_message',
  displayName: 'Add Ticket Message',
  description: 'Append a new message to the specified ticket.',

  props: {
    ticketId: Property.ShortText({
      displayName: 'Ticket ID',
      description: 'easiware internal identifier of the ticket that will receive the message.',
      required: true,
    }),

    source: Property.StaticDropdown({
      displayName: 'Source*',
      description: 'Channel used to send the message — required by the API.',
      required: true,
      options: {
        options: [
          { label: 'Chat',   value: 'chat'   },
          { label: 'Email',  value: 'email'  },
          { label: 'Phone',  value: 'phone'  },
          { label: 'Webform',value: 'webform'},
        ],
      },
    }),

    subject: Property.ShortText({
      displayName: 'Subject',
      description: 'Optional subject of the message (mostly for email-like channels).',
      required: false,
    }),

    content: Property.LongText({
      displayName: 'Content (Plain-text)*',
      description: 'Plain-text body of the message.',
      required: true,
    }),

    contentHtml: Property.LongText({
      displayName: 'Content (HTML)',
      description: 'Rich-text/HTML version of the message. The API sanitises it to avoid XSS.',
      required: false,
    }),

    agentId: Property.ShortText({
      displayName: 'Agent ID',
      description: 'Identifier of the agent author. Leave empty to mark the message as coming from the ticket’s contact.:contentReference[oaicite:1]{index=1}',
      required: false,
    }),

    originalRecipientEmailAddress: Property.ShortText({
      displayName: 'Original recipient (Email channel)',
      description: 'The original “To” email address, useful when a ticket aggregates several aliases.',
      required: false,
    }),
  },

  async run(context) {
    const token   = context.auth.apiKey;
    const id      = context.propsValue.ticketId;
    const baseUrl = context.auth.appUrl.replace(/\/$/, '');

    const body: Record<string, unknown> = {
      source : context.propsValue.source,
      content: context.propsValue.content,
    };

    [
      'subject',
      'contentHtml',
      'agentId',
      'originalRecipientEmailAddress',
    ].forEach((k) => {
      const v = (context.propsValue as any)[k];
      if (v !== undefined && v !== null && v !== '') body[k] = v;
    });

    const response = await httpClient.sendRequest({
      method : HttpMethod.POST,
      url    : `${baseUrl}/v1/tickets/${id}/messages`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body,
    });

    return response.status === 201 ? response.body : response;
  },
});


export const searchTicketEvents = createAction({
  auth: easiwareAuth,
  name: 'search_ticket_events',
  displayName: 'Search Ticket Events',
  description:
    'Retrieve ticket-history events (creation, notes, status changes, messages, etc.) ',

  props: {
    createdAfter: Property.ShortText({
      displayName: 'Created After (ISO-8601)',
      description:
        'Return only events **strictly after** this date/time (ISO-8601), ' +
        'e.g. `2025-05-01T00:00:00Z`.',
      required: false,
    }),
    createdBefore: Property.ShortText({
      displayName: 'Created Before (ISO-8601)',
      description:
        'Return only events **strictly before** this date/time (ISO-8601), ' +
        'e.g. `2025-05-31T23:59:59Z`.',
      required: false,
    }),
    type: Property.StaticMultiSelectDropdown({
      displayName: 'Event Type(s)',
      description:
        'Filter on one or several event categories. If left empty, all types are returned.',
      required: false,
      options: {
        options: [
          { label: 'create',          value: 'create' },
          { label: 'note',            value: 'note' },
          { label: 'subject',         value: 'subject' },
          { label: 'status',          value: 'status' },
          { label: 'category',        value: 'category' },
          { label: 'priority',        value: 'priority' },
          { label: 'agent',           value: 'agent' },
          { label: 'currentChannel',  value: 'currentChannel' },
          { label: 'contact',         value: 'contact' },
          { label: 'message',         value: 'message' },
          { label: 'solicitation',    value: 'solicitation' },
          { label: 'delete',          value: 'delete' },
          { label: 'restore',         value: 'restore' },
        ],
      },
    }),
    ticketId: Property.ShortText({
      displayName: 'Ticket ID',
      description:
        "Restrict the search to a single ticket's timeline (easiware internal ticket identifier).",
      required: false,
    }),
  },

  async run(context) {
    const token      = context.auth.apiKey;
    const baseUrl    = context.auth.appUrl.replace(/\/$/, '');
    const p          = context.propsValue;

    const qs = new URLSearchParams();
    if (p.createdAfter)  qs.append('createdAfter',  p.createdAfter);
    if (p.createdBefore) qs.append('createdBefore', p.createdBefore);
    if (p.type?.length)  p.type.forEach(t => qs.append('type', t));
    if (p.ticketId)      qs.append('ticketId',      p.ticketId);

    const url = `${baseUrl}/v1/ticket-events${qs.size ? `?${qs}` : ''}`;

    const response = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.status === 200 ? response.body : response;
  },
});



export const getTicketEventFromID = createAction({
  auth: easiwareAuth,

  name: 'get_ticket_event_from_id',
  displayName: 'Get Ticket Event',
  description: 'Retrieve a single ticket event using its easiware ID.',

  props: {
    eventId: Property.ShortText({
      displayName: 'Ticket Event ID',
      description:
        'The easiware internal identifier of the ticket event (value of the **id** field).',
      required: true,
    }),

    returnRawResponse: Property.Checkbox({
      displayName: 'Return raw HTTP response on error',
      description:
        'When enabled, the full HTTP response object is returned if the request fails (status ≠ 200). '
        + 'If disabled, only the status code and body are returned.',
      required: false,
      defaultValue: false,
    }),
  },

  async run(ctx) {
    const token = ctx.auth.apiKey;
    const { eventId, returnRawResponse = false } = ctx.propsValue;

    // Remove trailing slash from the base URL to avoid "//"
    const baseUrl = ctx.auth.appUrl.replace(/\/$/, '');
    const url = `${baseUrl}/v1/ticket-events/${eventId}`;

    const response = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.status === 200 ? response.body : response;
  },
});


export const listTicketCustomFields = createAction({
  auth: easiwareAuth,
  name: 'list_ticket_custom_fields',
  displayName: 'List Ticket Custom Fields',
  description:
    'Return the definitions of all custom fields configured for tickets. ',

  props: {
    search: Property.ShortText({
      displayName: 'Search term',
      description:
        'Text to match in the custom-field **label** or **customId**. ' +
        'Minimum one character; use “*” to list every field.',
      required: true,
      defaultValue: '*',
    }),

  },

  async run(ctx) {
    const { apiKey, appUrl } = ctx.auth;
    const { search } = ctx.propsValue;

    const baseUrl = appUrl.replace(/\/$/, '');
    const url = `${baseUrl}/v1/ticket-custom-fields?search=${encodeURIComponent(
      search
    )}`;

    const response = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
    return response.status === 200 ? response.body : response;
  },
});


export const getTicketCustomFieldChoices = createAction({
  auth: easiwareAuth,
  name: 'get_ticket_custom_field_choices',
  displayName: 'Get Ticket Custom-Field Choices',
  description:
    'Return the list of choices defined for a ticket custom-field of type **one** or **multiple**.',

  props: {
    customId: Property.ShortText({
      displayName: 'Custom Field ID',
      description:
        'The `customId` of the ticket custom-field whose choices you want to retrieve.',
      required: true,
    }),
  },

  async run(ctx) {
    const token = ctx.auth.apiKey;
    const { customId } = ctx.propsValue;
    const baseUrl = ctx.auth.appUrl.replace(/\/$/, '');

    const response = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url: `${baseUrl}/v1/ticket-custom-fields/${customId}/choices`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.status === 200 ? response.body : response;
  },
});


export const findTicketsByBody = createAction({
  auth: easiwareAuth,
  name: 'find_tickets_body',
  displayName: 'Find Tickets (POST body)',
  description:
    'Search your organisation’s tickets using all available filters. The request is sent in the body, mirroring the parameters of GET /tickets.',

  props: {
    search: Property.ShortText({
      displayName: 'Free-text search',
      description:
        'Matches subject, contact names, email addresses, etc. Same behaviour as the “search” query parameter.',
      required: false,
    }),
    deleted: Property.Checkbox({
      displayName: 'Include deleted tickets',
      description: 'When enabled, soft-deleted tickets are returned as well.',
      required: false,
      defaultValue: false,
    }),
    unassigned: Property.Checkbox({
      displayName: 'Only unassigned tickets',
      description: 'Return tickets that have no agent assigned (agentId is null).',
      required: false,
      defaultValue: false,
    }),

    contactIds: Property.ShortText({
      displayName: 'Contact IDs',
      description: 'Comma-separated list of contact identifiers.',
      required: false,
    }),
    agentIds: Property.ShortText({
      displayName: 'Agent IDs',
      description: 'Comma-separated list of agent identifiers.',
      required: false,
    }),
    categoryIds: Property.ShortText({
      displayName: 'Category IDs',
      description: 'Comma-separated list of category identifiers.',
      required: false,
    }),
    originalRecipientEmailAddresses: Property.LongText({
      displayName: 'Original recipient addresses',
      description:
        'Comma-separated list of “To:” addresses (mainly useful for the email channel).',
      required: false,
    }),

    status: Property.StaticMultiSelectDropdown({
      displayName: 'Status',
      required: false,
      options: {
        options: [
          { label: 'New', value: 'new' },
          { label: 'In progress', value: 'in_progress' },
          { label: 'Waiting', value: 'waiting' },
          { label: 'Closed', value: 'closed' },
        ],
      },
    }),
    priority: Property.StaticMultiSelectDropdown({
      displayName: 'Priority',
      required: false,
      options: {
        options: [
          { label: 'Low', value: 'low' },
          { label: 'Medium', value: 'medium' },
          { label: 'High', value: 'high' },
        ],
      },
    }),
    source: Property.StaticMultiSelectDropdown({
      displayName: 'Source',
      required: false,
      options: {
        options: [
          { label: 'Chat', value: 'chat' },
          { label: 'Email', value: 'email' },
          { label: 'Phone', value: 'phone' },
          { label: 'Webform', value: 'webform' },
        ],
      },
    }),

    createdAfter: Property.ShortText({
      displayName: 'Created after',
      description: 'ISO-8601 date-t:splitime (e.g. 2025-01-01T00:00:00Z).',
      required: false,
    }),
    createdBefore: Property.ShortText({
      displayName: 'Created before',
      description: 'ISO-8601 date-time.',
      required: false,
    }),
    updatedAfter: Property.ShortText({
      displayName: 'Updated after',
      description: 'ISO-8601 date-time.',
      required: false,
    }),
    updatedBefore: Property.ShortText({
      displayName: 'Updated before',
      description: 'ISO-8601 date-time.',
      required: false,
    }),

    customFieldsValues: Property.Json({
      displayName: 'Custom fields values',
      description:
        'Key/value object for custom fields (must match the custom field definitions configured in easiware).',
      required: false,
      defaultValue: {},
    }),
  },

  async run(ctx) {
    const token = ctx.auth.apiKey;
    const baseUrl = ctx.auth.appUrl.replace(/\/$/, '');
    const p = ctx.propsValue;

    /* ---- Build request body according to provided filters ---- */
    const body: Record<string, unknown> = {};

    /* Direct assignments */
    if (p.search) body['search'] = p.search;
    if (p.deleted) body['deleted'] = true;
    if (p.unassigned) body['unassigned'] = true;
    if (p.status?.length) body['status'] = p.status;
    if (p.priority?.length) body['priority'] = p.priority;
    if (p.source?.length) body['source'] = p.source;
    if (p.createdAfter) body['createdAfter'] = p.createdAfter;
    if (p.createdBefore) body['createdBefore'] = p.createdBefore;
    if (p.updatedAfter) body['updatedAfter'] = p.updatedAfter;
    if (p.updatedBefore) body['updatedBefore'] = p.updatedBefore;
    if (Object.keys(p.customFieldsValues || {}).length)
      body['customFieldsValues'] = p.customFieldsValues;

    /* Comma-separated → array helpers */
    const csvToArray = (txt?: string) =>
      txt ? txt.split(',').map((s) => s.trim()).filter(Boolean) : undefined;

    const contactArr = csvToArray(p.contactIds);
    if (contactArr?.length) body['contactId'] = contactArr;

    const agentArr = csvToArray(p.agentIds);
    if (agentArr?.length) body['agentId'] = agentArr;

    const categoryArr = csvToArray(p.categoryIds);
    if (categoryArr?.length) body['categoryId'] = categoryArr;

    const recipientArr = csvToArray(p.originalRecipientEmailAddresses);
    if (recipientArr?.length) body['originalRecipientEmailAddress'] = recipientArr;

    const resp = await httpClient.sendRequest({
      method: HttpMethod.POST,
      url: `${baseUrl}/v1/tickets/find`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body,
    });

    return resp.status === 201 ? resp.body : resp;
  },
});

