const express = require('express');
const router = express.Router();
const Reservation = require('../models/reserve.model');
// const Movie = require('../models/movie.model');
const mongoose = require('mongoose');

// get all reservations
router.get('/get-all-reservations', async (req, res) => {
    try {
        const reservations = await Reservation.find({ is_cancelled: false })
            .sort({ createdAt: -1 })
            .populate('mov_ID');

        const filteredAiringTimes = reservations.map(reservation => {
            const matchingAiringTime = reservation.mov_ID.airing_time.find(airingTime => airingTime._id.equals(reservation.airing_time));
            if (matchingAiringTime) {
                return {
                    id: reservation._id,
                    start_time: matchingAiringTime.start_time,
                    title: reservation.mov_ID.title,
                    seat: reservation.seat,
                    senior_citizen: reservation.senior_citizen,
                    total_price: reservation.total_price,
                    is_cancelled: reservation.is_cancelled
                };
            }
            return null; // If no matching airing time is found
        }).filter(Boolean); // Remove null entries

        res.send({
            success: true,
            message: "Airing times fetched successfully",
            data: filteredAiringTimes,
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
});

//get reserve
router.get('/get-seat/:id', async (req, res) => {
    console.log(req.body);
    try {
        const reservation = await Reservation.findById(req.params.id);
        res.send({
            success: true,
            message: "Reserve fetched successfully",
            data: reservation,
          });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', error: err.message });
    }
});

// Filter specific movie seats
router.get('/get-specific-reservations/:movieId/:airingTimeId', async (req, res) => {
    try {
        const reservations = await Reservation.find({
            mov_ID: req.params.movieId,
            airing_time: req.params.airingTimeId,
            is_cancelled: false // Filter by is_cancelled: false
        }).select('seat senior_citizen'); // Select the seat and senior_citizen fields

        console.log("Reservations:", reservations); // Log the result

        if (reservations.length > 0) {
            res.send({
                success: true,
                message: "Seat value fetched successfully",
                data: reservations
            });
        } else {
            res.send({
                success: false,
                message: "No reservations found for the specified movie, airing time, and not cancelled",
                data: []
            });
        }
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
});


// update reservation
router.post('/update-reservation/:id', async (req, res) => {
    console.log(req.body);
    try {
        const reservation = await Reservation.findByIdAndUpdate(req.params.id,req.body);
        res.send({
            success: true,
            message: "Movie updated successfully",
          });
        } catch (error) {
          res.send({
            success: false,
            message: error.message,
          });
    }
});

//add Reservation 
router.post('/add-reservation', async (req, res) => {
    console.log(req.body);
    try {
        const { mov_ID, airing_time, seat, discount, total_price, is_cancelled, senior_citizen } = req.body;

        const isValidObjectId = mongoose.Types.ObjectId.isValid(mov_ID);         // Ensure correct data types //F: pass the mov_ID(objectID)
        if (!isValidObjectId) {
            return res.status(400).json({ status: 'error', error: 'Invalid mov_ID' });
        }

        // Validate airing_time if needed
        //F: pass the airing_time (objectID)

        if (!Array.isArray(seat)
 || seat.some(item => typeof item !== 'object')) {         // Validate seat data    //F: if exists = not clickable color=red, else clickable color
            return res.status(400).json({ status: 'error', error: 'Invalid seat data' });
        }

        const reservation = await Reservation.create({
            mov_ID: new mongoose.Types.ObjectId(mov_ID),
            airing_time: new mongoose.Types.ObjectId(airing_time), // Assuming airing_time is already a valid ObjectId
            seat,
            discount,
            total_price,
            is_cancelled: false,
            senior_citizen
        });
        res.json({ status: 'ok', reservation });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', error: err.message });
    }
});

module.exports = router;
