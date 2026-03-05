/** this @file contains the validation schema used for updating user profile details */

import { z } from 'zod'

export const updateUserProfileSchema = z.object({
  name: z.string('Name must be a string'),
  email: z.email('Email is Invalid')
})

export const updateUserProfileDefaultValues: UpdateUserProfileSchema = {
  name: '',
  email: ''
}
// create a type for the schema
export type UpdateUserProfileSchema = z.infer<typeof updateUserProfileSchema>
