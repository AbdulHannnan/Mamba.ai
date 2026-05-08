import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/react'
import { Variable } from 'lucide-react';
import { color } from 'framer-motion';
import { dark } from '@clerk/themes';

createRoot(document.getElementById('root')! as HTMLElement).render(
    <BrowserRouter>
     <ClerkProvider 
        appearance={{
            theme:dark,
            Variable: {
                colorPrimary: "#4f46e5",
                colorTextOnPrimaryBackground: "#ffffff",
            }
        }}
     >
        <App />
     </ClerkProvider>
    </BrowserRouter>
)