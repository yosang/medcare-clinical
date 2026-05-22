import Main from "./components/layout/Main"
import Header from "./components/layout/Header"
import { BrowserRouter, Routes, Route } from "react-router"
import BookingPage from "./pages/BookingPage"
import RegisterPage from "./pages/RegisterPage"
import LoginPage from "./pages/LoginPage"

import styles from "./App.module.css";
import SearchPage from "./pages/SearchPage"

function App() {

  return (
    <div className={styles.layout}>
    <BrowserRouter>
      <Header />
      <Main>
        <Routes>
          <Route path="/" element={<BookingPage />} />
          <Route path="/book" element={<BookingPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Main>
    </BrowserRouter>
    </div>
  )
}

export default App
