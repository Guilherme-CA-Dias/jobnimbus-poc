"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/app/auth-provider"
import { useSchema } from "@/hooks/useSchema"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { AddFieldButton } from "./add-field-button"
import type { JSONSchema } from "@/types/contact-schema"

interface DynamicFormProps {
  recordType: string
}

export function DynamicForm({ recordType }: DynamicFormProps) {
  const { customerId } = useAuth()
  const { schema, isLoading, error, mutate } = useSchema(recordType)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [deleting, setDeleting] = useState<string | null>(null)

  // Initialize form data with default values when schema loads
  useEffect(() => {
    if (schema) {
      const defaults: Record<string, any> = {}
      Object.entries(schema.properties).forEach(([name, field]) => {
        if (field.default) {
          defaults[name] = field.default
        }
      })
      setFormData(defaults)
    }
  }, [schema])

  if (isLoading) return <div>Loading form schema...</div>
  if (error) return <div>Error loading form schema</div>
  if (!schema) return null

  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
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
      <div className="space-y-4 max-w-2xl">
        {Object.entries(schema.properties).map(([name, field]) => (
          <div key={name} className="space-y-2">
            <Label>{field.title}</Label>
            {field.type === 'select' ? (
              <Select
                value={formData[name] || ''}
                onChange={(e) => handleInputChange(name, e.target.value)}
              >
                <option value="">
                  Select {field.title.toLowerCase()}
                </option>
                {field.enum?.map((option: string) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            ) : (
              <Input
                type={field.format === 'email' ? 'email' : 'text'}
                value={formData[name] || ''}
                onChange={(e) => handleInputChange(name, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
} 