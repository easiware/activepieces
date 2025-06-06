import { createAction, Property } from '@activepieces/pieces-framework';
import { HttpRequest, httpClient, HttpMethod } from '@activepieces/pieces-common';
import { easiwareAuth } from '../..';

export const getContactFromID = createAction({
  auth: easiwareAuth,
  name: 'get_contact_from_id',
  displayName: 'Get a Contact',
  description: 'Get contacts details from ID number.',

  props: {
    contactid: Property.ShortText({
      displayName: 'Contact ID number',
      description: 'The ID number of the contact',
      required: true,
    }),
  },

  async run(context) {
    const EAapiToken = context.auth.apiKey;
    const EAcontactID = context.propsValue.contactid;

    const headers = {
      Authorization: `Bearer ${EAapiToken}`,
      'Content-Type': 'application/json',
    };

    // Remove trailing slash from api_url
    const baseUrl = context.auth.appUrl.replace(/\/$/, '');
    // not needed for gettickets ?${queryParams.toString()}
    const url = `${baseUrl}/v1/contacts/${EAcontactID}`;
    const httprequestdata = {
      method: HttpMethod.GET,
      url,
      headers,
    };
    const response = await httpClient.sendRequest(httprequestdata);

    if (response.status == 200) {
      return response.body;
    } else {
      return response;
    }
  },
});


export const searchContact = createAction({
  auth: easiwareAuth,
  name: 'search_contact',
  displayName: 'Search a Contact',
  description: 'Search contacts and get details.',

  props: {
    cityName: Property.ShortText({
      displayName: 'City Name',
      description: 'The name of city',
      required: false,
    }),
    civility: Property.StaticDropdown({
      displayName: 'Civility',
      description: 'Civility of the contact',
      required: false,
      options: {
	options: [
	  {
	     label: 'Mr',
	     value: 'Mr',
	  },
	  {
	     label: 'Mrs',
	     value: 'Mrs',
	  }
	]
      }
    }),
    countryCode: Property.ShortText({
      displayName: 'Country code',
      description: 'The country code iso3166 alpha-2 exemple: FR',
      required: false,
    }),
    createdAfter: Property.DateTime({
      displayName: 'Created after',
      description: 'Return contacts created after this date',
      required: false,
    }),
    createdBefore: Property.DateTime({
      displayName: 'Created before',
      description: 'Return contacts created before this date',
      required: false,
    }),
    email: Property.ShortText({
      displayName: 'Email Address',
      description: 'The email address of the contact',
      required: false,
    }),
    firstName: Property.ShortText({
      displayName: 'First name',
      description: 'The first name of the contact',
      required: false,
    }),
    languageCode: Property.ShortText({
      displayName: 'Language code',
      description: 'The language code of the contact iso3166 alpha-2 exemple: fr',
      required: false,
    }),
    lastName: Property.ShortText({
      displayName: 'Last name',
      description: 'The last name of the contact',
      required: false,
    }),
    phoneNumber: Property.ShortText({
      displayName: 'Phone number',
      description: 'The phone number of the contact in E.164 standard. Example: +33723456789',
      required: false,
    }),
    postalCode: Property.ShortText({
      displayName: 'Postal code',
      description: 'The postal code of the contact',
      required: false,
    }),
    search: Property.ShortText({
      displayName: 'global search',
      description: 'Use global search on contact with this text',
      required: false,
    }),
    updatedAfter: Property.DateTime({
      displayName: 'Updated after',
      description: 'Return contacts updated after this date',
      required: false,
    }),
    updatedBefore: Property.DateTime({
      displayName: 'Updated before',
      description: 'Return contacts updated before this date',
      required: false,
    }),
  },

  async run(context) {
    const { apiKey: EAapiToken, appUrl } = context.auth;

    const headers = {
      Authorization: `Bearer ${EAapiToken}`,
      'Content-Type': 'application/json',
    };

    const rawProps = context.propsValue as Record<string, unknown>;

    const queryParams: Record<string, string> = Object.fromEntries(
	    Object.entries(rawProps)
	    .filter(([, v]) => v !== undefined && v !== null && v !== '')
	    .map(([k, v]) => [k, String(v)])          // <- garantit string
    );

    // Remove trailing slash from api_url
    const baseUrl = context.auth.appUrl.replace(/\/$/, '');
    // not needed for gettickets ?${queryParams.toString()}
    const url = `${baseUrl.replace(/\/$/, '')}/v1/contacts`
    const httprequestdata = {
      method: HttpMethod.GET,
      url,
      headers,
      queryParams,
    };
    const response = await httpClient.sendRequest(httprequestdata);

    if (response.status == 200) {
      return response.body;
    } else {
      return response;
    }
  },
});

