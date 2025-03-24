import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './AuthProvider.jsx'
import { Toaster } from 'sonner'

createRoot(document.getElementById('root')).render(
    // <StrictMode>
    <AuthProvider>
        <Toaster
            toastOptions={{
                style: {
                    background: '#202124',
                },
            }}
        />
        <App />
    </AuthProvider >
    // </StrictMode>
)
