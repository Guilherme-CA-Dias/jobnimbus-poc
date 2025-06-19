export const RECORD_ACTIONS = [
  {
    key: 'get-contacts',
    name: 'Contacts',
    type: 'default'
  },
  {
    key: 'get-payments',
    name: 'Payments',
    type: 'default'
  }
] as const;

export type RecordActionKey = typeof RECORD_ACTIONS[number]['key'] | string; 