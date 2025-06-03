import { easiwareRegisterTrigger } from './register';
import { TriggerStrategy } from '@activepieces/pieces-framework';

export const triggers = [
  {
    name: 'ticket_created',
    eventType: 'create',
    eventCategory: 'ticket',
    displayName: 'Ticket Created',
    description: 'Triggered when a new ticket is created.',
    type: TriggerStrategy.WEBHOOK,
    sampleData: {
      "class": "ticket",
      "id": "61b3549b-0d5a-4555-b918-a090c149f2ea",
      "eventType": "create",
      "eventId": "78d67def-8073-4eda-8a1f-b19b5100e8bf"
    },
  },
  {
    name: 'contact_created',
    eventType: 'create',
    eventCategory: 'contact',
    displayName: 'Contact Created',
    description: 'Triggered when a new contact is created.',
    type: TriggerStrategy.WEBHOOK,
    sampleData: {
      "class": "contact",
      "id": "61b3549b-0d5a-4555-b918-a090c149f2ea",
      "eventType": "create",
      "eventId": "78d67def-8073-4eda-8a1f-b19b5100e8bf"
    },
  },
  {
    name: 'ticket_event',
    eventType: [ 'Select the Event Type', { 'create': 'Ticket is Created', 'note': 'Note has changed', 'subject': 'Subject has changed', 'status': 'Status has changed', 'category': 'Category has changed', 'priority': 'priority has changed', 'agent': 'Agent has changed', 'currentChannel': 'Current channel has changed', 'contact': 'Ticket has changed', 'message': 'New message has arrived', 'solicitation': 'Solicitation was send', 'delete': 'Ticket was deleted', 'restore': 'Ticket as restored', }, ],
    eventCategory: 'ticket',
    displayName: 'Ticket Event',
    description: 'Triggered when a new event is received for the ticket.',
    type: TriggerStrategy.WEBHOOK,
    sampleData: {
      "class": "contact",
      "id": "61b3549b-0d5a-4555-b918-a090c149f2ea",
      "eventType": "create",
      "eventId": "78d67def-8073-4eda-8a1f-b19b5100e8bf"
    },
  },
].map((props) => easiwareRegisterTrigger(props));
