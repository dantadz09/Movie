import React, { useState, useEffect } from "react";
import { Row, Col, Button, Modal } from "antd";
import { useNavigate } from "react-router-dom";
//render seat
function SeatNumber({ setSelectedSeatCount, setSelectedSeats, reservedSeats }) {
  const numRows = 8;
  const numCols = 5;
  const navigate = useNavigate(); // Initialize useNavigate hook

  const [selectedSeats, setSelectedSeatsState] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  //handle toggle seat
  const handleSeatChange = (seatNumber) => {
    const index = selectedSeats.indexOf(seatNumber);
    if (index === -1) {
      setSelectedSeatsState([...selectedSeats, seatNumber]);
    } else {
      setSelectedSeatsState(
        selectedSeats.filter((seat) => seat !== seatNumber)
      );
    }
  };

  // Update the count of selected seats whenever the selected seats change
  useEffect(() => {
    setSelectedSeatCount(selectedSeats.length);
    setSelectedSeats(selectedSeats); // Pass the array of selected seat values to the parent component
  }, [selectedSeats, setSelectedSeatCount, setSelectedSeats]);

  useEffect(() => {
    const totalSeats = numRows * numCols;
    const reservedSeatCount = reservedSeats?.reduce(
      (total, reservation) => total + reservation.seat.length,
      0
    );

    if (reservedSeatCount >= totalSeats && !modalVisible) {
      // Show modal indicating all seats are reserved
      setModalVisible(true); // Set modalVisible to true to prevent the modal from being shown again
      Modal.error({
        title: "All Seats Reserved",
        content: "All seats have been reserved!",
        onOk: () => {
          setModalVisible(false); // Reset modalVisible when the modal is closed
          navigate("/"); // Navigate back to home page
        },
      });
    }
  }, [reservedSeats, numRows, numCols, navigate, modalVisible]);

  const renderButtons = () => {
    const buttons = [];

    for (let row = numRows - 1; row >= 0; row--) {
      const rowButtons = [];
      for (let col = 0; col < numCols; col++) {
        const seatNumber = `${String.fromCharCode(65 + row)}${col + 1}`;
        const isReserved = reservedSeats?.some((reservation) =>
          reservation.seat?.some((seat) => seat.seatNumber === seatNumber)
        );
        const isSelected = selectedSeats.includes(seatNumber);
        const isDisabled = isReserved;
        const buttonStyle = {
          width: "80px",
          marginBottom: "1em",
          marginLeft: "2em",
          textAlign: "center",
          color: "black",
          backgroundColor: isReserved
            ? "red"
            : isSelected
            ? "primary"
            : "default", // Change background color to red if seat is reserved
        };

        rowButtons.push(
          <Col key={`${seatNumber}`} span={4}>
            <Button
              style={buttonStyle}
              type={isSelected ? "primary" : "default"}
              onClick={() => handleSeatChange(seatNumber)}
              disabled={isDisabled} // Disable the button if the seat is reserved
            >
              {seatNumber}
            </Button>
          </Col>
        );
      }
      buttons.push(
        <Row key={`row-${row}`} gutter={[8, 8]} justify="center">
          {rowButtons}
        </Row>
      );
    }
    return buttons;
  };

  return (
    <div>
      {renderButtons()} {/* Render the buttons */}
    </div>
  );
}

export default SeatNumber;
