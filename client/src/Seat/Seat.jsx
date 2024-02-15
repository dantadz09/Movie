import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SeatNumber from './SeatNumber';
import { Button, Card, Input, Modal } from 'antd';
import axios from 'axios';

function Seat() {
  const [movie, setMovie] = useState(null);
  const [selectedSeatCount, setSelectedSeatCount] = useState(0);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [discountCount, setDiscountCount] = useState(0);
  const [reservedSeats, setReservedSeats] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const { movieId, airingTimeId } = useParams();
  const bgImageSrc = "http://localhost:3000/cinema_bg.jpg"; // Define your background image source here

  useEffect(() => {
    async function fetchMovie() {
      try {
        const response = await axios.get(`http://localhost:1337/api/seat/${movieId}/${airingTimeId}`);
        if (response.status === 200) {
          setMovie(response.data.data.movie);
          const reservedSeatsResponse = await axios.get(`http://localhost:1337/api/get-specific-reservations/${movieId}/${airingTimeId}`, {
            params: {
              mov_ID: movieId,
              airing_time: airingTimeId
            }
          });
          if (reservedSeatsResponse.data.success) {
            setReservedSeats(reservedSeatsResponse.data.data);
          }
        } else {
          throw new Error('Failed to fetch movie');
        }
      } catch (error) {
        console.error('Error fetching movie:', error);
      }
    }

    fetchMovie();
  }, [movieId, airingTimeId]);

  const airingTime = movie && movie.airing_time && movie.airing_time.length > 0 ? movie.airing_time.find(time => time._id === airingTimeId) : null;
  const pricePerTicket = airingTime ? airingTime.price : 0;
  const airingTimeStart = airingTime ? new Date(airingTime.start_time).toLocaleString("en-US", { timeZone: "Asia/Manila" }) : 'Loading...';
  const subtotal = pricePerTicket * selectedSeatCount;
  const discountedPrice = Math.min((pricePerTicket * 0.8) * discountCount, pricePerTicket * selectedSeatCount);
  const temp = selectedSeatCount - discountCount;
  const total = Math.max((temp * pricePerTicket) + discountedPrice, 0);

  const handleDiscountChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value)) {
      // Convert the input value to a number
      const discount = parseInt(value);
      
      // Ensure that discount is within the range of 0 to selectedSeatCount
      if (discount >= 0 && discount <= selectedSeatCount) {
        setDiscountCount(discount);
      } else if (discount > selectedSeatCount) {
        // If discount exceeds selectedSeatCount, set it to selectedSeatCount
        setDiscountCount(selectedSeatCount);
      }
    }
  };
  

  const handleBuyNow = () => {
    if (selectedSeatCount === 0) {
      console.log("No seats selected. Reservation not made.");
      return;
    }

    setModalVisible(true);
  };

  const handleConfirm = async () => {
    try {
      const reservationData = {
        mov_ID: movie._id,
        airing_time: airingTimeId,
        seat: selectedSeats.map(seatNumber => ({ seatNumber })),
        total_price: total,
        senior_citizen: discountCount
      };

      const response = await axios.post('http://localhost:1337/api/add-reservation', reservationData);

      if (response.status === 200) {
        console.log('Reservation created successfully:', response.data);
        setModalVisible(false);
        window.location.reload(); // Refresh the page after successful reservation
      } else {
        throw new Error('Failed to create reservation');
      }
    } catch (error) {
      console.error('Error creating reservation:', error);
      setModalVisible(false);
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  return (
      <div style={{ 
      backgroundImage: `url(${bgImageSrc})`, 
      backgroundSize: 'cover', 
      backgroundPosition: 'center', 
      minHeight: '81vh', 
      paddingTop: '40px',
      width: '100%',
      margin: 'auto'
      }}>
      <div className='all-container' style={{marginLeft: '4em'}}>
      <div className='title-container' style={{ textAlign: 'center' }}>
        <h1 style={{color: 'white'}}>Cinema {movie ? movie.cin_ID : 'Loading...'}</h1>
      </div>
      {movie && (
        <>
          <div className='seat-box' style={{ width: '50%', float: 'left' }}>
            <SeatNumber
              setSelectedSeatCount={setSelectedSeatCount}
              setSelectedSeats={setSelectedSeats}
              reservedSeats={reservedSeats}
            />
            <div className='screen-box'>
              <h2>SCREEN</h2>
            </div>
          </div>
          <div className='info-box'>
            <h3 style={{ marginBottom: '1em',color: 'white' }}>Movie: {movie.title}</h3>
            <h3 style={{ marginBottom: '1em',color: 'white' }}>Date/Time: {airingTimeStart}</h3>
            <h3 style={{ marginBottom: '1em',color: 'white' }}>Tickets: {selectedSeatCount}</h3>
            <h3 style={{ marginBottom: '1em',color: 'white' }}>Seats: {selectedSeats.join(', ')}</h3>
            <h3 style={{ marginBottom: '1em',color: 'white' }}>Subtotal: &#8369;{subtotal.toFixed(2)}</h3>
            {movie.airing_time && movie.airing_time.some(time => airingTime.is_premiere) ? ( 
              <h3 style={{ marginBottom: '1em',color: 'white' }}>Discount not available for premiere</h3>
            ) : (
              <div style={{ marginBottom: '1em',color: 'white' }}>
                <h3 style={{ marginBottom: '0.5em',color: 'white' }}>Discount:</h3>
                <Input
                  type="number"
                  value={discountCount}
                  onChange={handleDiscountChange}
                  style={{ width: '120px' }} 
                />
              </div>
            )}
            <h3 style={{ marginBottom: '1em',color: 'white' }}>Total: &#8369;{total.toFixed(2)}</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1em' }}>
            <Button 
              type="primary" 
              onClick={handleBuyNow} 
              disabled={selectedSeats.length === 0 || discountCount > selectedSeatCount} 
              style={{ 
                background: 'white', 
                fontSize: '16px', 
                width: '8em', 
                height: '50px',
                color: 'black',
                fontWeight: 'bold' 
              }}
            >
              BUY NOW
            </Button>
            </div>
            <div className='card-box' style={{ display: 'flex', alignItems: 'center' }}>
              <Card style={{ backgroundColor: '#f0f2f5', width: '3em', height: '3em', marginRight: '1em' }} />
              <h3 style={{color: "white"}}>AVAILABLE</h3>
              <Card style={{ backgroundColor: '#2596be', width: '3em', height: '3em', marginLeft: '5em', marginRight: '1em' }}></Card>
              <h3 style={{color: "white"}}>SELECTED</h3>
            </div>
            <div className='card-box' style={{ display: 'flex', alignItems: 'center', marginTop: '2em' }}>
              <Card style={{ backgroundColor: 'red', width: '3em', height: '3em', marginRight: '1em', marginBottom: '3em' }}></Card>
              <h3 style={{ marginBottom: '3em', color: 'white' }}>SOLD</h3>
            </div>
          </div>
        </>
      )}
      <Modal
        title="Confirmation"
        visible={modalVisible}
        onOk={handleConfirm}
        onCancel={handleCancel}
        cancelText="Cancel"
        okText="Confirm"
      >
        <p>Are you sure you want to proceed with the reservation?</p>
      </Modal>
    </div>
    </div>
  );
}

export default Seat;
