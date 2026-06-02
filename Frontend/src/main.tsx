// import { StrictMode } from 'react'

import { createRoot } from 'react-dom/client'

import './styles/main.css';
import 'react-loading-skeleton/dist/skeleton.css';

import App from './App.tsx'

import { Toaster } from 'sonner';

import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MissingENVError } from './api/errors/MissingENVError.ts';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000, // marks data as stale after 1 minute
      refetchOnWindowFocus: true, // if the user switches tab, this will refetch when they come back
      retry: 2
    },
  },
  queryCache: new QueryCache({
    onError: (err) => {
      if(err instanceof MissingENVError) console.log("Query Error:", err.message) // Logs the message of the error thrown to the console if its a missing env configuration error
    }
  }),
  mutationCache: new MutationCache({
    onError: (err) => {
      if(err instanceof MissingENVError) console.log("Mutation Error:", err.message)
    }
  })
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
