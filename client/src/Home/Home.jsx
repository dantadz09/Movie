import React, { useState, useCallback } from "react";
import { DatePicker } from "antd";
import moment from "moment";
import MyCarousel from "./MyCarousel";
import axios from "axios";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);
function Home() {
  const [selectedDate, setSelectedDate] = useState(moment());
  const [movieExists, setMovieExists] = useState(false);

  const handleDateChange = useCallback((date) => {
    setSelectedDate(date);
    checkMovieExistence(date);
  }, []);

  // Function to check if movies exist for the selected date
  const checkMovieExistence = async (date) => {
    try {
      const response = await axios.get(
        "http://localhost:1337/api/get-all-movies",
        {
          params: { date: date.format("YYYY-MM-DD") },
        }
      );
      setMovieExists(response.data.data.length > 0);
    } catch (error) {
      console.error("Error checking movie existence:", error);
    }
  };

  const bgImageSrc = "http://localhost:3000/bg.jpg"; // Define your background image source here

  return (
    <div
      style={{
        backgroundImage: `url(${bgImageSrc})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "85vh",
        paddingTop: "1px",
      }}
    >
      <div className="title">
        <h1 style={{ color: "white" }}>Now Showing</h1>
        <DatePicker
          onChange={handleDateChange}
          defaultValue={dayjs()}
          allowClear={false}
          inputStyle={{
            background: movieExists ? "blue" : "transparent",
            color: "white",
          }} // Change background color of input
        />
      </div>
      <MyCarousel selectedDate={selectedDate} />
    </div>
  );
}

export default Home;
