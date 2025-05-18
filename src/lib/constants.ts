export const RECORD_ACTIONS = [
  {
    key: 'get-contacts',
    name: 'Contacts',
    type: 'default'
  },
  {
    key: 'get-companies',
    name: 'Companies',
    type: 'default'
  },
  {
    key: 'get-tasks',
    name: 'Tasks',
    type: 'default'
  }
] as const;

export type RecordActionKey = typeof RECORD_ACTIONS[number]['key'] | string; 