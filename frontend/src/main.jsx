import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './AuthProvider.jsx'
import { Toaster } from 'sonner'

createRoot(document.getElementById('root')).render(
    // <StrictMode>

    // Provides auth context to the entire app
    <AuthProvider>

        {/* Toaster for toast notifications */}
        <Toaster
            toastOptions={{
                style: {
                    background: '#202124',
                    minWidth: '200',
                    maxWidth: '400px',
                    width: 'fit-content',
                    wordBreak: 'break-word'
                },
            }}
            visibleToasts={2}
        />
        {/* Main app component */}
        <App />
    </AuthProvider >
    // </StrictMode>
)
