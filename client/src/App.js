import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Home/Home';
import Schedule from './Schedule/Schedule';
import React from 'react';
import Seat from './Seat/Seat';
import Navbar from './components/Navbar';
import Cancel from './Cancel/Cancel';

function App() {
  return (
    <div>
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/schedule/:movieId' element={<Schedule/>} />
          <Route path='/seat/:movieId/:airingTimeId' element={<Seat />} />
          <Route path="/cancel" element={<Cancel />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
