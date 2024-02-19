import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal } from "antd";

function Cancel() {
  const [reservations, setReservations] = useState([]);
  const [filteredReservationId, setFilteredReservationId] = useState("");
  const [filteredReservation, setFilteredReservation] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [reservationIdToDelete, setReservationIdToDelete] = useState("");
  const bgImageSrc = "http://localhost:3000/bg.jpg";
  useEffect(() => {
    const getReservations = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:1337/api/get-all-reservations"
        );
        setReservations(response.data.data);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };

    getReservations();
  }, []);
  //checks the input value in the filter
  const handleInputChange = (event) => {
    setFilteredReservationId(event.target.value);
  };
  //filter function
  const handleFilter = () => {
    const reservation = reservations.find(
      (reservation) =>
        reservation.ticket_number === parseInt(filteredReservationId)
    );
    if (reservation) {
      setFilteredReservation(reservation);
    } else {
      setFilteredReservation(null);
    }
  };

  //delete button on click
  const handleDelButtonClick = (reservationId) => {
    setReservationIdToDelete(reservationId);
    setDeleteModalVisible(true);
  };
  //handle confirm button
  const handleDeleteConfirmed = async () => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:1337/api/update-reservation/${reservationIdToDelete}`,
        {
          is_cancelled: true,
        }
      );
      setDeleteModalVisible(false);
      window.location.reload();
    } catch (error) {
      console.error("Error", error);
    }
  };

  const handleDeleteCancelled = () => {
    setDeleteModalVisible(false);
  };

  return (
    <div
      style={{
        backgroundImage: `url(${bgImageSrc})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "85vh",
        paddingTop: "20px",
      }}
    >
      <div className="back-container"></div>
      <div className="cancel-container">
        <div className="reserve-container">Reserved Tickets</div>
        <br></br>
        <br></br>
        <table className="ticket-container">
          <thead
            style={{
              position: "sticky",
              top: 0,
              backgroundColor: "#f0f0f0",
              zIndex: 1,
            }}
          >
            <tr>
              <th>Ticket Number</th>
              <th>Title</th>
              <th>Airing Time</th>
              <th>Seat</th>
              <th>Total</th>
              <th>Senior Citizen</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody style={{ height: "100px", overflowY: "auto" }}>
            {filteredReservation ? (
              <tr key={filteredReservation.id}>
                <td>{filteredReservation.ticket_number}</td>
                <td>{filteredReservation.title}</td>
                <td>
                  {new Date(filteredReservation.start_time).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </td>
                <td>
                  {filteredReservation.seat
                    .map((seat) => seat.seatNumber)
                    .join(", ")}
                </td>
                <td>{filteredReservation.total_price}</td>
                <td>{filteredReservation.senior_citizen}</td>
                <td>
                  <button
                    onClick={() => handleDelButtonClick(filteredReservation.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ) : (
              reservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td>{reservation.ticket_number}</td>
                  <td>{reservation.title}</td>
                  <td>
                    {new Date(reservation.start_time).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </td>
                  <td>
                    {reservation.seat.map((seat) => seat.seatNumber).join(", ")}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {reservation.total_price}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {reservation.senior_citizen}
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelButtonClick(reservation.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <Modal
          title="Confirmation"
          visible={deleteModalVisible}
          onOk={handleDeleteConfirmed}
          onCancel={handleDeleteCancelled}
          okText="Confirm"
          cancelText="Cancel"
        >
          <p>Are you sure you want to delete this reservation?</p>
        </Modal>
      </div>
      <div style={{ padding: "8px", marginLeft: "16em" }}>
        <label htmlFor="reservationId" style={{ color: "white" }}>
          Reservation ID:{" "}
        </label>
        <input
          type="text"
          id="reservationId"
          name="reservationId"
          value={filteredReservationId}
          onChange={handleInputChange}
        />
        <button
          onClick={handleFilter}
          style={{
            marginBottom: "10px",
            marginLeft: "10px",
            backgroundColor: "#001529",
            borderRadius: "5px",
            color: "white",
            padding: "3px 10px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Filter
        </button>
      </div>
    </div>
  );
}

export default Cancel;
