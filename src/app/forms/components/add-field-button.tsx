"use client"

import { useState } from "react"
import { useAuth } from "@/app/auth-provider"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"

interface AddFieldButtonProps {
  recordType: string
  onFieldAdded: () => void
}

export function AddFieldButton({ recordType, onFieldAdded }: AddFieldButtonProps) {
  const { customerId } = useAuth()
  const [open, setOpen] = useState(false)
  const [fieldData, setFieldData] = useState({
    name: '',
    title: '',
    type: 'text',
    required: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!customerId) {
      console.error('No customer ID found')
      return
    }

    // Validate field data
    if (!fieldData.name || !fieldData.title) {
      console.error('Name and title are required')
      return
    }

    try {
      // Remove 'get-' prefix and ensure plural form
      const schemaType = recordType.replace('get-', '')
      console.log('Submitting field:', fieldData, 'to schema type:', schemaType)

      const response = await fetch(`/api/schema/${schemaType}/${customerId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ field: fieldData })
      })

      if (!response.ok) {
        const error = await response.text()
        console.error('Failed to add field:', error)
        return
      }

      const result = await response.json()
      console.log('Field added successfully:', result)

      setOpen(false)
      setFieldData({ name: '', title: '', type: 'text', required: false })
      onFieldAdded()
    } catch (error) {
      console.error('Error adding field:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 bg-primary hover:bg-primary-600 transition-colors">
          <Plus className="h-4 w-4" />
          Add Field
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white dark:bg-gray-950">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-gray-50">Add New Field</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name" className="text-sm text-gray-900 dark:text-gray-50">Field Name</Label>
            <Input
              id="name"
              value={fieldData.name}
              onChange={(e) => setFieldData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., phoneNumber"
              className="h-9 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50 border-gray-200 dark:border-gray-800"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="title" className="text-sm text-gray-900 dark:text-gray-50">Display Title</Label>
            <Input
              id="title"
              value={fieldData.title}
              onChange={(e) => setFieldData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Phone Number"
              className="h-9 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50 border-gray-200 dark:border-gray-800"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="type" className="text-sm text-gray-900 dark:text-gray-50">Field Type</Label>
            <select
              id="type"
              className="flex h-9 w-full rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-1 text-sm 
                ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                text-gray-900 dark:text-gray-50"
              value={fieldData.type}
              onChange={(e) => setFieldData(prev => ({ ...prev, type: e.target.value }))}
            >
              <option value="text">Text</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="select">Select</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="required"
              checked={fieldData.required}
              onChange={(e) => setFieldData(prev => ({ ...prev, required: e.target.checked }))}
              className="h-4 w-4 rounded border-gray-200 dark:border-gray-800"
            />
            <Label htmlFor="required" className="text-sm font-normal text-gray-900 dark:text-gray-50">Required Field</Label>
          </div>
          <Button type="submit" className="w-full">Add Field</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
} 