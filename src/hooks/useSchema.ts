import useSWR from 'swr'
import { useAuth } from '@/app/auth-provider'
import { JSONSchema } from '@/types/contact-schema'

export function useSchema(recordType: string) {
  const { customerId } = useAuth()
  
  // Remove 'get-' prefix
  const formId = recordType.replace('get-', '')
  
  const { data, error, isLoading, mutate } = useSWR<{ schema: JSONSchema }>(
    customerId && formId ? `/api/schema/${formId}/${customerId}` : null,
    async (url) => {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Failed to fetch schema')
      }
      return response.json()
    }
  )

  return {
    schema: data?.schema,
    isLoading,
    error,
    mutate
  }
} 