export const createContact = createAction({
  auth: easiwareAuth,
  name: 'create_contact',
  displayName: 'Create a Contact',
  description: 'Create a new contact in Easiware.',

  props: {
    email: Property.ShortText({
      displayName: 'Email address',
      description: 'Unique email address of the contact',
      required: true,
    }),

    firstName: Property.ShortText({
      displayName: 'First name',
      required: false,
    }),
    lastName: Property.ShortText({
      displayName: 'Last name',
      required: false,
    }),
    phoneNumber: Property.ShortText({
      displayName: 'Phone number (E.164)',
      required: false,
    }),
    civilStatus: Property.StaticDropdown({
      displayName: 'Civility',
      required: false,
      options: {
        options: [
          { label: 'Mr',  value: 'Mr'  },
          { label: 'Mrs', value: 'Mrs' },
        ],
      },
    }),
    birthday: Property.ShortText({
      displayName: 'Birthday',
      description: 'YYYY-MM-DD',
      required: false,
    }),

    companyName: Property.ShortText({
      displayName: 'Company name',
      required: false,
    }),
    streetName: Property.ShortText({
      displayName: 'Street address',
      required: false,
    }),
    cityName: Property.ShortText({
      displayName: 'City',
      required: false,
    }),
    stateName: Property.ShortText({
      displayName: 'State / Region',
      required: false,
    }),
    zipCode: Property.ShortText({
      displayName: 'Postal code',
      required: false,
    }),
    countryCode: Property.ShortText({
      displayName: 'Country code',
      description: 'The country code iso3166 alpha-2 exemple: FR',
      required: false,
    }),
    languageCode: Property.ShortText({
      displayName: 'Language code',
      description: 'The Language code iso3166 alpha-2 exemple: fr',
      required: false,
    }),
    notes: Property.LongText({
      displayName: 'Notes',
      required: false,
    }),
    customFieldsValues: Property.Json({
      displayName: 'Custom fields values (JSON)',
      description: 'Match your custom fields schema',
      required: false,
    }),
  },

  async run(context) {
    const { apiKey: EAapiToken, appUrl } = context.auth;

    // Traitement spécial pour customFieldsValues
    const { customFieldsValues, ...otherProps } = context.propsValue;

    const body: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(otherProps)) {
	    if (v !== undefined && v !== null && v !== '') {
		    body[k] = v;
	    }
    }
    body['customFieldsValues'] = customFieldsValues;

    const response = await httpClient.sendRequest({
      method: HttpMethod.POST,
      url: `${appUrl.replace(/\/$/, '')}/v1/contacts`,
      headers: {
        Authorization: `Bearer ${EAapiToken}`,
        'Content-Type': 'application/json',
      },
      body,
    });

    return response.status === 201 ? response.body : response;
  },
});

