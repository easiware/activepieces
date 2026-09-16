import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { easiwareAuth, easiwareAuthType } from '../..';
import { buildHeaders, sanitize, base, languageOptions } from './common';

/************************************
 * LAYOUTS
 ***********************************/
export const listLayouts = createAction({
  auth: easiwareAuth,
  name: 'list_layouts',
  displayName: 'List Layouts',
  description: 'Retrieve the list of available layouts.',
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
      url: `${base(appUrl)}/v1/layouts`,
      headers: buildHeaders(apiKey),
      queryParams,
    });
    return res.status === 200 ? res.body : res;
  },
});

export const getLayout = createAction({
  auth: easiwareAuth,
  name: 'get_layout',
  displayName: 'Get Layout',
  description: 'Retrieve a layout by its ID.',
  props: {
    id: Property.ShortText({ displayName: 'Layout ID', required: true }),
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
      url: `${base(appUrl)}/v1/layouts/${id}`,
      headers: buildHeaders(apiKey),
      queryParams,
    });
    return res.status === 200 ? res.body : res;
  },
});
