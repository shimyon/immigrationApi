const express = require('express')
const router = express.Router();

const { LocationAdd, LocationsAll, LocationEdit, LocationById } = require('../controllers/locationController')

const { protect } = require('../middleware/authMiddleware')
router.post('/add', protect, LocationAdd);
router.post('/getAll', LocationsAll)
router.post('/edit', protect, LocationEdit)
router.get('/getbyid/:id', protect, LocationById)
module.exports = router