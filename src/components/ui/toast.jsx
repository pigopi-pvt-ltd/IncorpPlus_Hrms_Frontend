import { toast as sonnerToast } from "sonner"

// Export the Toaster component
export { Toaster } from "sonner"

// Export toast functions
export const toast = {
  success: (message) => {
    return sonnerToast.success(message)
  },
  error: (message) => {
    return sonnerToast.error(message)
  },
  info: (message) => {
    return sonnerToast.info(message)
  },
  warning: (message) => {
    return sonnerToast.warning(message)
  },
  message: (message) => {
    return sonnerToast(message)
  },
}
