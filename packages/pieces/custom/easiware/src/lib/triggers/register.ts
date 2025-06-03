import {
  PiecePropValueSchema,
  Property,
  TriggerStrategy,
  createTrigger,
} from '@activepieces/pieces-framework';
import {
  httpClient,
  HttpRequest,
  HttpMethod,
} from '@activepieces/pieces-common';
import { easiwareAuth } from '../..';

export const easiwareRegisterTrigger = ({
  name,
  displayName,
  eventType,
  eventCategory,
  description,
  sampleData,
  type,
}: {
  name: string;
  displayName: string;
  eventType: string | any[];
  eventCategory: string;
  description: string;
  sampleData: unknown;
  type: TriggerStrategy;
}) => {
  const props: Record<string, any> = {};
  let onEnable: (context: any) => Promise<void>;

  /* ───────────── Cas 1 : eventType est une chaîne ───────────── */
  if (typeof eventType === 'string') {
    onEnable = async (context) => {
      const response = await httpClient.sendRequest({
        method: HttpMethod.POST,
        url: `${context.auth.appUrl}/v1/webhooks`,
        body: {
          url: context.webhookUrl,
          eventType,
          category: eventCategory,
        },
        headers: {
          Authorization: `Bearer ${context.auth.apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      await context.store.put(`easiware_${name}_trigger`, response.body);
    };
  }
  // ─── Cas 2 : eventType est [label, Record]  ──────────────────────────
  else {
    const [dropdownLabel, dict] = eventType as [string, Record<string,string>];
    props['eventType'] = Property.StaticDropdown({
      displayName: dropdownLabel,
      description: 'Choose the event type to listen for',
      required: true,
      options: {
        disabled: false,
        options: Object.entries(dict).map(([value, label]) => ({
          label,
          value,
        })),
      },
    });

    onEnable = async (context) => {
      const response = await httpClient.sendRequest({
        method: HttpMethod.POST,
        url: `${context.auth.appUrl}/v1/webhooks`,
        body: {
          url: context.webhookUrl,
          eventType: context.propsValue.eventType,
          category: eventCategory,
        },
        headers: {
          Authorization: `Bearer ${context.auth.apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      await context.store.put(`easiware_${name}_trigger`, response.body);
    };
  }

  /* ───────────── Création du trigger ───────────── */
  return createTrigger({
    auth: easiwareAuth,
    name: `easiware_trigger_${name}`,
    displayName,
    description,
    props,
    sampleData,
    type,
    onEnable,
    async onDisable(context: any) {                         // ← TS7006
      const webhook = await context.store.get(`easiware_${name}_trigger`);
      if (webhook?.data.id) {
        const request: HttpRequest = {
          method: HttpMethod.POST,
          url: `${context.auth.appUrl}/v1/webhooks/${webhook.data.id}/detach`,
          headers: {
            Authorization: `Bearer ${context.auth.apiKey}`,
            'Content-Type': 'application/json',
          },
        };
        await httpClient.sendRequest(request);
      }
    },
    async run(context: any) {
      return [context.payload.body];
    },
  });
};
