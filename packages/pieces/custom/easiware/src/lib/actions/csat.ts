import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { easiwareAuth, easiwareAuthType } from '../..';
import { base, buildHeaders } from './common';

/**
 * Resolve the organization ID to use for a CSAT request.
 *
 * If `orgId` is provided (non-empty), it is used as-is. Otherwise the public
 * `GET /v1/auth/info` endpoint is called with the API key to auto-detect the
 * organization id. If that call fails, a clear error is thrown asking the
 * user to fill the Organization ID manually.
 */
const resolveOrgId = async (
  appUrl: string,
  apiKey: string,
  orgId: string | undefined,
): Promise<string> => {
  if (orgId && orgId.trim() !== '') {
    return orgId.trim();
  }
  try {
    const res = await httpClient.sendRequest<{
      organization?: { id?: number };
    }>({
      method: HttpMethod.GET,
      url: `${base(appUrl)}/v1/auth/info`,
      headers: buildHeaders(apiKey),
    });
    const id = res.body?.organization?.id;
    if (id === undefined || id === null) {
      throw new Error('Organization ID not found in auth/info response.');
    }
    return String(id);
  } catch (err) {
    throw new Error(
      'Unable to auto-detect the Organization ID from your API key. ' +
        'Please fill the Organization ID field manually. ' +
        (err instanceof Error ? `(${err.message})` : ''),
    );
  }
};

/************************************
 * CSAT — PUBLIC ENDPOINTS
 * No Bearer token required.
 ***********************************/
export const getCsatForm = createAction({
  auth: easiwareAuth,
  name: 'get_csat_form',
  displayName: 'Get CSAT Form',
  description: 'Retrieve a public CSAT form using the organization ID and token.',
  props: {
    orgId: Property.ShortText({
      displayName: 'Organization ID',
      description: 'Organization ID — auto-detected from your API key if left empty.',
      required: false,
    }),
    token: Property.ShortText({ displayName: 'Token', required: true }),
  },
  async run(ctx) {
    const { appUrl, apiKey } = ctx.auth as unknown as easiwareAuthType;
    const { token } = ctx.propsValue;
    const orgId = await resolveOrgId(appUrl, apiKey, ctx.propsValue.orgId);
    const res = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url: `${base(appUrl)}/csat/form/${orgId}/${token}`,
      headers: { 'Content-Type': 'application/json' },
    });
    return res.status === 200 ? res.body : res;
  },
});

export const submitCsatForm = createAction({
  auth: easiwareAuth,
  name: 'submit_csat_form',
  displayName: 'Submit CSAT Form',
  description: 'Submit a CSAT form response (public endpoint).',
  props: {
    orgId: Property.ShortText({
      displayName: 'Organization ID',
      description: 'Organization ID — auto-detected from your API key if left empty.',
      required: false,
    }),
    token: Property.ShortText({ displayName: 'Token', required: true }),
    rating: Property.Number({
      displayName: 'Rating',
      description: 'CSAT rating from 1 to 5.',
      required: true,
    }),
    comment: Property.LongText({ displayName: 'Comment', required: false }),
  },
  async run(ctx) {
    const { appUrl, apiKey } = ctx.auth as unknown as easiwareAuthType;
    const { token, rating, comment } = ctx.propsValue;
    const orgId = await resolveOrgId(appUrl, apiKey, ctx.propsValue.orgId);
    const body: Record<string, unknown> = { rating };
    if (comment !== undefined && comment !== null && comment !== '') {
      body['comment'] = comment;
    }
    const res = await httpClient.sendRequest({
      method: HttpMethod.POST,
      url: `${base(appUrl)}/csat/form/${orgId}/${token}/submit`,
      headers: { 'Content-Type': 'application/json' },
      body,
    });
    return res.status === 200 ? res.body : res;
  },
});
