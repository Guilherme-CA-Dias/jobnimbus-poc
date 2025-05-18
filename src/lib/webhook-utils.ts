import { RECORD_ACTIONS } from '@/lib/constants';

interface WebhookPayloadData {
    id: string
    name?: string
    websiteUrl?: string
    phones?: Array<{
      value: string
      type: string
    }>
    primaryPhone?: string
    description?: string
    currency?: string
    industry?: string
    ownerId?: string
    primaryAddress?: {
      type?: string
      full?: string
      street?: string
      city?: string
      state?: string
      country?: string
      zip?: string
    }
    addresses?: Array<{
      type?: string
      full?: string
      street?: string
      city?: string
      state?: string
      country?: string
      zip?: string
    }>
    numberOfEmployees?: number
    createdTime?: string
    createdBy?: string
    updatedTime?: string
    updatedBy?: string
    lastActivityTime?: string
  }
  
  interface WebhookPayload {
    type: 'created' | 'updated' | 'deleted'
    data: WebhookPayloadData
    customerId: string
    internalContactId?: string
    externalContactId?: string
  }
  
  // Define webhook URLs for default record types
  const WEBHOOK_URLS = {
    tasks: 'https://api.integration.app/webhooks/app-events/4bd9f7cc-f295-4eac-bd78-d051bc127f59',
    contacts: 'https://api.integration.app/webhooks/app-events/7cb4f624-01f5-4662-b886-68b9461b8b0a',
    companies: 'https://api.integration.app/webhooks/app-events/cd9f4430-8f4e-45a4-badd-9d4666078540',
    // Default URL for custom objects
    custom: 'https://api.integration.app/webhooks/app-events/19c8f829-0723-4030-9164-95398285f5da'
  };
  
  // Get default form types from RECORD_ACTIONS
  const defaultFormTypes = RECORD_ACTIONS
    .filter(action => action.type === 'default')
    .map(action => action.key.replace('get-', ''));
  
  export async function sendToWebhook(payload: any) {
    try {
      // Determine if this is a default or custom record type
      const recordType = payload.data?.recordType || '';
      const isDefaultType = defaultFormTypes.includes(recordType);
      
      // Select the appropriate webhook URL
      let webhookUrl = WEBHOOK_URLS.custom;
      if (isDefaultType && recordType in WEBHOOK_URLS) {
        webhookUrl = WEBHOOK_URLS[recordType as keyof typeof WEBHOOK_URLS];
      }
      
      // For custom objects, add instanceKey to the payload
      let finalPayload = { ...payload };
      if (!isDefaultType) {
        finalPayload = {
          ...finalPayload,
          instanceKey: recordType
        };
      }
      
      // Send the webhook
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(finalPayload)
      });
      
      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error sending webhook:', error);
      throw error;
    }
  } 