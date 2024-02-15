const express = require('express');
const router = express.Router();
const Movie = require('../models/movie.model');

router.post('/addMovie', async (req, res) => {
    console.log(req.body);
    try {
        const movie = await Movie.create({
            mov_ID: req.body.mov_ID,
            cin_ID: req.body.cin_ID,
            title: req.body.title,
            // desc: req.body.desc,
            price: req.body.price,
            airing_time: req.body.airing_time,
            image: req.body.image,
        });
        res.json({ status: 'ok', movie });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', error: err.message });
    }
});

router.get("/get-all-movies", async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.send({
      success: true,
      message: "Movies fetched successfully",
      data: movies,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
