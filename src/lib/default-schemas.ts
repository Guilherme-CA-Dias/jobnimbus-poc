export const DEFAULT_SCHEMAS = {
  contacts: {
    properties: {
      id: { type: 'string', title: 'ID' },
      name: { type: 'string', title: 'Name' },
      email: { type: 'string', title: 'Email', format: 'email' },
      phone: { type: 'string', title: 'Phone Number', format: 'phone' },
      status: { 
        type: 'string', 
        title: 'Status',
        enum: ['Active', 'Inactive', 'Pending'],
        default: 'Active'
      }
    },
    required: ['id', 'name', 'email']
  },
  leads: {
    properties: {
      id: { type: 'string', title: 'ID' },
      firstName: { type: 'string', title: 'First Name' },
      lastName: { type: 'string', title: 'Last Name' },
      email: { type: 'string', title: 'Email', format: 'email' },
      status: {
        type: 'string',
        title: 'Status',
        enum: ['New', 'Contacted', 'Qualified', 'Unqualified'],
        default: 'New'
      }
    },
    required: ['id', 'firstName', 'lastName', 'email']
  },
  deals: {
    properties: {
      id: { type: 'string', title: 'ID' },
      name: { type: 'string', title: 'Deal Name' },
      amount: { type: 'string', title: 'Amount', format: 'currency' },
      stage: {
        type: 'string',
        title: 'Stage',
        enum: ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'],
        default: 'Prospecting'
      },
      closeDate: { type: 'string', title: 'Close Date', format: 'date' }
    },
    required: ['id', 'name', 'amount']
  },
  companies: {
    properties: {
      id: { type: 'string', title: 'ID' },
      name: { type: 'string', title: 'Company Name' },
      website: { type: 'string', title: 'Website', format: 'uri' },
      industry: { 
        type: 'string', 
        title: 'Industry',
        enum: ['Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Retail', 'Other']
      },
      size: {
        type: 'string',
        title: 'Company Size',
        enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']
      }
    },
    required: ['id', 'name']
  }
} as const

export type DefaultFormType = keyof typeof DEFAULT_SCHEMAS 