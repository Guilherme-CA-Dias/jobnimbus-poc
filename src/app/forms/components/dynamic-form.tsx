"use client"

import { useSchema } from "@/hooks/useSchema"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

interface DynamicFormProps {
  recordType: string
}

export function DynamicForm({ recordType }: DynamicFormProps) {
  const { schema, isLoading, error } = useSchema(recordType)
  const [formData, setFormData] = useState<Record<string, any>>({})

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

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      {Object.entries(schema.properties).map(([name, field]) => {
        const isRequired = schema.required?.includes(name)

        // Debug log for each field
        console.log('Rendering field:', { name, field, value: formData[name], isEnum: !!field.enum })

        if (field.enum) {
          return (
            <div key={name} className="space-y-1">
              <Label htmlFor={name} className="text-sm">
                {field.title}
                {isRequired && <span className="text-red-500 ml-1">*</span>}
              </Label>
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
          )
        }

        return (
          <div key={name} className="space-y-1">
            <Label htmlFor={name} className="text-sm">
              {field.title}
              {isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
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
        )
      })}

      <Button type="submit" className="mt-4">
        Submit
      </Button>
    </form>
  )
} 