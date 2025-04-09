import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { FieldSchema } from '@/models/schema'

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = await Promise.resolve(params)
  
  await connectToDatabase()

  let schema = await FieldSchema.findOne({
    customerId: userId,
    recordType: 'deal'
  })

  if (!schema) {
    schema = await FieldSchema.create({
      customerId: userId,
      recordType: 'deal',
      properties: new Map(Object.entries({
        id: { 
          type: 'string', 
          title: 'ID' 
        },
        name: { 
          type: 'string', 
          title: 'Deal Name' 
        },
        amount: { 
          type: 'string', 
          title: 'Amount',
          format: 'currency'
        },
        stage: { 
          type: 'string', 
          title: 'Stage',
          enum: ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'],
          default: 'Prospecting'
        },
        closeDate: {
          type: 'string',
          title: 'Close Date',
          format: 'date'
        }
      })),
      required: ['id', 'name', 'amount']
    })
  }

  const cleanProperties = Object.fromEntries(
    Array.from(schema.properties.entries()).map(([key, value]: [string, any]) => {
      const cleanValue = { ...value.toObject() }
      if (!cleanValue.enum || cleanValue.enum.length === 0) {
        delete cleanValue.enum
      }
      if (!cleanValue.format) {
        delete cleanValue.format
      }
      if (!cleanValue.default) {
        delete cleanValue.default
      }
      return [key, cleanValue]
    })
  )

  return NextResponse.json({
    schema: {
      type: "object",
      properties: cleanProperties,
      required: schema.required
    }
  })
}

export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = await Promise.resolve(params)
  const { field } = await request.json()
  
  console.log('Received field data:', field)

  await connectToDatabase()

  let schema = await FieldSchema.findOne({
    customerId: userId,
    recordType: 'deal'
  })

  if (!schema) {
    return NextResponse.json(
      { error: 'Schema not found' },
      { status: 404 }
    )
  }

  const newField = {
    type: field.type,
    title: field.title,
    format: field.type === 'email' ? 'email' : 
           field.type === 'phone' ? 'phone' :
           field.type === 'currency' ? 'currency' :
           field.type === 'date' ? 'date' : undefined,
    ...(field.type === 'select' ? { enum: [] } : {}),
    ...(field.default ? { default: field.default } : {})
  }

  console.log('Setting new field:', field.name, newField)

  schema.properties.set(field.name, newField)

  if (field.required) {
    schema.required = [...(schema.required || []), field.name]
  }

  await schema.save()

  const cleanProperties = Object.fromEntries(
    Array.from(schema.properties.entries()).map(([key, value]: [string, any]) => {
      const cleanValue = { ...value.toObject() }
      if (!cleanValue.enum || cleanValue.enum.length === 0) {
        delete cleanValue.enum
      }
      if (!cleanValue.format) {
        delete cleanValue.format
      }
      if (!cleanValue.default) {
        delete cleanValue.default
      }
      return [key, cleanValue]
    })
  )

  return NextResponse.json({
    schema: {
      type: "object",
      properties: cleanProperties,
      required: schema.required
    }
  })
}

export async function DELETE(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = await Promise.resolve(params)
  const { fieldName } = await request.json()
  
  console.log('Deleting field:', fieldName)

  await connectToDatabase()

  let schema = await FieldSchema.findOne({
    customerId: userId,
    recordType: 'deal'
  })

  if (!schema) {
    return NextResponse.json(
      { error: 'Schema not found' },
      { status: 404 }
    )
  }

  // Remove the field from properties
  schema.properties.delete(fieldName)
  
  // Remove from required fields if it was required
  schema.required = schema.required.filter((name: string) => name !== fieldName)

  await schema.save()

  const cleanProperties = Object.fromEntries(
    Array.from(schema.properties.entries()).map(([key, value]: [string, any]) => {
      const cleanValue = { ...value.toObject() }
      if (!cleanValue.enum || cleanValue.enum.length === 0) {
        delete cleanValue.enum
      }
      if (!cleanValue.format) {
        delete cleanValue.format
      }
      if (!cleanValue.default) {
        delete cleanValue.default
      }
      return [key, cleanValue]
    })
  )

  return NextResponse.json({
    schema: {
      type: "object",
      properties: cleanProperties,
      required: schema.required
    }
  })
} 