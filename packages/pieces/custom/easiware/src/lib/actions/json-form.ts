import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { easiwareAuth, easiwareAuthType } from '../..';
import { buildHeaders, sanitize, base } from './common';

/************************************
 * JSON FORMS — TEMPLATES
 ***********************************/
export const createJsonForm = createAction({
  auth: easiwareAuth,
  name: 'create_json_form',
  displayName: 'Create JSON Form',
  description: 'Create a new JSON form template.',
  props: {
    moduleType: Property.StaticDropdown({
      displayName: 'Module Type',
      required: true,
      options: {
        disabled: false,
        options: [
          { label: 'Contact', value: 'contact' },
          { label: 'Ticket', value: 'ticket' },
        ],
      },
    }),
    templateName: Property.ShortText({ displayName: 'Template Name', required: true }),
    displayOrder: Property.Number({
      displayName: 'Display Order',
      required: false,
    }),
    dataSchema: Property.LongText({
      displayName: 'Data Schema (JSON)',
      description: 'JSON schema as a string.',
      required: true,
    }),
    dataUISchema: Property.LongText({
      displayName: 'Data UI Schema (JSON)',
      description: 'JSON UI schema as a string.',
      required: true,
    }),
    webhookId: Property.ShortText({ displayName: 'Webhook ID', required: false }),
    logoUrl: Property.ShortText({ displayName: 'Logo URL', required: false }),
  },
  async run(ctx) {
    const { apiKey, appUrl } = ctx.auth as unknown as easiwareAuthType;
    const body = sanitize(ctx.propsValue);
    const res = await httpClient.sendRequest({
      method: HttpMethod.POST,
      url: `${base(appUrl)}/v1/jsonform/template`,
      headers: buildHeaders(apiKey),
      body,
    });
    return res.status === 201 ? res.body : res;
  },
});

export const getJsonForm = createAction({
  auth: easiwareAuth,
  name: 'get_json_form',
  displayName: 'Get JSON Form',
  description: 'Retrieve a JSON form template by its ID.',
  props: {
    id: Property.ShortText({ displayName: 'Form ID', required: true }),
  },
  async run(ctx) {
    const { apiKey, appUrl } = ctx.auth as unknown as easiwareAuthType;
    const res = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url: `${base(appUrl)}/v1/jsonform/template/${ctx.propsValue.id}`,
      headers: buildHeaders(apiKey),
    });
    return res.status === 200 ? res.body : res;
  },
});

export const updateJsonForm = createAction({
  auth: easiwareAuth,
  name: 'update_json_form',
  displayName: 'Update JSON Form',
  description: 'Partially update an existing JSON form template.',
  props: {
    id: Property.ShortText({ displayName: 'Form ID', required: true }),
    moduleType: Property.StaticDropdown({
      displayName: 'Module Type',
      required: false,
      options: {
        disabled: false,
        options: [
          { label: 'Contact', value: 'contact' },
          { label: 'Ticket', value: 'ticket' },
        ],
      },
    }),
    templateName: Property.ShortText({ displayName: 'Template Name', required: false }),
    displayOrder: Property.Number({
      displayName: 'Display Order',
      required: false,
    }),
    dataSchema: Property.LongText({
      displayName: 'Data Schema (JSON)',
      description: 'JSON schema as a string.',
      required: false,
    }),
    dataUISchema: Property.LongText({
      displayName: 'Data UI Schema (JSON)',
      description: 'JSON UI schema as a string.',
      required: false,
    }),
    webhookId: Property.ShortText({ displayName: 'Webhook ID', required: false }),
    logoUrl: Property.ShortText({ displayName: 'Logo URL', required: false }),
  },
  async run(ctx) {
    const { apiKey, appUrl } = ctx.auth as unknown as easiwareAuthType;
    const { id, ...rest } = ctx.propsValue;
    const body = sanitize(rest);
    const res = await httpClient.sendRequest({
      method: HttpMethod.PATCH,
      url: `${base(appUrl)}/v1/jsonform/template/${id}`,
      headers: buildHeaders(apiKey),
      body,
    });
    return res.status === 200 ? res.body : res;
  },
});

export const deleteJsonForm = createAction({
  auth: easiwareAuth,
  name: 'delete_json_form',
  displayName: 'Delete JSON Form',
  description: 'Permanently delete a JSON form template.',
  props: {
    id: Property.ShortText({ displayName: 'Form ID', required: true }),
  },
  async run(ctx) {
    const { apiKey, appUrl } = ctx.auth as unknown as easiwareAuthType;
    const res = await httpClient.sendRequest({
      method: HttpMethod.DELETE,
      url: `${base(appUrl)}/v1/jsonform/template/${ctx.propsValue.id}`,
      headers: buildHeaders(apiKey),
    });
    return res.status === 200 ? res.body : res;
  },
});

