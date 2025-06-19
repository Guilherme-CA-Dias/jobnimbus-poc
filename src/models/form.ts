import mongoose from 'mongoose'
import { RECORD_ACTIONS } from '@/lib/constants'

const formDefinitionSchema = new mongoose.Schema({
  customerId: { type: String, required: true },
  formId: { type: String, required: true },
  formTitle: { type: String, required: true },
  type: { type: String, enum: ['default', 'custom'], required: true },
  integrationKey: { type: String, sparse: true }, // Only required for custom forms
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

// Compound index to ensure unique forms per customer
formDefinitionSchema.index({ customerId: 1, formId: 1 }, { unique: true })

export const FormDefinition = mongoose.models.FormDefinition || 
  mongoose.model('FormDefinition', formDefinitionSchema)

// Default forms to be seeded
export const DEFAULT_FORMS = RECORD_ACTIONS.map(action => ({
  formId: action.key.replace('get-', ''),
  formTitle: action.name,
  type: action.type
})) 