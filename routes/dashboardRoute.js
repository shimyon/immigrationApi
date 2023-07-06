const express = require('express')
const router = express.Router();
const { protect } = require('../middleware/authMiddleware')
const { getdashboardDetails, admindashboard } = require('../controllers/dashboardController')
router.post('/getdashboardDetails', protect, getdashboardDetails)
router.post('/admindashboard', protect, admindashboard)

module.exports = router
