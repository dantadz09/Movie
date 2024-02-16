const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const seatSchema = new mongoose.Schema({
    seatNumber: { type: String, required: true },
});

const reservationSchema = new mongoose.Schema({
    reservationId: { type: Number, unique: true },
    mov_ID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie', // Reference to the Movie model
        required: true
    },
    airing_time: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie' // Reference to the airing_time subdocument within the Movie model
    },
    seat: [seatSchema],
    senior_citizen: Number,
    total_price: Number,
    is_cancelled: Boolean
});

// Apply the auto-increment plugin to the reservation schema
reservationSchema.plugin(AutoIncrement, {inc_field: 'reservationId'});

const Reserve = mongoose.model('Reservation', reservationSchema);

module.exports = Reserve;
