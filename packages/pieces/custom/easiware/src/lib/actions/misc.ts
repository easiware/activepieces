import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod, QueryParams } from '@activepieces/pieces-common';
import { easiwareAuth } from '../..';

/************************************
 * HELPER UTIL
 ***********************************/
const buildHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
});

const sanitize = (obj: Record<string, unknown>): QueryParams =>
  Object.fromEntries(
    Object.entries(obj)
      .filter(([, v]) => v !== undefined && v !== null && v !== '')
      .map(([k, v]) => [k, String(v)]) // <-- conversion ici
  );

const base = (url: string) => url.replace(/\/$/, '');

/************************************
 * STATUS & AUTH INFO
 ***********************************/
export const getApiStatus = createAction({
  auth: easiwareAuth,
  name: 'get_api_status',
  displayName: 'Get API Status',
  description: 'Retrieve the public API status',
  props: {},
  async run(ctx) {
    const { apiKey, appUrl } = ctx.auth;
    const res = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url: `${base(appUrl)}/v1/status`,
      headers: buildHeaders(apiKey),
    });
    return res.status === 200 ? res.body : res;
  },
});

export const getAuthInfo = createAction({
  auth: easiwareAuth,
  name: 'get_auth_info',
  displayName: 'Get Auth Info',
  description: 'Retrieve details about the current API key',
  props: {},
  async run(ctx) {
    const { apiKey, appUrl } = ctx.auth;
    const res = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url: `${base(appUrl)}/v1/auth/info`,
      headers: buildHeaders(apiKey),
    });
    return res.status === 200 ? res.body : res;
  },
});

/************************************
 * CATEGORIES
 ***********************************/
export const searchCategories = createAction({
  auth: easiwareAuth,
  name: 'search_categories',
  displayName: 'Search Categories',
  description: "Search your organization's categories",
  props: {
    search: Property.ShortText({ displayName: 'Search', required: false }),
    active: Property.Checkbox({ displayName: 'Active only', required: false }),
    public: Property.Checkbox({ displayName: 'Public only', required: false }),
  },
  async run(ctx) {
    const { apiKey, appUrl } = ctx.auth;
    const queryParams = sanitize(ctx.propsValue);
    const res = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url: `${base(appUrl)}/v1/categories`,
      headers: buildHeaders(apiKey),
      queryParams,
    });
    return res.status === 200 ? res.body : res;
  },
});

export const getCategoryFromID = createAction({
  auth: easiwareAuth,
  name: 'get_category_from_id',
  displayName: 'Get Category by ID',
  description: 'Retrieve a category using its easiware internal ID',
  props: {
    id: Property.ShortText({ displayName: 'Category ID', required: true }),
  },
  async run(ctx) {
    const { apiKey, appUrl } = ctx.auth;
    const res = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url: `${base(appUrl)}/v1/categories/${ctx.propsValue.id}`,
      headers: buildHeaders(apiKey),
    });
    return res.status === 200 ? res.body : res;
  },
});

/************************************
 * USERS
 ***********************************/
export const searchUsers = createAction({
  auth: easiwareAuth,
  name: 'search_users',
  displayName: 'Search Users',
  description: "Search your organization's users",
  props: {
    search: Property.ShortText({ displayName: 'Search', required: false }),
    email: Property.ShortText({ displayName: 'Email', required: false }),
    enabled: Property.Checkbox({ displayName: 'Enabled only', required: false }),
    role: Property.StaticDropdown({
      displayName: 'Role',
      required: false,
      options: {
        disabled: false,
        options: [
          { label: 'Owner', value: 'owner' },
          { label: 'Admin', value: 'admin' },
          { label: 'Agent', value: 'agent' },
        ],
      },
    }),
  },
  async run(ctx) {
    const { apiKey, appUrl } = ctx.auth;
    const queryParams = sanitize(ctx.propsValue);
    const res = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url: `${base(appUrl)}/v1/users`,
      headers: buildHeaders(apiKey),
      queryParams,
    });
    return res.status === 200 ? res.body : res;
  },
});

export const getUserFromID = createAction({
  auth: easiwareAuth,
  name: 'get_user_from_id',
  displayName: 'Get User by ID',
  description: 'Retrieve a user by easiware internal ID',
  props: {
    id: Property.ShortText({ displayName: 'User ID', required: true }),
  },
  async run(ctx) {
    const { apiKey, appUrl } = ctx.auth;
    const res = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url: `${base(appUrl)}/v1/users/${ctx.propsValue.id}`,
      headers: buildHeaders(apiKey),
    });
    return res.status === 200 ? res.body : res;
  },
});

