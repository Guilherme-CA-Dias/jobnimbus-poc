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
        firstName: {
          type: "string",
          title: "First Name"
        },
        lastName: {
          type: "string",
          title: "Last Name"
        },
        email: {
          type: "string",
          title: "Email",
          format: "email"
        },
        phone: {
          type: "string",
          title: "Phone Number",
          format: "phone"
        },
        source: {
          type: "string",
          title: "Lead Source",
          enum: ["Website", "Referral", "Social Media", "Event", "Other"]
        },
        status: {
          type: "string",
          title: "Lead Status",
          enum: ["New", "Contacted", "Qualified", "Unqualified"],
          default: "New"
        }
      },
      required: ["id", "firstName", "lastName", "email", "status"]
    }
  }

  return NextResponse.json(schema)
} 