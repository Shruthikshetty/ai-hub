import { and, eq, or } from 'drizzle-orm'
import { Catalog } from '../../common/schemas/model.schema'
import db from '../db'
import { models } from '../db/schema'
import { MODEL_INSERT_CHUNK_SIZE } from '../constants/config.constants'

export async function syncModelCatalog(remoteCatalog: Catalog) {
  // in case remote catalog is empty
  if (remoteCatalog.models.length === 0) {
    return { totalSynced: 0, preservedPreferences: 0 }
  }
  // new date
  const now = new Date()

  // create a transaction
  return db.transaction(async (tx) => {
    // save user added preferences on remote models
    const preferenceRows = await tx
      .select({
        providerId: models.providerId,
        id: models.id,
        isFavorite: models.isFavorite,
        isHidden: models.isHidden,
        sortOrder: models.sortOrder
      })
      .from(models)
      .where(
        and(eq(models.source, 'github'), or(eq(models.isFavorite, true), eq(models.isHidden, true)))
      )
    // create a map of the user preferences
    const preferenceMap = new Map(
      preferenceRows.map((row) => [`${row.providerId}::${row.id}`, row])
    )
    // delete all the git hub models from the local db
    await tx.delete(models).where(eq(models.source, 'github'))

    // merged the saved preferences into the remote models
    const rowsToInsert = remoteCatalog.models.map((model) => {
      const prefKey = `${model.providerId}::${model.id}`
      const savedPref = preferenceMap.get(prefKey)
      return {
        ...model,
        source: 'github' as const,
        isFavorite: savedPref?.isFavorite ?? false,
        isHidden: savedPref?.isHidden ?? false,
        sortOrder: savedPref?.sortOrder ?? 0,
        syncedAt: now
      }
    })

    // insert in chunks
    for (let i = 0; i < rowsToInsert.length; i += MODEL_INSERT_CHUNK_SIZE) {
      await tx
        .insert(models)
        .values(rowsToInsert.slice(i, i + MODEL_INSERT_CHUNK_SIZE))
        .onConflictDoNothing({
          target: [models.providerId, models.id] // composite primary key
        })
    }

    // return the stats
    return {
      totalSynced: rowsToInsert.length,
      preservedPreferences: preferenceRows.length
    }
  })
}
