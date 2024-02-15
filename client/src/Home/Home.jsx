import React, { useState, useCallback } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
import MyCarousel from './MyCarousel';

function Home() {
  const [selectedDate, setSelectedDate] = useState(moment());

  const handleDateChange = useCallback((date) => {
    setSelectedDate(date);
  }, []);
  const bgImageSrc = "http://localhost:3000/bg.jpg"; // Define your background image source here

  return (
    <div style={{ 
      backgroundImage: `url(${bgImageSrc})`, 
      backgroundSize: 'cover', 
      backgroundPosition: 'center', 
      minHeight: '85vh', 
      paddingTop: '1px' 
    }}>      
      <div className='title'>
        <h1 style ={{color: 'white'}}>Now Showing</h1>
        <DatePicker onChange={handleDateChange} allowClear={false}/>
      </div>
      <MyCarousel selectedDate={selectedDate} />
    </div>
  );
}

export default Home;
