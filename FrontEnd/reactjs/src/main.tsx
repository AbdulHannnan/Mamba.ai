import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/react';
import { dark } from '@clerk/themes';

// Vite env variable
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// This helps you catch .env issues clearly
if (!PUBLISHABLE_KEY) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY in .env file');
}

createRoot(document.getElementById('root')! as HTMLElement).render(
  <BrowserRouter>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      appearance={{
        theme: dark,

        // It is "variables", not "Variable"
        variables: {
          colorPrimary: '#4f46e5',
          colorTextOnPrimaryBackground: '#ffffff',
        },
      }}
    >
      <App />
    </ClerkProvider>
  </BrowserRouter>
);