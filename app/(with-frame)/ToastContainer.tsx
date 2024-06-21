'use client'

import { XMarkIcon } from '@heroicons/react/24/outline'
import { toast, ToastBar, Toaster } from 'react-hot-toast'

export default function ToastContainer() {
  return (
    <Toaster
      position='bottom-left'
      reverseOrder={false}
      toastOptions={{
        success: {
          duration: 5000,
        },
        error: {
          duration: Infinity,
        },
      }}
    >
      {(t) => (
        <ToastBar toast={t} position='bottom-left'>
          {({ icon, message }) => (
            <>
              {icon}
              {message}
              {t.type !== 'loading' && (
                <button
                  className='size-6 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500'
                  onClick={() => toast.dismiss(t.id)}
                >
                  <span className='sr-only'>Close</span>
                  <XMarkIcon aria-hidden='true' />
                </button>
              )}
            </>
          )}
        </ToastBar>
      )}
    </Toaster>
  )
}
