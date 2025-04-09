import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  context: { params: Promise<{ userId: string }> }
) {
  const { userId } = await context.params

  const schema = {
    schema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          title: "ID"
        },
        name: {
          type: "string",
          title: "Company Name"
        },
        website: {
          type: "string",
          title: "Website",
          format: "uri"
        },
        industry: {
          type: "string",
          title: "Industry",
          enum: ["Technology", "Healthcare", "Finance", "Manufacturing", "Retail", "Other"]
        },
        size: {
          type: "string",
          title: "Company Size",
          enum: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"]
        },
        phone: {
          type: "string",
          title: "Phone Number",
          format: "phone"
        },
        address: {
          type: "string",
          title: "Address"
        },
        city: {
          type: "string",
          title: "City"
        },
        state: {
          type: "string",
          title: "State"
        },
        country: {
          type: "string",
          title: "Country"
        },
        status: {
          type: "string",
          title: "Status",
          enum: ["Active", "Inactive", "Prospect"],
          default: "Active"
        }
      },
      required: ["id", "name", "industry", "status"]
    }
  }

  return NextResponse.json(schema)
} 