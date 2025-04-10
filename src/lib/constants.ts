export const RECORD_ACTIONS = [
  {
    key: 'get-contacts',
    name: 'Contacts',
    type: 'default'
  },
  {
    key: 'get-leads',
    name: 'Leads',
    type: 'default'
  },
  {
    key: 'get-companies',
    name: 'Companies',
    type: 'default'
  },
  {
    key: 'get-deals',
    name: 'Deals',
    type: 'default'
  }
] as const;

export type RecordActionKey = typeof RECORD_ACTIONS[number]['key'] | string; 