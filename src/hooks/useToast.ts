import { toast } from 'sonner'

export const useToast = () => {
  const success = (message: string, description?: string) => {
    toast.success(message, {
      description,
      duration: 4000,
    })
  }

  const error = (message: string, description?: string) => {
    toast.error(message, {
      description,
      duration: 5000,
    })
  }

  const info = (message: string, description?: string) => {
    toast.info(message, {
      description,
      duration: 4000,
    })
  }

  const warning = (message: string, description?: string) => {
    toast.warning(message, {
      description,
      duration: 4500,
    })
  }

  const loading = (message: string, description?: string) => {
    return toast.loading(message, {
      description,
    })
  }

  const promise = <T>(
    promise: Promise<T>,
    {
      loading: loadingMessage,
      success: successMessage,
      error: errorMessage,
    }: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: any) => string)
    }
  ) => {
    return toast.promise(promise, {
      loading: loadingMessage,
      success: successMessage,
      error: errorMessage,
    })
  }

  const custom = (message: string, options?: any) => {
    toast(message, options)
  }

  const dismiss = (toastId?: string | number) => {
    toast.dismiss(toastId)
  }

  return {
    success,
    error,
    info,
    warning,
    loading,
    promise,
    custom,
    dismiss,
  }
}

// Export some common toast patterns
export const showSuccessToast = (message: string, description?: string) => {
  toast.success(message, { description, duration: 4000 })
}

export const showErrorToast = (message: string, description?: string) => {
  toast.error(message, { description, duration: 5000 })
}

export const showInfoToast = (message: string, description?: string) => {
  toast.info(message, { description, duration: 4000 })
}

export const showWarningToast = (message: string, description?: string) => {
  toast.warning(message, { description, duration: 4500 })
}

export const showLoadingToast = (message: string, description?: string) => {
  return toast.loading(message, { description })
}

export const showPromiseToast = <T>(
  promise: Promise<T>,
  messages: {
    loading: string
    success: string | ((data: T) => string)
    error: string | ((error: any) => string)
  }
) => {
  return toast.promise(promise, messages)
}