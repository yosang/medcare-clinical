// import { StrictMode } from 'react'

import { createRoot } from 'react-dom/client'

import './styles/main.css';
import 'react-loading-skeleton/dist/skeleton.css';

import App from './App.tsx'

import { Toaster } from 'sonner';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  //   <App />
  // </StrictMode>,
  <>
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
  <Toaster />
  </>
)
