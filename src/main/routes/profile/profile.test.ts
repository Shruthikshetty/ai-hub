/* eslint-disable @typescript-eslint/ban-ts-comment */
import { execSync } from 'child_process'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import db from '../../db'
import { users } from '../../db/schema'
import router from './profile.index'
import createApp, { createTestApp } from '../../lib/create-app'
import { sql } from 'drizzle-orm'
import { testClient } from 'hono/testing'

describe('profile routes', () => {
  beforeAll(async () => {
    execSync('drizzle-kit push')

    // add dummy data into db

    await db.insert(users).values({
      name: 'John Doe',
      age: 22,
      city: 'New York'
    })
  })

  afterAll(async () => {
    //clean up db
    const tableNames = ['users']
    // drop all tables
    for (const table of tableNames) {
      await db.run(sql.raw(`DELETE FROM ${table}`))
    }
  })
  //METHOD 1
  it('should return profile /profile GET', async () => {
    const client = createTestApp(router)
    const response = await client.request('/api/profile')
    const result = await response.json()
    console.log(result)
    // expect the result to have a data property
    expect(result).toHaveProperty('data')

    expect(result.data).toEqual(
      expect.objectContaining({
        name: 'John Doe',
        age: 22,
        city: 'New York'
      })
    )
  })
  //METHOD 2 typesafty
  it('should be able to update the data, profile PATCH', async () => {
    const client = testClient(createApp().route('/', router))
    const response = await client.profile.$patch({
      json: {
        name: 'John Doe 2',
        age: 23,
        city: 'New York 2'
      }
    })
    expect(response.status).toBe(200)
    // get the result
    const result = await response.json()
    //@ts-expect-error
    expect(result.data).toEqual(
      expect.objectContaining({
        name: 'John Doe 2',
        age: 23,
        city: 'New York 2'
      })
    )
  })
})
