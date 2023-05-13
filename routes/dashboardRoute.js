const express = require('express')
const router = express.Router();
const { protect } = require('../middleware/authMiddleware')
const { getdashboardDetails } = require('../controllers/dashboardController')
router.get('/getdashboardDetails', protect, getdashboardDetails)

module.exports = router
