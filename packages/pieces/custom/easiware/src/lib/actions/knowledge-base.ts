import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { easiwareAuth, easiwareAuthType } from '../..';
import { buildHeaders, sanitize, base, languageOptions } from './common';

/************************************
 * KNOWLEDGE BASE
 ***********************************/
export const searchKnowledgeBase = createAction({
  auth: easiwareAuth,
  name: 'search_knowledge_base',
  displayName: 'Search Knowledge Base',
  description: 'Search knowledge base articles with filters and pagination.',
  props: {
    search: Property.ShortText({ displayName: 'Search', required: false }),
    categoryId: Property.ShortText({
      displayName: 'Category IDs',
      description: 'Comma-separated list of category UUIDs.',
      required: false,
    }),
    createdAfter: Property.DateTime({
      displayName: 'Created after',
      required: false,
    }),
    createdBefore: Property.DateTime({
      displayName: 'Created before',
      required: false,
    }),
    updatedAfter: Property.DateTime({
      displayName: 'Updated after',
      required: false,
    }),
    updatedBefore: Property.DateTime({
      displayName: 'Updated before',
      required: false,
    }),
    page: Property.Number({
      displayName: 'Page',
      description: 'Page number to retrieve (1-based).',
      required: false,
      defaultValue: 1,
    }),
    limit: Property.Number({
      displayName: 'Limit',
      description: 'Maximum number of items to return per page.',
      required: false,
      defaultValue: 20,
    }),
  },
  async run(ctx) {
    const { apiKey, appUrl } = ctx.auth as unknown as easiwareAuthType;
    const queryParams = sanitize(ctx.propsValue);
    const res = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url: `${base(appUrl)}/v1/knowledge-base`,
      headers: buildHeaders(apiKey),
      queryParams,
    });
    return res.status === 200 ? res.body : res;
  },
});

export const createKnowledgeBase = createAction({
  auth: easiwareAuth,
  name: 'create_knowledge_base',
  displayName: 'Create Knowledge Base Article',
  description: 'Create a new knowledge base article.',
  props: {
    status: Property.StaticDropdown({
      displayName: 'Status',
      required: true,
      options: {
        disabled: false,
        options: [
          { label: 'Draft', value: 'draft' },
          { label: 'Published', value: 'published' },
          { label: 'Un-published', value: 'un-published' },
        ],
      },
    }),
    categoryIds: Property.ShortText({
      displayName: 'Category IDs',
      description: 'Comma-separated list of category UUIDs (minimum one).',
      required: true,
    }),
    translations: Property.Array({
      displayName: 'Translations',
      description: 'Array of translation objects (title, texte, language).',
      required: true,
      properties: {
        title: Property.ShortText({ displayName: 'Title', required: true }),
        texte: Property.LongText({ displayName: 'Text', required: true }),
        language: Property.StaticDropdown({
          displayName: 'Language',
          required: true,
          options: {
            disabled: false,
            options: languageOptions,
          },
        }),
      },
    }),
  },
  async run(ctx) {
    const { apiKey, appUrl } = ctx.auth as unknown as easiwareAuthType;
    const { status, categoryIds, translations } = ctx.propsValue;
    const body = {
      status,
      categoryIds: categoryIds.split(',').map((s) => s.trim()).filter(Boolean),
      translations,
    };
    const res = await httpClient.sendRequest({
      method: HttpMethod.POST,
      url: `${base(appUrl)}/v1/knowledge-base`,
      headers: buildHeaders(apiKey),
      body,
    });
    return res.status === 201 ? res.body : res;
  },
});

export const getKnowledgeBase = createAction({
  auth: easiwareAuth,
  name: 'get_knowledge_base',
  displayName: 'Get Knowledge Base Article',
  description: 'Retrieve a knowledge base article by its ID.',
  props: {
    id: Property.ShortText({ displayName: 'Article ID', required: true }),
  },
  async run(ctx) {
    const { apiKey, appUrl } = ctx.auth as unknown as easiwareAuthType;
    const res = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url: `${base(appUrl)}/v1/knowledge-base/${ctx.propsValue.id}`,
      headers: buildHeaders(apiKey),
    });
    return res.status === 200 ? res.body : res;
  },
});

export const updateKnowledgeBase = createAction({
  auth: easiwareAuth,
  name: 'update_knowledge_base',
  displayName: 'Update Knowledge Base Article',
  description: 'Partially update an existing knowledge base article.',
  props: {
    id: Property.ShortText({ displayName: 'Article ID', required: true }),
    status: Property.StaticDropdown({
      displayName: 'Status',
      required: false,
      options: {
        disabled: false,
        options: [
          { label: 'Draft', value: 'draft' },
          { label: 'Published', value: 'published' },
          { label: 'Un-published', value: 'un-published' },
        ],
      },
    }),
    categoryIds: Property.ShortText({
      displayName: 'Category IDs',
      description: 'Comma-separated list of category UUIDs.',
      required: false,
    }),
    translations: Property.Array({
      displayName: 'Translations',
      description: 'Array of translation objects (title, texte, language).',
      required: false,
      properties: {
        title: Property.ShortText({ displayName: 'Title', required: true }),
        texte: Property.LongText({ displayName: 'Text', required: true }),
        language: Property.StaticDropdown({
          displayName: 'Language',
          required: true,
          options: {
            disabled: false,
            options: languageOptions,
          },
        }),
      },
    }),
  },
  async run(ctx) {
    const { apiKey, appUrl } = ctx.auth as unknown as easiwareAuthType;
    const { id, status, categoryIds, translations } = ctx.propsValue;
    const body: Record<string, unknown> = {};
    if (status !== undefined && status !== '') body['status'] = status;
    if (categoryIds) {
      body['categoryIds'] = categoryIds.split(',').map((s) => s.trim()).filter(Boolean);
    }
    if (translations) body['translations'] = translations;
    const res = await httpClient.sendRequest({
      method: HttpMethod.PATCH,
      url: `${base(appUrl)}/v1/knowledge-base/${id}`,
      headers: buildHeaders(apiKey),
      body,
    });
    return res.status === 200 ? res.body : res;
  },
});
