import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { easiwareAuth, easiwareAuthType } from '../..';
import { buildHeaders, sanitize, base, languageOptions } from './common';

/************************************
 * TEMPLATES
 ***********************************/
export const listTemplates = createAction({
  auth: easiwareAuth,
  name: 'list_templates',
  displayName: 'List Templates',
  description: 'Retrieve the list of available templates.',
  props: {
    language: Property.StaticDropdown({
      displayName: 'Language',
      required: false,
      options: {
        disabled: false,
        options: languageOptions,
      },
    }),
  },
  async run(ctx) {
    const { apiKey, appUrl } = ctx.auth as unknown as easiwareAuthType;
    const queryParams = sanitize(ctx.propsValue);
    const res = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url: `${base(appUrl)}/v1/templates`,
      headers: buildHeaders(apiKey),
      queryParams,
    });
    return res.status === 200 ? res.body : res;
  },
});

export const getTemplate = createAction({
  auth: easiwareAuth,
  name: 'get_template',
  displayName: 'Get Template',
  description: 'Retrieve a template by its ID.',
  props: {
    id: Property.ShortText({ displayName: 'Template ID', required: true }),
    language: Property.StaticDropdown({
      displayName: 'Language',
      required: false,
      options: {
        disabled: false,
        options: languageOptions,
      },
    }),
  },
  async run(ctx) {
    const { apiKey, appUrl } = ctx.auth as unknown as easiwareAuthType;
    const { id, ...rest } = ctx.propsValue;
    const queryParams = sanitize(rest);
    const res = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url: `${base(appUrl)}/v1/templates/${id}`,
      headers: buildHeaders(apiKey),
      queryParams,
    });
    return res.status === 200 ? res.body : res;
  },
});
