import { toast } from 'sonner'

/**
 * success toast wrapper with styles for success {green}
 * @param message toast message
 */
export const successToast = (message: string, description?: string) => {
  toast.success(message, {
    className: 'bg-success! text-white!',
    description: description
  })
}

/**
 * error toast wrapper with styles for error {red}
 * @param message toast message
 */
export const errorToast = (message: string, description?: string) => {
  toast.error(message, {
    className: 'bg-destructive! text-white!',
    description: description
  })
}
