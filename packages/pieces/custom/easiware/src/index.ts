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
import { getTicketFromID, createTicket, updateTicket, getTicketMessages,
    addMessageToTicket, searchTicketEvents, getTicketEventFromID,
    listTicketCustomFields, getTicketCustomFieldChoices, findTicketsByBody, } from './lib/actions/ticket';

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
    //searchTickets,
    createTicket, 
    updateTicket,
    getTicketMessages,
    addMessageToTicket,
    searchTicketEvents,
    getTicketEventFromID,
    listTicketCustomFields,
    getTicketCustomFieldChoices,
    findTicketsByBody,

    createCustomApiCallAction({
      baseUrl: (auth) => (auth as easiwareAuthType).appUrl,
      auth: easiwareAuth,
      authMapping: async (auth) => ({
        Authorization: `Bearer ${(auth as easiwareAuthType).apiKey}`,
      }),
    }),
  ],
  triggers,
});
