/**
 * @file contains all the handlers for image generation routes
 */
import { GenerateImageRoute } from './image-gen.routes'
import { AppRouteHandler } from '../../types'
import { generateImage as aiGenerateImage } from 'ai'
import { saveFile } from '../../lib/file-storage'
import { getProviderInstanceModel } from '../../lib/get-provider-instance'
import * as HTTP_STATUS_CODES from '../../constants/http-status-codes.constants'

// handler for image generation
export const generateImage: AppRouteHandler<GenerateImageRoute> = async (c) => {
  // get the prompt from request body
  const { prompt, model } = await c.req.json()

  // get the provider as per user model
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const modelProvider: any = await getProviderInstanceModel({
    model
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
  const { mediaUrl } = await saveFile({
    category: 'img-gen',
    base64: image.base64,
    extension: 'png'
  })

  // @TODO Store to db

  // return the image url
  return c.json({ imageUrl: mediaUrl }, HTTP_STATUS_CODES.OK)
}
