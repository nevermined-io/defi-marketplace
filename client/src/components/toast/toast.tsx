import { toast as toastify } from 'react-toastify'
import type { ToastContent, ToastOptions } from 'react-toastify'
import CrossIcon from '../../../public/assets/blue-cross.svg'
import CheckIcon from '../../../public/assets/subscription-tick.svg'

export const toast = {
  ...toastify,
  success(
    content: ToastContent<unknown>,
    options?: ToastOptions<Record<string, never>> | undefined
  ) {
    return toastify.success(content, {
      icon: <CheckIcon />,
      ...options
    })
  },
  error(content: ToastContent<unknown>, options?: ToastOptions<Record<string, never>> | undefined) {
    return toastify.error(content, {
      icon: <CrossIcon />,
      ...options
    })
  }
}
