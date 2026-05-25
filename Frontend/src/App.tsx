import { lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route } from "react-router"

import Main from "./components/layout/Main"
import Header from "./components/layout/Header"

// Lazy load pages we dont want to load initially
const BookingPage = lazy(() => import("./pages/BookingPage"))
const RegisterPage = lazy(() => import("./pages/RegisterPage"))
const LoginPage = lazy(() => import("./pages/LoginPage"))
const SearchPage = lazy(() => import("./pages/SearchPage"))

import styles from "./App.module.css";

import { useEffect } from "react"
import { useLoginStore } from "./stores/useLoginStore"
import LoadingSpinner from "./components/layout/LoadingSpinner"

function App() {

  const { refreshAccessToken } = useLoginStore();

  useEffect(() => {

      refreshAccessToken();
    
  }, [refreshAccessToken])

  return (
    <div className={styles.layout}>
    <BrowserRouter>
      <Header />
      <Main>
        <Suspense fallback={<div className={styles.loading}><LoadingSpinner /> Loading...</div>}>
          <Routes>
              <Route path="/" element={<BookingPage />} />
              <Route path="/book" element={<BookingPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
          </Routes>
        </Suspense>
      </Main>
    </BrowserRouter>
    </div>
  )
}

export default App
