import { UserPatchSchema } from '@common/db-schemas/user.schema'

// default update user profile values
export const UPDATE_USER_DEFAULT_VALUES: UserPatchSchema = {
  name: undefined,
  email: undefined,
  age: undefined,
  city: undefined
}
