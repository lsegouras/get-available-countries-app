// src/App.js
import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import CountryList from './pages/CountryList'
import CountryInfo from './pages/CountryInfo'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CountryList />} />
        <Route path="/country/:code" element={<CountryInfo />} />
      </Routes>
    </Router>
  )
}

export default App
