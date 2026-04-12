/**
 * @file contains all the handlers for video generation routes
 */
import { DeleteGeneratedVideoRoute, GenerateVideoRoute } from './video-gen.routes'
import { AppRouteHandler } from '../../types'
import { experimental_generateVideo as aiGenerateVideo } from 'ai'
import { saveFile, deleteMediaFile } from '../../lib/file-storage'
import { getProviderInstanceModel } from '../../lib/get-provider-instance'
import * as HTTP_STATUS_CODES from '../../constants/http-status-codes.constants'
import db from '../../db'
import { media } from '../../db/schema'
import { eq, and } from 'drizzle-orm'

// handler for video generation
export const generateVideo: AppRouteHandler<GenerateVideoRoute> = async (c) => {
  // get the prompt from request body
  const { prompt, model } = c.req.valid('json')

  // get the provider as per user model
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const modelProvider: any = await getProviderInstanceModel({
    provider: model.provider
  })

  // check if provider is capable of generating videos
  if (!modelProvider?.video) {
    return c.json(
      {
        message: 'This provider / model is not capable of generating videos',
        success: false
      },
      HTTP_STATUS_CODES.BAD_REQUEST
    )
  }

  // generate video
  const { video } = await aiGenerateVideo({
    model: modelProvider.video(model.id),
    prompt,
    // @TODO will be made configurable later
    duration: 5,
    aspectRatio: '16:9',
    resolution: '854x480'
  })

  // store the video in file and get the url
  const { mediaUrl, relativePath } = await saveFile({
    category: 'video-gen',
    base64: video.base64,
    extension: 'mp4'
  })

  //Store to db — if this fails, clean up the saved file to avoid orphans
  try {
    await db.insert(media).values({
      mediaUrl: mediaUrl,
      relativePath: relativePath,
      type: 'video',
      prompt: prompt,
      modelId: model.id,
      provider: model.provider
    })
  } catch (err) {
    deleteMediaFile(relativePath)
    throw err
  }

  // return the video url
  return c.json({ videoUrl: mediaUrl, success: true }, HTTP_STATUS_CODES.OK)
}

// handler to delete the generated video
export const deleteGeneratedVideo: AppRouteHandler<DeleteGeneratedVideoRoute> = async (c) => {
  // get the id from request params
  const { id } = c.req.valid('param')

  // get the video from db
  const video = await db.query.media.findFirst({
    where: and(eq(media.id, id), eq(media.type, 'video'))
  })

  // if video is not found, return error
  if (!video) {
    return c.json(
      {
        message: 'Video not found',
        success: false
      },
      HTTP_STATUS_CODES.NOT_FOUND
    )
  }

  // delete the video from file storage
  const deleted = deleteMediaFile(video.relativePath)
  if (!deleted) {
    return c.json(
      {
        message: 'Failed to delete video',
        success: false
      },
      HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
    )
  }

  // delete the video from db
  await db.delete(media).where(and(eq(media.id, id), eq(media.type, 'video')))

  // return success response
  return c.json({ success: true, message: 'Successfully deleted the video' }, HTTP_STATUS_CODES.OK)
}
