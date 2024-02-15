const express = require('express');
const router = express.Router();
const Movie = require('../models/movie.model');

router.get('/seat/:movieId/:airingTimeId', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.movieId);
        const airingTime = movie.airing_time.id(req.params.airingTimeId); // Accessing subdocument by id
        res.send({
            success: true,  
            message: "Movie fetched successfully",
            data: { movie, airingTime }, // Sending both movie and airingTime in the response
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', error: err.message });
    }
});

module.exports = router;
