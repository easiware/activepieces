import { createCustomApiCallAction, httpClient, HttpMethod } from '@activepieces/pieces-common';
import {
  PieceAuth,
  Property,
  createPiece,
  PiecePropValueSchema,
} from '@activepieces/pieces-framework';
import { PieceCategory } from '@activepieces/shared';
import { triggers } from './lib/triggers';
import { getContactFromID, searchContact, createContact,
    updateContact, listContactCustomFields, getContactCustomFieldChoices } from './lib/actions/contact';
import { getApiStatus, getAuthInfo, searchCategories,
    getCategoryFromID, searchUsers, getUserFromID, } from './lib/actions/misc';
import { getTicketFromID, searchTickets, createTicket, updateTicket, getTicketMessages,
    addMessageToTicket, searchTicketEvents, getTicketEventFromID,
    listTicketCustomFields, getTicketCustomFieldChoices, findTicketsByBody, } from './lib/actions/ticket';
import { searchCompetenceGroups, getCompetenceGroup } from './lib/actions/competence-group';
import {
    listWebhooks, getWebhook, createWebhook, updateWebhook,
    detachWebhook, deleteWebhook,
} from './lib/actions/webhook';
import { listTemplates, getTemplate } from './lib/actions/template';
import { searchTicketMessages, getTicketMessage } from './lib/actions/ticket-message';
import {
    searchKnowledgeBase, createKnowledgeBase, getKnowledgeBase, updateKnowledgeBase,
} from './lib/actions/knowledge-base';
import { listLayouts, getLayout } from './lib/actions/layout';
import {
    createJsonForm, getJsonForm, updateJsonForm, deleteJsonForm, listJsonForms,
    createJsonData, getJsonData, updateJsonData, deleteJsonData, listAllJsonData,
} from './lib/actions/json-form';
import { getCsatForm, submitCsatForm } from './lib/actions/csat';

const markdownPropertyDescription = `
  **Enable API key:**
  1. Login to your easiware account
  2. On the Bottom-left, click on Parameters
  3. Select 'General'
  3. Select 'API key management'
  4. On the right panel, click on '+' Generate a new key
  5. Enter the 'API key Label' to name the key
  6. Click on 'Generate a new key'
  7. Copy the API key and paste it below.

  **APP URL:**
  - The API URL for easiware example the cloud is at https://app.easiware.com
`;

export type easiwareAuthType = {
	appUrl: string;
	apiKey: string;
}

export const easiwareAuth = PieceAuth.CustomAuth({
  props: {
    appUrl: Property.ShortText({
      displayName: 'Api URL',
      description: 'Enter the api URL',
      required: true,
      defaultValue: 'https://api.easiware.com'
    }),
    apiKey: Property.ShortText({
      displayName: 'API Key',
      description: 'Enter the API key',
      required: true,
    }),
  },
  description: markdownPropertyDescription,
  required: true,
  validate: async ({ auth }) => {
    try {
      const authValue = auth as PiecePropValueSchema<typeof easiwareAuth>;

      await httpClient.sendRequest({
        method: HttpMethod.GET,
        url: `${authValue.appUrl}/v1/auth/info`,
        headers: {
          'Authorization': `Bearer ${authValue.apiKey}`,
        },
      });
      return {
        valid: true,
      };
    } catch (error) {
      return {
        valid: false,
        error: 'Please provide correct API URL and API key.',
      };
    }
  },
});

export const easiware = createPiece({
  displayName: "Easiware",
  description: 'Lovely customer support software',
  minimumSupportedRelease: '0.36.1',
  logoUrl: 'https://app-staging.easiware.com/images/easiware-heart.svg',
  categories: [PieceCategory.CUSTOMER_SUPPORT],
  authors: ["stefapi"],
  auth: easiwareAuth,
  actions: [
    getContactFromID,
    searchContact,
    createContact,
    updateContact,
    listContactCustomFields,
    getContactCustomFieldChoices,

    getApiStatus,
    getAuthInfo,
    searchCategories,
    getCategoryFromID,
    searchUsers,
    getUserFromID,

    getTicketFromID,
    searchTickets,
    createTicket,
    updateTicket,
    getTicketMessages,
    addMessageToTicket,
    searchTicketEvents,
    getTicketEventFromID,
    listTicketCustomFields,
    getTicketCustomFieldChoices,
    findTicketsByBody,

    searchCompetenceGroups,
    getCompetenceGroup,

    listWebhooks,
    getWebhook,
    createWebhook,
    updateWebhook,
    detachWebhook,
    deleteWebhook,

    listTemplates,
    getTemplate,

    searchTicketMessages,
    getTicketMessage,

    searchKnowledgeBase,
    createKnowledgeBase,
    getKnowledgeBase,
    updateKnowledgeBase,

    listLayouts,
    getLayout,

    createJsonForm,
    getJsonForm,
    updateJsonForm,
    deleteJsonForm,
    listJsonForms,
    createJsonData,
    getJsonData,
    updateJsonData,
    deleteJsonData,
    listAllJsonData,

    getCsatForm,
    submitCsatForm,

    createCustomApiCallAction({
      baseUrl: (auth) => (auth as unknown as easiwareAuthType).appUrl,
      auth: easiwareAuth,
      authMapping: async (auth) => ({
        Authorization: `Bearer ${(auth as unknown as easiwareAuthType).apiKey}`,
      }),
    }),
  ],
  triggers,
});
