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
    recordType: 'lead'
  })

  if (!schema) {
    schema = await FieldSchema.create({
      customerId: userId,
      recordType: 'lead',
      properties: new Map(Object.entries({
        id: { type: 'string', title: 'ID' },
        firstName: { type: 'string', title: 'First Name' },
        lastName: { type: 'string', title: 'Last Name' },
        email: { type: 'string', title: 'Email', format: 'email' },
        status: {
          type: 'string',
          title: 'Status',
          enum: ['New', 'Contacted', 'Qualified', 'Unqualified'],
          default: 'New'
        }
      })),
      required: ['id', 'firstName', 'lastName', 'email']
    })
  }

  return NextResponse.json({
    schema: {
      type: "object",
      properties: Object.fromEntries(schema.properties),
      required: schema.required
    }
  })
}

export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  // Same as contacts POST handler but with recordType: 'lead'
  // ... implementation
} 