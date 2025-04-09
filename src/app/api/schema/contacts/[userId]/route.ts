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
    recordType: 'contact'
  })

  if (!schema) {
    schema = await FieldSchema.create({
      customerId: userId,
      recordType: 'contact',
      properties: new Map(Object.entries({
        id: { 
          type: 'string', 
          title: 'ID' 
        },
        name: { 
          type: 'string', 
          title: 'Name' 
        },
        email: { 
          type: 'string', 
          title: 'Email', 
          format: 'email' 
        },
        phone: { 
          type: 'string', 
          title: 'Phone Number', 
          format: 'phone' 
        },
        status: { 
          type: 'string', 
          title: 'Status',
          enum: ['Active', 'Inactive', 'Pending'],
          default: 'Active'
        }
      })),
      required: ['id', 'name', 'email']
    })
  }

  const cleanProperties = Object.fromEntries(
    Array.from(schema.properties.entries()).map(([key, value]) => {
      const cleanValue = { ...value.toObject() }
      if (!cleanValue.enum || cleanValue.enum.length === 0) {
        delete cleanValue.enum;
      }
      if (!cleanValue.format) {
        delete cleanValue.format;
      }
      if (!cleanValue.default) {
        delete cleanValue.default;
      }
      return [key, cleanValue];
    })
  );

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
    recordType: 'contact'
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
           field.type === 'phone' ? 'phone' : undefined,
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
    Array.from(schema.properties.entries()).map(([key, value]) => {
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
    recordType: 'contact'
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
  schema.required = schema.required.filter(name => name !== fieldName)

  await schema.save()

  const cleanProperties = Object.fromEntries(
    Array.from(schema.properties.entries()).map(([key, value]) => {
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