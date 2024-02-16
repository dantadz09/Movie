import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from 'antd';
import axios from 'axios';

function Schedule() {
  const [movie, setMovie] = useState(null);
  const { movieId } = useParams();

  const bgImageSrc = "http://localhost:3000/cinema_bg.jpg"; // Define your background image source here

  useEffect(() => {
    async function fetchMovie() {
      try {
        const response = await axios.get(`http://localhost:1337/api/schedule/${movieId}`);
        if (response.status === 200) {
          setMovie(response.data.data);
        } else {
          throw new Error('Failed to fetch movie');
        }
      } catch (error) {
        console.error('Error fetching movie:', error);
      }
    }

    fetchMovie();
  }, [movieId]);

  return (
    <div style={{ 
      backgroundImage: `url(${bgImageSrc})`, 
      backgroundSize: 'cover', 
      backgroundPosition: 'center', 
      minHeight: '81vh', 
      paddingTop: '60px' 
    }}>
      {movie && (
        <>
          <div className='container' style={{ width: '80%', margin: 'auto' }}>
            <div className='movie-container'> 
              <img src={movie.image} alt="Avengers" style={{ width: '30%', float: 'left', padding: '5px', boxShadow: '0 0 0 3px white' }}/>
            </div>
            <div className='movie-info' style={{ marginLeft: '32%', marginTop: '-45px' }}> 
              <p style={{ marginBottom: '2em', fontSize: '40px', fontFamily: 'Inter, sans-serif', color: 'white' }}>CINEMA {movie.cin_ID}</p>
              <p style={{ marginBottom: '2em', fontSize: '30px', fontFamily: 'Inter, sans-serif', fontWeight: '700', color: 'white' }}>{movie.title}</p>
              <p style={{ marginBottom: '-0.4em', fontSize: '35px', fontFamily: 'Inter, sans-serif', fontWeight: '800', color: 'white' }}>SHOWTIMES</p>
              {movie.airing_time && movie.airing_time.length > 0 && (
                <p style={{ fontSize: '20px', marginTop: '2em', marginBottom: '2em', fontFamily: 'Inter, sans-serif', color: 'white' }}>
                  {new Date(movie.airing_time[0].start_time).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              )}
              <div>
                {movie.airing_time && movie.airing_time.map((time, index) => (
                  <Link to={`/seat/${movie._id}/${time._id}`} key={index} style={{ marginRight: '10px' }}>
                    <Button type="primary" className={time.is_premiere ? "button-premiere" : "button-style"}>
                      {new Date(time.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                      {time.is_premiere ? (
                        <p style={{ marginBottom: '0', color: 'red' }}>Premiere</p>
                      ) : (
                        <p style={{ marginBottom: '0', color: 'white' }}>Normal</p>
                      )}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Schedule;
