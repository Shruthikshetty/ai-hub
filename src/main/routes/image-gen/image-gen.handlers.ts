/**
 * @file contains all the handlers for image generation routes
 */
import { GenerateImageRoute } from './image-gen.routes'
import { AppRouteHandler } from '../../types'
import { generateImage as aiGenerateImage } from 'ai'
import { saveFile, deleteMediaFile } from '../../lib/file-storage'
import { getProviderInstanceModel } from '../../lib/get-provider-instance'
import * as HTTP_STATUS_CODES from '../../constants/http-status-codes.constants'
import db from '../../db'
import { media } from '../../db/schema'

// handler for image generation
export const generateImage: AppRouteHandler<GenerateImageRoute> = async (c) => {
  // get the prompt from request body
  const { prompt, model } = c.req.valid('json')

  // get the provider as per user model
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const modelProvider: any = await getProviderInstanceModel({
    provider: model.provider
  })

  // check if provider is capable of generating images
  if (!modelProvider?.image) {
    return c.json(
      {
        message: 'This provider / model is not capable of generating images',
        success: false
      },
      HTTP_STATUS_CODES.BAD_REQUEST
    )
  }

  // generate image
  const { image } = await aiGenerateImage({
    model: modelProvider.image(model.id),
    prompt
  })

  // store the image in file and get the url
  const { mediaUrl, relativePath } = await saveFile({
    category: 'img-gen',
    base64: image.base64,
    extension: 'png'
  })

  //Store to db — if this fails, clean up the saved file to avoid orphans
  try {
    await db.insert(media).values({
      imageUrl: mediaUrl,
      relativePath: relativePath,
      type: 'image',
      prompt: prompt,
      modelId: model.id,
      provider: model.provider
    })
  } catch (err) {
    deleteMediaFile(relativePath)
    throw err
  }

  // return the image url
  return c.json({ imageUrl: mediaUrl, success: true }, HTTP_STATUS_CODES.OK)
}
