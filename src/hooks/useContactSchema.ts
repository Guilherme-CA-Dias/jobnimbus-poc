import useSWR from 'swr'
import { FormField } from '@/types/contact-schema'

export function useContactSchema(userId: string) {
  const { data, error, isLoading } = useSWR<FormField[]>(
    userId ? `/api/schema/contacts/${userId}` : null,
    async (url: string) => {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch contact schema')
      }
      
      return response.json()
    }
  )

  return {
    fields: data,
    isLoading,
    error,
  }
} 