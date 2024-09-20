import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css' // Add this line

type ToastStatus = 'success' | 'error' | 'info' | 'warning'

const notify = ({ status, message }: { status: ToastStatus; message: string }) => {
  console.log('Toast manager', status)
  // Ensure status is a valid key of toast
  toast[status](message, {
    position: 'top-right',
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
  })
}

const ToastManager = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      closeOnClick
      pauseOnHover
      draggable
      pauseOnFocusLoss
      newestOnTop={false}
      rtl={false}
      theme="light"
    />
  )
}

export { notify, ToastManager }
