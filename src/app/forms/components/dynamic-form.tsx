"use client"

import { useSchema } from "@/hooks/useSchema"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import { AddFieldButton } from './add-field-button'
import { JSONSchema } from '@/types/contact-schema'
import { useAuth } from "@/app/auth-provider"

interface DynamicFormProps {
  recordType: string
}

export function DynamicForm({ recordType }: DynamicFormProps) {
  const { customerId } = useAuth()
  const { schema, isLoading, error, mutate } = useSchema(recordType) as {
    schema: JSONSchema | undefined;
    isLoading: boolean;
    error: any;
    mutate: () => Promise<any>;
  }
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [deleting, setDeleting] = useState<string | null>(null)

  // Debug logs
  useEffect(() => {
    if (schema) {
      console.log('Schema loaded:', schema)
      console.log('Schema properties:', schema.properties)
    }
  }, [schema])

  // Initialize form data with default values when schema loads
  useEffect(() => {
    if (schema) {
      const defaults: Record<string, any> = {}
      Object.entries(schema.properties).forEach(([name, field]) => {
        if (field.default) {
          defaults[name] = field.default
        }
      })
      console.log('Setting defaults:', defaults)
      setFormData(defaults)
    }
  }, [schema])

  if (isLoading) return <div>Loading form schema...</div>
  if (error) return <div>Error loading form schema</div>
  if (!schema) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form data:', formData)
    // Here you would typically send the data to your backend
  }

  const handleInputChange = (name: string, value: any) => {
    console.log('Handling input change:', { name, value })
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleDeleteField = async (fieldName: string) => {
    if (!customerId || !fieldName) return
    
    try {
      setDeleting(fieldName)
      const schemaType = recordType.replace('get-', '')
      
      const response = await fetch(`/api/schema/${schemaType}/${customerId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fieldName })
      })

      if (!response.ok) {
        throw new Error('Failed to delete field')
      }

      // Remove field from form data
      const newFormData = { ...formData }
      delete newFormData[fieldName]
      setFormData(newFormData)

      // Refresh the schema
      await mutate()
    } catch (error) {
      console.error('Error deleting field:', error)
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold">Form Fields</h2>
        <AddFieldButton 
          recordType={recordType} 
          onFieldAdded={() => mutate()} 
        />
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        {Object.entries(schema.properties).map(([name, field]) => {
          const isRequired = schema.required?.includes(name)
          const hasEnum = Array.isArray(field.enum) && field.enum.length > 0
          const isDefaultField = ['id', 'name', 'email'].includes(name) // Protect default fields

          // Debug log for each field
          console.log('Rendering field:', { name, field, value: formData[name], isEnum: hasEnum })

          if (hasEnum) {
            return (
              <div key={name} className="group relative">
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <Label htmlFor={name} className="text-sm">
                      {field.title}
                      {isRequired && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    {!isDefaultField && (
                      <button
                        type="button"
                        onClick={() => handleDeleteField(name)}
                        disabled={deleting === name}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <select
                    id={name}
                    className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm 
                      ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                      text-foreground dark:text-white dark:border-gray-800
                      [&>option]:text-gray-900 dark:[&>option]:text-white
                      [&>option]:bg-white dark:[&>option]:bg-gray-800"
                    value={formData[name] || ''}
                    onChange={(e) => handleInputChange(name, e.target.value)}
                    required={isRequired}
                  >
                    <option value="" disabled>
                      Select {field.title.toLowerCase()}
                    </option>
                    {field.enum.map((option: string) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )
          }

          return (
            <div key={name} className="group relative">
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <Label htmlFor={name} className="text-sm">
                    {field.title}
                    {isRequired && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  {!isDefaultField && (
                    <button
                      type="button"
                      onClick={() => handleDeleteField(name)}
                      disabled={deleting === name}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <Input
                  id={name}
                  type={field.format === 'email' ? 'email' : 'text'}
                  value={formData[name] || ''}
                  onChange={(e) => handleInputChange(name, e.target.value)}
                  required={isRequired}
                  placeholder={`Enter ${field.title.toLowerCase()}`}
                  className="h-9"
                />
              </div>
            </div>
          )
        })}

        <Button type="submit" className="mt-4">
          Submit
        </Button>
      </form>
    </div>
  )
} 