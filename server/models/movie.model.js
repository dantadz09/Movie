const mongoose = require('mongoose');

const airingTimeSchema = new mongoose.Schema({
    start_time: Date,
    end_time: Date,
    is_premiere: Boolean,
    price: Number,
});

const movieSchema = new mongoose.Schema({
    cin_ID: String,
    title: String,
    image: String,
    airing_time: [airingTimeSchema] // Embedding airing time schema array
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
