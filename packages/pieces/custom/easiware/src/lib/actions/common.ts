import { Property } from '@activepieces/pieces-framework';
import { QueryParams } from '@activepieces/pieces-common';

/************************************
 * SHARED OPTION LISTS
 * Reused across webhook, template,
 * layout, knowledge-base and trigger
 * definitions.
 ***********************************/

/** Webhook event types (25 values) — shared by webhook actions and triggers. */
export const webhookEventTypeOptions = [
  { label: 'Create', value: 'create' },
  { label: 'Note', value: 'note' },
  { label: 'Subject', value: 'subject' },
  { label: 'Status', value: 'status' },
  { label: 'Category', value: 'category' },
  { label: 'Priority', value: 'priority' },
  { label: 'Agent', value: 'agent' },
  { label: 'Current Channel', value: 'currentChannel' },
  { label: 'Contact', value: 'contact' },
  { label: 'Message', value: 'message' },
  { label: 'Solicitation', value: 'solicitation' },
  { label: 'Delete', value: 'delete' },
  { label: 'Restore', value: 'restore' },
  { label: 'Competence Group', value: 'competence_group' },
  { label: 'AI Request Summary', value: 'ai_request_summary' },
  { label: 'AI Summary', value: 'ai_summary' },
  { label: 'AI Request Terminated', value: 'ai_request_terminated' },
  { label: 'AI Auto Categorized', value: 'ai_auto_categorized' },
  { label: 'Ticket Link', value: 'ticket_link' },
  { label: 'Ticket Unlink', value: 'ticket_unlink' },
  { label: 'Ticket Suggestion', value: 'ticket_suggestion' },
  { label: 'Average Handling Time', value: 'average_handling_time' },
  { label: 'CSAT Rating', value: 'csat_rating' },
  { label: 'CSAT Comment', value: 'csat_comment' },
  { label: 'CSAT Email Sent', value: 'csat_email_sent' },
];

/** Supported languages for templates and layouts. */
export const languageOptions = [
  { label: 'German', value: 'de' },
  { label: 'English', value: 'en' },
  { label: 'French', value: 'fr' },
  { label: 'Dutch', value: 'nl' },
  { label: 'Italian', value: 'it' },
  { label: 'Portuguese', value: 'pt' },
  { label: 'Spanish', value: 'es' },
];

/************************************
 * SHARED HELPER UTILS
 * Centralised helpers used across all
 * easiware action files.
 ***********************************/

/** Build the standard Bearer + JSON headers. */
export const buildHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
});

/**
 * Remove keys whose value is undefined / null / empty-string and
 * stringify the remaining ones so they can be used as query params.
 */
export const sanitize = (obj: Record<string, unknown>): QueryParams =>
  Object.fromEntries(
    Object.entries(obj)
      .filter(([, v]) => v !== undefined && v !== null && v !== '')
      .map(([k, v]) => [k, String(v)])
  );

/** Strip a single trailing slash from a URL. */
export const base = (url: string) => url.replace(/\/$/, '');

/************************************
 * SHARED PAGINATION PROPS
 * Several GET endpoints now require
 * `page` and `limit` query params.
 ***********************************/

export const pageProp = Property.Number({
  displayName: 'Page',
  description: 'Page number to retrieve (1-based).',
  required: true,
  defaultValue: 1,
});

export const limitProp = Property.Number({
  displayName: 'Limit',
  description: 'Maximum number of items to return per page.',
  required: true,
  defaultValue: 20,
});
