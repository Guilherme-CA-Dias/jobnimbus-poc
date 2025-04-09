import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  context: { params: Promise<{ userId: string }> }
) {
  const { userId } = await context.params

  // Define the schema in JSON Schema format
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
          title: "Name"
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
        status: {
          type: "string",
          title: "Status",
          enum: ["Active", "Inactive", "Pending"],
          default: "Active"
        }
      },
      required: ["id", "name", "email", "phone", "status"]
    }
  }

  return NextResponse.json(schema)
} 