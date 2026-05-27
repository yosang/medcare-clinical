// import { StrictMode } from 'react'

import { createRoot } from 'react-dom/client'

import './styles/main.css';
import 'react-loading-skeleton/dist/skeleton.css';

import App from './App.tsx'

import { Toaster } from 'sonner';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000, // marks data as stale after 1 minute
      refetchOnWindowFocus: true // if the user switches tab, this will refetch when they come back
    }
  }
});

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
