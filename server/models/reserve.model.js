const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
    seatNumber: { type: String, required: true },
});

const reservationSchema = new mongoose.Schema({
    mov_ID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie', // Reference to the Movie model
        required: true
    },
    airing_time: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie.airing_time' // Reference to the airing_time subdocument within the Movie model
    },
    seat: [seatSchema],
    senior_citizen: Number,
    total_price: Number,
    is_cancelled: Boolean
});

const Reserve = mongoose.model('Reservation', reservationSchema);

module.exports = Reserve;