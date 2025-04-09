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
    recordType: 'company'
  })

  if (!schema) {
    schema = await FieldSchema.create({
      customerId: userId,
      recordType: 'company',
      properties: new Map(Object.entries({
        id: { type: 'string', title: 'ID' },
        name: { type: 'string', title: 'Company Name' },
        website: { type: 'string', title: 'Website', format: 'uri' },
        industry: {
          type: 'string',
          title: 'Industry',
          enum: ['Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Retail', 'Other']
        }
      })),
      required: ['id', 'name']
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
  // Same as contacts POST handler but with recordType: 'company'
  // ... implementation
} 