const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/states", async (req, res) => {
  try {
    const response = await axios.get(
      "https://countriesnow.space/api/v0.1/countries/states"
    );

    res.json({
      success: true,
      data: response.data.data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch states",
    });
  }
});

router.post("/districts", async (req, res) => {
  try {
    const { state } = req.body;

    const response = await axios.post(
      "https://countriesnow.space/api/v0.1/countries/state/cities",
      {
        country: "India",
        state,
      }
    );

    res.json({
      success: true,
      data: response.data.data || [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;