"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/app/auth-provider"
import { useSchema } from "@/hooks/useSchema"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import type { FormDefinition as FormDefinitionModel } from "@/models/form"

// Define FormDefinition type locally to avoid the linter error
type FormDefinition = {
  _id: string
  formId: string
  formTitle: string
  type: 'default' | 'custom'
  integrationKey?: string
  createdAt: string
  updatedAt: string
}

interface SchemaField {
  type: string
  title: string
  format?: string
  enum?: string[]
  default?: string
}

interface Schema {
  type: string
  properties: Record<string, SchemaField>
  required: string[]
}

export default function SubmitFormPage() {
  const { customerId } = useAuth()
  const [selectedForm, setSelectedForm] = useState('')
  const [forms, setForms] = useState<FormDefinition[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { schema, isLoading: schemaLoading, error } = useSchema(selectedForm)
  const [formData, setFormData] = useState<Record<string, any>>({})

  // Fetch available forms
  useEffect(() => {
    const fetchForms = async () => {
      if (!customerId) return

      try {
        setIsLoading(true)
        const response = await fetch(`/api/forms?customerId=${customerId}`)
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch forms')
        }

        setForms(data.forms)
      } catch (error) {
        console.error('Error fetching forms:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchForms()
  }, [customerId])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form data:', formData)
    // Here you would typically send the data to your backend
  }

  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        Loading forms...
      </div>
    )
  }

  if (!selectedForm) {
    return (
      <div className="container mx-auto py-10 space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Submit Form</h1>
        <p className="text-muted-foreground">Select a form to submit</p>
        <Select
          value={selectedForm}
          onChange={(e) => setSelectedForm(e.target.value)}
          className="w-full max-w-md"
        >
          <option value="">Select a form</option>
          {forms.map((form) => (
            <option key={form.formId} value={`get-${form.formId}`}>
              {form.formTitle} {form.type === 'custom' ? '(Custom)' : ''}
            </option>
          ))}
        </Select>
      </div>
    )
  }

  if (schemaLoading) return <div>Loading form schema...</div>
  if (error) return <div>Error loading form schema</div>
  if (!schema) return null

  return (
    <div className="container mx-auto py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Submit Form</h1>
        <p className="text-muted-foreground mt-2">
          Fill in the form fields and submit
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        {Object.entries(schema.properties).map(([name, field]) => {
          // Skip internal fields
          if (name === '_id' || name === 'customerId' || name === 'recordType') {
            return null
          }

          return (
            <div key={name} className="space-y-2">
              <Label>{field.title}</Label>
              {field.enum && field.enum.length > 0 ? (
                <Select
                  value={formData[name] || ''}
                  onChange={(e) => handleInputChange(name, e.target.value)}
                >
                  <option value="">
                    Select {field.title.toLowerCase()}
                  </option>
                  {field.enum.map((option: string) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              ) : (
                <Input
                  type={getInputType(field)}
                  value={formData[name] || ''}
                  onChange={(e) => handleInputChange(name, e.target.value)}
                  placeholder={`Enter ${field.title.toLowerCase()}`}
                />
              )}
            </div>
          )
        })}

        <Button 
          type="submit"
          className="bg-primary hover:bg-primary-600 transition-colors"
        >
          Submit Form
        </Button>
      </form>
    </div>
  )
}

// Helper function to determine input type
function getInputType(field: { type: string; format?: string }): string {
  if (field.format === 'email') return 'email'
  if (field.format === 'date') return 'date'
  if (field.format === 'phone') return 'tel'
  if (field.type === 'number') return 'number'
  return 'text'
} 