export const updateContact = createAction({
  auth: easiwareAuth,
  name: 'update_contact',
  displayName: 'Update a Contact',
  description: 'Update an existing contact by ID.',

  props: {
    id: Property.ShortText({
      displayName: 'Contact ID',
      description: 'easiware internal identifier for the contact to update',
      required: true,
    }),

    email: Property.ShortText({
      displayName: 'Email Address',
      description: "The contact's email address (must be unique).",
      required: false,
    }),
    firstName: Property.ShortText({
      displayName: 'First name',
      description: "The contact's first name.",
      required: false,
    }),
    lastName: Property.ShortText({
      displayName: 'Last name',
      description: "The contact's last name.",
      required: false,
    }),
    phoneNumber: Property.ShortText({
      displayName: 'Phone number',
      description: 'Phone in E.164 format, e.g. +33782453467',
      required: false,
    }),
    civilStatus: Property.StaticDropdown({
      displayName: 'Civil Status',
      description: "The contact's civil title",
      required: false,
      options: {
        options: [
          { label: 'Mr',  value: 'Mr'  },
          { label: 'Mrs', value: 'Mrs' },
        ],
      },
    }),
    birthday: Property.DateTime({
      displayName: 'Birthday',
      description: "The contact's birth date (YYYY-MM-DD)",
      required: false,
    }),
    companyName: Property.ShortText({
      displayName: 'Company name',
      description: "The contact's company name",
      required: false,
    }),
    streetName: Property.ShortText({
      displayName: 'Street address',
      description: "The contact's street address",
      required: false,
    }),
    cityName: Property.ShortText({
      displayName: 'City name',
      description: "The contact's city",
      required: false,
    }),
    stateName: Property.ShortText({
      displayName: 'State / Region',
      description: 'Province or region',
      required: false,
    }),
    zipCode: Property.ShortText({
      displayName: 'Postal code',
      description: "The contact's postal code",
      required: false,
    }),
    countryCode: Property.ShortText({
      displayName: 'Country code',
      description: 'The country code iso3166 alpha-2 exemple: FR',
      required: false,
    }),
    languageCode: Property.ShortText({
      displayName: 'Country code',
      description: 'The country code iso3166 alpha-2 exemple: FR',
      required: false,
    }),
    notes: Property.ShortText({
      displayName: 'Notes',
      description: 'Additional information about the contact',
      required: false,
    }),
    customFieldsValues: Property.Json({
      displayName: 'Custom fields values',
      description:
        'JSON object containing custom fields (must match fields defined in your solution).',
      required: false,
    }),
  },

  async run(context) {
    const { apiKey: EAapiToken, appUrl } = context.auth;

    const { id, ...rawProps } = context.propsValue;

    // Traitement spécial pour customFieldsValues
    const { customFieldsValues, ...otherProps } = rawProps;

    const body: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(otherProps)) {
	    if (v !== undefined && v !== null && v !== '') {
		    body[k] = v;
	    }
    }
    body['customFieldsValues'] = customFieldsValues;
    const response = await httpClient.sendRequest({
	    method: HttpMethod.PATCH,
	    url: `${appUrl.replace(/\/$/, '')}/v1/contacts/${id}`,
	    headers: {
		    Authorization: `Bearer ${EAapiToken}`,
		    'Content-Type': 'application/json',
	    },
	    body,
    });

    return response.status === 200 ? response.body : response;
  },
});


export const listContactCustomFields = createAction({
  auth: easiwareAuth,
  name: 'list_contact_custom_fields',
  displayName: 'List Contact Custom Fields',
  description: 'Retrieve the list of custom field definitions for contacts.',

  props: {
    search: Property.ShortText({
      displayName: 'Search Text',
      description: 'Required search string to filter custom fields.',
      required: false,
    }),
  },

  async run(context) {
    const { apiKey: token, appUrl } = context.auth;
    const { search } = context.propsValue;

    const url = `${appUrl.replace(/\/$/, '')}/v1/contact-custom-fields`;

    const request: HttpRequest = {
      method: HttpMethod.GET,
      url,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    // Ajoute le query param seulement si `search` n’est pas vide / blanc
    if (typeof search === 'string' && search.trim() !== '') {
      request.queryParams= { search: search.trim() };
    }

    const response = await httpClient.sendRequest(request);
    return response.status === 200 ? response.body : response;
  },
});


export const getContactCustomFieldChoices = createAction({
  auth: easiwareAuth,
  name: 'get_contact_custom_field_choices',
  displayName: 'Get Contact Custom Field Choices',
  description: 'Retrieve available choices for the specified contact custom field.',

  props: {
    customId: Property.ShortText({
      displayName: 'Custom Field ID',
      description: 'The customId of the contact custom field.',
      required: true,
    }),
  },

  async run(context) {
    const { apiKey: token, appUrl } = context.auth;
    const { customId } = context.propsValue;

    const url = `${appUrl.replace(/\/$/, '')}/v1/contact-custom-fields/${customId}/choices`;

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
