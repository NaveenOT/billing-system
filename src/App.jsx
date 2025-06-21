import { useState } from 'react';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import Bill from "./pages/Bill.jsx";
import Catalogue from "./pages/Catalogue.jsx";
import Navbar from './components/Navbar.jsx';

import './App.css'

function App() {
  return (
    <>
      
     <BrowserRouter>
      <div>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/bill' element={<Bill />} />
        <Route path='/catalogue' element={<Catalogue />} />
      </Routes>
      </div>
     </BrowserRouter>
     
    </>
  )
}

export default App
