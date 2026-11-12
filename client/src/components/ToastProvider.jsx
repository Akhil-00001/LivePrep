import React, { createContext, useCallback, useContext, useRef, useState } from 'react'

const ToastContext = createContext(null)

// Toast hook - exported separately for use in components
export const useToast = () => {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToast must be used inside ToastProvider')
  }

  return context
}

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const toastIdRef = useRef(0)

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback((message, type = 'info') => {
    const id = toastIdRef.current + 1
    toastIdRef.current = id

    setToasts((current) => [
      ...current,
      { id, message, type },
    ])

    setTimeout(() => removeToast(id), 3200)
  }, [removeToast])

  const confirmToast = useCallback((message, options = {}) => {
    const id = toastIdRef.current + 1
    toastIdRef.current = id

    return new Promise((resolve) => {
      const close = (result) => {
        removeToast(id)
        resolve(result)
      }

      setToasts((current) => [
        ...current,
        {
          id,
          message,
          type: 'confirm',
          confirmText: options.confirmText || 'Leave',
          cancelText: options.cancelText || 'Stay',
          onConfirm: () => close(true),
          onCancel: () => close(false),
        },
      ])
    })
  }, [removeToast])

  return (
    <ToastContext.Provider value={{ showToast, confirmToast }}>
      {children}

      <div aria-live='polite' className='fixed right-4 top-4 z-10000 flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3'>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role={toast.type === 'confirm' ? 'alertdialog' : 'status'}
            className={`floating border-l-[3px] p-4 ${
              toast.type === 'success'
                ? 'border-l-good'
                : toast.type === 'error'
                  ? 'border-l-bad'
                  : 'border-l-ink'
            }`}
          >
            <p className='leading-relaxed text-ink'>{toast.message}</p>

            {toast.type === 'confirm' && (
              <div className='mt-4 flex justify-end gap-2'>
                <button onClick={toast.onCancel} className='btn btn-secondary py-2'>
                  {toast.cancelText}
                </button>
                <button
                  onClick={toast.onConfirm}
                  className='btn bg-bad py-2 text-white hover:opacity-90'
                >
                  {toast.confirmText}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export default ToastProvider
