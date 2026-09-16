import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { easiwareAuth, easiwareAuthType } from '../..';
import { buildHeaders, sanitize, base } from './common';

/************************************
 * COMPETENCE GROUPS
 ***********************************/
export const searchCompetenceGroups = createAction({
  auth: easiwareAuth,
  name: 'search_competence_groups',
  displayName: 'Search Competence Groups',
  description: "Search your organization's competence groups.",
  props: {
    search: Property.ShortText({ displayName: 'Search', required: false }),
    active: Property.Checkbox({ displayName: 'Active only', required: false }),
    agentId: Property.ShortText({
      displayName: 'Agent IDs',
      description: 'Comma-separated list of agent UUIDs.',
      required: false,
    }),
  },
  async run(ctx) {
    const { apiKey, appUrl } = ctx.auth as unknown as easiwareAuthType;
    const queryParams = sanitize(ctx.propsValue);
    const res = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url: `${base(appUrl)}/v1/competence-groups`,
      headers: buildHeaders(apiKey),
      queryParams,
    });
    return res.status === 200 ? res.body : res;
  },
});

export const getCompetenceGroup = createAction({
  auth: easiwareAuth,
  name: 'get_competence_group',
  displayName: 'Get Competence Group',
  description: 'Retrieve a competence group by its ID.',
  props: {
    id: Property.ShortText({ displayName: 'Competence Group ID', required: true }),
  },
  async run(ctx) {
    const { apiKey, appUrl } = ctx.auth as unknown as easiwareAuthType;
    const res = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url: `${base(appUrl)}/v1/competence-groups/${ctx.propsValue.id}`,
      headers: buildHeaders(apiKey),
    });
    return res.status === 200 ? res.body : res;
  },
});
