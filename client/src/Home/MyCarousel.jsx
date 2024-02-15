import React, { useRef, useState, useEffect } from 'react';
import { Carousel, Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Link } from 'react-router-dom';

const MyCarousel = ({ selectedDate }) => {
  const carouselRef = useRef(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        console.log('Fetching movies for date:', selectedDate.format('YYYY-MM-DD'));
        const response = await axios.get('http://localhost:1337/api/get-all-movies', {
          params: { date: selectedDate.format('YYYY-MM-DD') }
        });
        console.log('Received movies:', response.data.data);
        setMovies(response.data.data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
      setLoading(false);
    };

    fetchMovies();
  }, [selectedDate]);

  console.log("Sorted movies:", movies);

  // Function to check if the airing date of a movie matches the selected date
  const isMovieOnSelectedDate = (movie) => {
    if (!movie || !movie.airing_time || movie.airing_time.length === 0) {
      return false;
    }
    const airingDate = new Date(movie.airing_time[0].start_time);
    return airingDate.toDateString() === selectedDate.toDate().toDateString();
  };

  const handlePrev = () => {
    if (carouselRef.current) {
      carouselRef.current.prev();
    }
  };

  const handleNext = () => {
    if (carouselRef.current) {
      carouselRef.current.next();
    }
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 2,
  };
  const filteredMovies = movies.filter(movie => isMovieOnSelectedDate(movie));

  // Sort movies by cin_ID in ascending order
  filteredMovies.sort((a, b) => a.cin_ID - b.cin_ID);

  return (
    <div style={{ width: '80%', margin: 'auto' }}>
      {loading && <div>Loading...</div>}
      {!loading && filteredMovies.length === 0 && <h1 style={{color: 'white', textAlign: 'center', marginTop: '7em'}}>No movies on this day</h1>}
      {!loading && filteredMovies.length > 0 && (
        <React.Fragment>
          <Carousel {...settings} ref={carouselRef}>
            {filteredMovies.map((movie, index) => (
              <div key={index} className='movie-container' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                <div className='cinema-container' style={{ textAlign: 'center' }}>
                  <h2 style={{color: 'white'}}>Cinema {movie.cin_ID}</h2>
                  <Link to={`/schedule/${movie._id}`}>
                    <div className='movie-item' style={{ display: 'inline-block' }}>
                      <img src={movie.image} alt={`Movie ${index * 2}`} style={{ width: '40%', display: 'block', margin: 'auto' }} />
                      <h2 style={{margin:'5px',color: 'white',fontSize:'20px',fontWeight:'400',textTransform:'uppercase'}}>{movie.title}</h2>
                      <h3 style={{margin:'3px',color: '#2596be',fontSize:'15px',fontWeight:'400'}}>Reserve Now</h3>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </Carousel>
          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <Button onClick={handlePrev} style={{ marginRight: '5px',marginBottom: '2em' }}>
              <LeftOutlined />
            </Button>
            <Button onClick={handleNext}>
              <RightOutlined />
            </Button>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default MyCarousel;
