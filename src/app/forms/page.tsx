"use client"

import { useState } from "react"
import { Select } from "@/components/ui/select"
import { RECORD_ACTIONS } from "@/lib/constants"
import { RecordActionKey } from "@/lib/constants"
import { DynamicForm } from "./components/dynamic-form"

export default function FormsPage() {
  const [selectedAction, setSelectedAction] = useState<RecordActionKey | ''>('')

  return (
    <div className="container mx-auto py-10 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Forms</h1>
        <p className="text-muted-foreground mt-2">
          Select a record type to view and edit its form
        </p>
      </div>

      {/* Record Type Selection */}
      <div className="grid gap-6">
        <Select
          value={selectedAction}
          onChange={(e) => setSelectedAction(e.target.value as RecordActionKey)}
          className="w-full max-w-md"
        >
          <option value="">Select record type</option>
          {RECORD_ACTIONS.map((action) => (
            <option key={action.key} value={action.key}>
              {action.name}
            </option>
          ))}
        </Select>
      </div>

      {/* Dynamic Form */}
      {selectedAction && (
        <DynamicForm recordType={selectedAction} />
      )}
    </div>
  )
} 