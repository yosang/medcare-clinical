import Content from "./components/layout/Content"
import Footer from "./components/layout/Footer"
import Header from "./components/layout/Header"
import { BrowserRouter, Routes, Route } from "react-router"
import BookingPage from "./pages/BookingPage"
import SearchPage from "./pages/SearchPage"
import RegisterPage from "./pages/RegisterPage"
import LoginPage from "./pages/LoginPage"

import styles from "./App.module.css";

function App() {

  return (
    <div className={styles.layout}>
    <BrowserRouter>
      <Header />
      <Content>
        <Routes>
          <Route path="/" element={<BookingPage />} />
          <Route path="/book" element={<SearchPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Content>
      <Footer />
    </BrowserRouter>
    </div>
  )
}

export default App
