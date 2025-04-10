export interface SchemaField {
  type: string
  title: string
  format?: string
  enum?: string[]
  default?: string
}

export interface MongoSchemaProperty extends SchemaField {
  toObject(): SchemaField
} 