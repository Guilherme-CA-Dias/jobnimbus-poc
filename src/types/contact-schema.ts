export type FieldType = 'text' | 'select' | 'phone'

export interface FormField {
  name: string
  label: string
  type: FieldType
  required: boolean
  options?: string[] // For select fields
  defaultValue?: string
}

export interface ContactFormSchema {
  fields: FormField[]
}

export interface JSONSchemaProperty {
  type: string
  title: string
  format?: string
  enum?: string[]
  default?: string
}

export interface JSONSchema {
  type: "object"
  properties: Record<string, JSONSchemaProperty>
  required?: string[]
}

export interface SchemaResponse {
  schema: JSONSchema
}

export interface SchemaProperty {
  type: string
  title: string
  format?: string
  enum?: string[]
  default?: string
  toObject(): SchemaProperty
} 