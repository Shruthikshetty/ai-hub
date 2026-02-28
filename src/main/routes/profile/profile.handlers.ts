/**
 * @file contains all the handlers related to profile
 */
import { AppRouteHandler } from '../../types'
import { GetProfileRoute, UpdateProfileRoute } from './profile.routes'
import * as HTTP_STATUS_CODES from '../../constants/http-status-codes.constants'
import db from '../../db'
import { users } from '../../db/schema'

// handler for getting profile data
export const getProfile: AppRouteHandler<GetProfileRoute> = async (c) => {
  // get the profile data from db
  const profileData = await db.query.users.findFirst()

  if (!profileData) {
    return c.json(
      {
        success: false,
        message: 'Profile not found'
      },
      HTTP_STATUS_CODES.NOT_FOUND
    )
  }

  // else return the profile data
  return c.json(
    {
      data: profileData,
      success: true
    },
    HTTP_STATUS_CODES.OK
  )
}

// handler for updating profile data
export const updateProfile: AppRouteHandler<UpdateProfileRoute> = async (c) => {
  // get the data from the route
  const data = c.req.valid('json')

  // update the profile data in db
  const [updatedProfileData] = await db.update(users).set(data).returning()

  // if profile data is not found
  if (!updatedProfileData) {
    return c.json(
      {
        success: false,
        message: 'Profile not found'
      },
      HTTP_STATUS_CODES.NOT_FOUND
    )
  }

  // return the updated profile data
  return c.json(
    {
      data: updatedProfileData,
      success: true
    },
    HTTP_STATUS_CODES.OK
  )
}
