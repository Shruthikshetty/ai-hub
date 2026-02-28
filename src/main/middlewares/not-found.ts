// middle ware to handle not found routes
import * as HTTP_STATUS_CODES from '../constants/http-status-codes.constants'
import { NotFoundHandler } from 'hono'

const handleNotFound: NotFoundHandler = (c) => {
  return c.json(
    {
      message: 'route not found'
    },
    HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY
  )
}

export default handleNotFound