export const listJsonForms = createAction({
  auth: easiwareAuth,
  name: 'list_json_forms',
  displayName: 'List JSON Forms',
  description: 'Retrieve the list of JSON form templates.',
  props: {
    moduleType: Property.StaticDropdown({
      displayName: 'Module Type',
      required: false,
      options: {
        disabled: false,
        options: [
          { label: 'Contact', value: 'contact' },
          { label: 'Ticket', value: 'ticket' },
        ],
      },
    }),
  },
  async run(ctx) {
    const { apiKey, appUrl } = ctx.auth as unknown as easiwareAuthType;
    const queryParams = sanitize(ctx.propsValue);
    const res = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url: `${base(appUrl)}/v1/jsonform/templates`,
      headers: buildHeaders(apiKey),
      queryParams,
    });
    return res.status === 200 ? res.body : res;
  },
});

/************************************
 * JSON FORMS — DATA
 ***********************************/
export const createJsonData = createAction({
  auth: easiwareAuth,
  name: 'create_json_data',
  displayName: 'Create JSON Data',
  description: 'Submit data for a JSON form.',
  props: {
    jsonFormId: Property.ShortText({ displayName: 'JSON Form ID', required: true }),
    ticketId: Property.ShortText({ displayName: 'Ticket ID', required: false }),
    contactId: Property.ShortText({ displayName: 'Contact ID', required: false }),
    data: Property.LongText({
      displayName: 'Data (JSON)',
      description: 'JSON data as a string.',
      required: true,
    }),
  },
  async run(ctx) {
    const { apiKey, appUrl } = ctx.auth as unknown as easiwareAuthType;
    const body = sanitize(ctx.propsValue);
    const res = await httpClient.sendRequest({
      method: HttpMethod.POST,
      url: `${base(appUrl)}/v1/jsonform/data`,
      headers: buildHeaders(apiKey),
      body,
    });
    return res.status === 201 ? res.body : res;
  },
});

export const getJsonData = createAction({
  auth: easiwareAuth,
  name: 'get_json_data',
  displayName: 'Get JSON Data',
  description: 'Retrieve a JSON form data entry by its ID.',
  props: {
    id: Property.ShortText({ displayName: 'Data ID', required: true }),
  },
  async run(ctx) {
    const { apiKey, appUrl } = ctx.auth as unknown as easiwareAuthType;
    const res = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url: `${base(appUrl)}/v1/jsonform/data/${ctx.propsValue.id}`,
      headers: buildHeaders(apiKey),
    });
    return res.status === 200 ? res.body : res;
  },
});

export const updateJsonData = createAction({
  auth: easiwareAuth,
  name: 'update_json_data',
  displayName: 'Update JSON Data',
  description: 'Partially update an existing JSON form data entry.',
  props: {
    id: Property.ShortText({ displayName: 'Data ID', required: true }),
    jsonFormId: Property.ShortText({ displayName: 'JSON Form ID', required: false }),
    ticketId: Property.ShortText({ displayName: 'Ticket ID', required: false }),
    contactId: Property.ShortText({ displayName: 'Contact ID', required: false }),
    data: Property.LongText({
      displayName: 'Data (JSON)',
      description: 'JSON data as a string.',
      required: false,
    }),
  },
  async run(ctx) {
    const { apiKey, appUrl } = ctx.auth as unknown as easiwareAuthType;
    const { id, ...rest } = ctx.propsValue;
    const body = sanitize(rest);
    const res = await httpClient.sendRequest({
      method: HttpMethod.PATCH,
      url: `${base(appUrl)}/v1/jsonform/data/${id}`,
      headers: buildHeaders(apiKey),
      body,
    });
    return res.status === 200 ? res.body : res;
  },
});

export const deleteJsonData = createAction({
  auth: easiwareAuth,
  name: 'delete_json_data',
  displayName: 'Delete JSON Data',
  description: 'Permanently delete a JSON form data entry.',
  props: {
    id: Property.ShortText({ displayName: 'Data ID', required: true }),
  },
  async run(ctx) {
    const { apiKey, appUrl } = ctx.auth as unknown as easiwareAuthType;
    const res = await httpClient.sendRequest({
      method: HttpMethod.DELETE,
      url: `${base(appUrl)}/v1/jsonform/data/${ctx.propsValue.id}`,
      headers: buildHeaders(apiKey),
    });
    return res.status === 200 ? res.body : res;
  },
});

export const listAllJsonData = createAction({
  auth: easiwareAuth,
  name: 'list_all_json_data',
  displayName: 'List All JSON Data',
  description: 'Retrieve all JSON form data entries.',
  props: {},
  async run(ctx) {
    const { apiKey, appUrl } = ctx.auth as unknown as easiwareAuthType;
    const res = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url: `${base(appUrl)}/v1/jsonform/allData`,
      headers: buildHeaders(apiKey),
    });
    return res.status === 200 ? res.body : res;
  },
});
