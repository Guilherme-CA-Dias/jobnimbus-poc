import useSWR from 'swr'
import { useAuth } from '@/app/auth-provider'
import { JSONSchema } from '@/types/contact-schema'

export function useSchema(recordType: string) {
  const { customerId } = useAuth()
  
  // Remove 'get-' prefix and handle pluralization
  const schemaType = recordType.replace('get-', '').replace(/s$/, '') + 's'
  
  const { data, error, isLoading } = useSWR<{ schema: JSONSchema }>(
    customerId && recordType ? `/api/schema/${schemaType}/${customerId}` : null,
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
    error
  }
} 